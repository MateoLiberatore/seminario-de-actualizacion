// applicationUI.js

export class ApplicationUI 
{
    constructor(applicationModel) 
    {
        this.model = applicationModel;
    }

    // UI Utilities
    showAlert(message) 
    {
        alert(message);
    }

    getPrompt(message, defaultValue = '') 
    {
        return window.prompt(message, defaultValue);
    }

    getConfirm(message) 
    {
        return window.confirm(message);
    }


    async main() 
    { 
        while (true) 
        {
            let option = this.getPrompt(`Menú principal:\n1. Iniciar sesión\n2. Crear usuario\nX. Salir`);

            if (!option || option.toLowerCase() === 'x') 
            {
                this.showAlert('Saliendo...');
                break;
            }

            let loginResult = null;

            switch (option.toLowerCase())
            {
                case "1":
                    loginResult = await this.GUI_login();
                    break;
                case "2":
                    loginResult = await this.UI_addUser(); 
                    // algunas funciones pueden estar renombradas, nombres similares con el back end :]
                    break;
                default:
                    this.showAlert('Opción inválida');
                    continue;
            }

            if (loginResult && loginResult.status && loginResult.user) 
            {
                this.menuSelector(loginResult.user);
            }
        }
    }

    async GUI_login() 
    {
        let attempts = 0;
        while (attempts < this.model.maxLoginFailedAttempts) 
            {
                let username = this.getPrompt("Ingrese su nombre de usuario:");
                let password = this.getPrompt("Ingrese su contraseña:");

            if (username === null || password === null) 
            {
                this.showAlert("Inicio de sesión cancelado.");
                return { status: false, result: 'LOGIN_CANCELLED' };
            }

            let api_return = this.model.authenticateUser(username, password);

            if (api_return.status) 
            {
                this.showAlert("Usuario autenticado exitosamente");
                return api_return;
            }

            switch (api_return.result)
            {
                case 'BLOCKED_USER':
                    this.showAlert('Usuario bloqueado, contacte al administrador');
                    return api_return;
                case 'USER_PASSWORD_FAILED':
                    this.showAlert('Usuario y/o contraseña incorrecta');
                    attempts++;
                    break;
                case 'USER_NOT_FOUND':
                    this.showAlert('Usuario no encontrado.');
                    attempts++;
                    break;
                case 'INVALID_INPUT':
                    this.showAlert('Por favor, ingrese usuario y contraseña.');
                    attempts++;
                    break;
                default:
                    this.showAlert('Error desconocido');
                    return api_return;
            }
        }
        this.showAlert("Máximo de intentos alcanzado. Intente más tarde.");
        return { status: false, result: 'MAX_ATTEMPTS_REACHED' };
    }

    async passwordMenu(username) 
    {
        while (true) {
            let action = this.getPrompt("Ingrese una opción:\n1. Cambiar contraseña\nX. Volver al menú principal");

            if (action === null || action.toLowerCase() === 'x') 
            {
                this.showAlert("Volviendo al menú principal...");
                return;
            }

            if (action === "1") 
            {
                let valid_password = false;
                while (!valid_password) 
                {
                    let new_password = this.getPrompt(`Ingrese la nueva contraseña de: ${username}`);

                    if (new_password === null) 
                    {
                        this.showAlert("Cambio de contraseña cancelado.");
                        break;
                    }

                    if (this.model.passHealth(new_password)) 
                    {
                        const success = this.model.updateUserPassword(username, new_password);
                        if (success) 
                        {
                            this.showAlert(`Nueva contraseña de ${username}: ${new_password}`);
                            valid_password = true;
                        } 
                        else 
                        {
                            this.showAlert("Error al actualizar la contraseña.");
                        }
                    } 
                    else 
                    {
                        this.showAlert(` La contraseña debe cumplir con:
                            - Ser alfanumérica
                            - Al menos 1 letra mayúscula
                            - Entre 8 y 16 caracteres
                            - Al menos 2 caracteres especiales
                            - Al menos 1 número`); 
                    }
                }
                return;
            } 
            else 
            {
                this.showAlert("Opción inválida, intente de nuevo.");
            }
        }
    }

    
    async UI_addUser() 
    {
        this.showAlert(`Formulario de creación de usuario.\nComplete los siguientes campos:`);

        let username;
        let password;
        let name;

        let unique_name = false;
        while (!unique_name) 
        {
            username = this.getPrompt('Ingrese nombre del usuario:');

            if (username === null) return null;

            if (this.model.checkUsernameExists(username)) 
            {
                this.showAlert('Nombre en uso, ingrese uno distinto');
            } 
            else 
            {
                unique_name = true;
            }
        }

        let healthy_password = false;

        while (!healthy_password) 
        {
            password = this.getPrompt('Ingrese nueva contraseña:');
            if (password === null) return null;

            if (this.model.passHealth(password)) 
            {
                healthy_password = true;
            } 
            else 
            {
                this.showAlert(` La contraseña debe cumplir con:
                    - Ser alfanumérica
                    - Al menos 1 letra mayúscula
                    - Entre 8 y 16 caracteres
                    - Al menos 2 caracteres especiales
                    - Al menos 1 número`);
            }
        }

        name = this.getPrompt('Ingrese su nombre completo:');
        if (name === null) return null;

        const category = 'client'; 

        if (this.getConfirm(
            `¿Desea crear el siguiente usuario?\n\n` +
            `- Usuario: ${username}\n` +
            `- Nombre: ${name}\n` +
            `- Contraseña: ${password}\n` +
            `- Categoria: ${category}`
        )) 
        {
            const result = this.model.addUser(username, name, password, category);
            if (result.status) 
            {
                this.showAlert('Usuario creado');
                return { status: true, user: result.user_data }; 
            } 
            else 
            {
                this.showAlert('Error al crear usuario.');
                return null;
            }
        } 
        else 
        {
            this.showAlert('Acción cancelada');
            return null;
        }
    }


    async shoppingCart() 
    {
        let cart = []; 
        let buy_end = false;
        let message = "Listado de productos:\n";

        const allProducts = this.model.getAllProducts();

        if (allProducts.length === 0) 
        {
            this.showAlert("No hay productos disponibles.");
            return;
        }

        for (let product of allProducts) 
        {
            message += `ID: ${product.id}\nNombre: ${product.name}\nPrecio: $${product.price}\nStock: ${product.stock}\n\n`;
        }

        if (!this.getConfirm("¿Desea ver el catálogo de productos y comprar?")) 
        {
            this.showAlert("Compra cancelada.");
            return;
        }

        this.showAlert(message);

        while (!buy_end) 
        {
            let added_item_id = parseInt(this.getPrompt('Ingrese ID del producto que quiere comprar:'));

            if (isNaN(added_item_id)) 
            {
                this.showAlert("ID de producto inválido.");
                continue;
            }

            let amount = parseInt(this.getPrompt('Ingrese la cantidad:'));
            if (isNaN(amount) || amount <= 0) 
            {
                this.showAlert("Cantidad inválida.");
                continue;
            }

            const item = this.model.getProductById(added_item_id);

            if (!item) 
            {
                this.showAlert("Producto no encontrado.");
                continue;
            }
            if (item.stock < amount)
            {
                this.showAlert(`Stock insuficiente. Stock disponible: ${item.stock}.`);
                continue;
            }

            // chequear 
            let existingCartItem = cart.find(cartItem => cartItem.productId === added_item_id);
            if (existingCartItem) 
            {
                existingCartItem.quantity += amount;
            } 
            else 
            {
                cart.push({ productId: added_item_id, quantity: amount });
            }

            if (!this.getConfirm('¿Desea agregar otro producto?')) 
            {
                buy_end = true;
            }
        }

        if (cart.length === 0) 
        {
            this.showAlert("No se agregaron productos al carrito.");
            return;
        }

        const purchaseResult = this.model.processPurchase(cart);

        if (purchaseResult.status) 
        {
            let final_message = 'Resumen de compra:\n\n';

            for (let itemSummary of purchaseResult.summary) 
            {
                final_message += `Producto: ${itemSummary.product}\nCantidad: ${itemSummary.quantity}\nSubtotal: $${itemSummary.subtotal}\n\n`;
            }
            final_message += `TOTAL A PAGAR: $${purchaseResult.total}`;
            this.showAlert(final_message);
        } 
        else 
        {
            this.showAlert(`Error al procesar la compra: ${purchaseResult.message}`);
        }
    }

    // --- Product CRUD UI ---
    async crud() 
    {
        while (true) 
        {
            let option = this.getPrompt(
                `Menú de productos:\n` +
                `1. Crear Producto\n` +
                `2. Buscar Producto\n` +
                `3. Eliminar Producto\n` +
                `4. Modificar Producto\n` +
                `x. Salir`
            );

            switch (option?.toLowerCase()) {
                case "1":
                    await this.addProductUI();
                    break;
                case "2":
                    await this.readProductUI();
                    break;
                case "3":
                    await this.deleteProductUI();
                    break;
                case "4":
                    await this.updateProductUI();
                    break;
                case "x":
                    return;
                default:
                    this.showAlert("Opción inválida");
            }
        }
    }

    async addProductUI() 
    {
        let new_name = this.getPrompt('Ingrese nombre del nuevo producto:');
        if (new_name === null) 
        {
            this.showAlert('Acción cancelada');
            return;
        }

        let new_price_str = this.getPrompt('Ingrese el precio del nuevo producto:');
        let new_price = parseFloat(new_price_str);

        if (isNaN(new_price) || new_price_str === null) 
        {
            this.showAlert('Precio inválido o acción cancelada');
            return;
        }

        let new_stock_str = this.getPrompt('Ingrese el stock del nuevo producto:');
        let new_stock = parseInt(new_stock_str);

        if (isNaN(new_stock) || new_stock_str === null) 
        {
            this.showAlert('Stock inválido o acción cancelada');
            return;
        }

        // producto comodin para generar el id antes de usarlo
        // el model ya maneja la generacion de id

        const tempProduct = { name: new_name, price: new_price, stock: new_stock };

        if (this.getConfirm(
            `Confirmar la creación del siguiente producto:\n\n` +
            `Nombre: ${tempProduct.name}\n` +
            `Precio: ${tempProduct.price}\n` +
            `Stock:  ${tempProduct.stock}`
        )) 
        {
            const result = this.model.addProduct(new_name, new_price, new_stock);
            if (result.status) 
            {
                this.showAlert('Producto creado con ID: ' + result.product.id);
            } 
            else 
            {
                this.showAlert('Error al crear el producto.');
            }
        } else {
            this.showAlert('Acción cancelada');
        }
    }

    async readProductUI() 
    {
        let search = this.getPrompt('Ingrese nombre del producto:');
        
        if (search === null) return;
        
        const foundProducts = this.model.searchProduct(search);

        if (foundProducts.length > 0) 
        {
            let message = "Productos encontrados:\n\n";
            for (let product of foundProducts) 
            {
                message += `Nombre: ${product.name}\nID: ${product.id}\nPrecio: ${product.price}\nStock: ${product.stock}\n\n`;
            }
            this.showAlert(message);
        } 
        else 
        {
            this.showAlert('Producto no encontrado.');
        }
    }

    async deleteProductUI() 
    {
        let id_str = this.getPrompt("Ingrese ID del producto a eliminar:");
        let id = parseInt(id_str);

        if (isNaN(id) || id_str === null) 
        {
            this.showAlert('ID inválido o acción cancelada');
            return;
        }

        const product = this.model.getProductById(id);

        if (!product) {
            this.showAlert('ID no encontrado');
            return;
        }

        if (this.getConfirm(
            `¿Borrar el siguiente producto?\n\n` +
            `Nombre: ${product.name}\n` +
            `ID:     ${product.id}\n` +
            `Precio: ${product.price}\n` +
            `Stock:  ${product.stock}`
        )) 
        {
            const result = this.model.deleteProduct(id);
            if (result.status) 
            {
                this.showAlert('Producto eliminado');
            } 
            else 
            {
                this.showAlert('Error al eliminar producto: ' + result.message);
            }
        } 
        else 
        {
            this.showAlert('Acción cancelada');
        }
    }

    async updateProductUI() 
    {
        let id_str = this.getPrompt("Ingrese ID del producto a modificar:");
        let id = parseInt(id_str);

        if (isNaN(id) || id_str === null) 
        {
            this.showAlert('ID inválido o acción cancelada');
            return;
        }

        const product = this.model.getProductById(id);
        if (!product) 
        {
            this.showAlert("ID no encontrado");
            return;
        }

        let new_name = this.getPrompt(`Nombre actual: ${product.name}\nNuevo nombre:`, product.name);
        if (new_name === null) 
        {
            this.showAlert("Modificación cancelada.");
            return;
        }

        let new_price_str = this.getPrompt(`Precio actual: ${product.price}\nNuevo precio:`, product.price.toString());
        let new_price = parseFloat(new_price_str);

        if (isNaN(new_price) || new_price_str === null) 
        {
            this.showAlert("Precio inválido o modificación cancelada.");
            return;
        }

        let new_stock_str = this.getPrompt(`Stock actual: ${product.stock}\nNuevo stock:`, product.stock.toString());
        let new_stock = parseInt(new_stock_str);

        if (isNaN(new_stock) || new_stock_str === null) 
        {
            this.showAlert("Stock inválido o modificación cancelada.");
            return;
        }

        if (this.getConfirm(
            `¿Confirmar los siguientes cambios?\n\n` +
            `Nombre: ${new_name}\n` +
            `Precio: ${new_price}\n` +
            `Stock: ${new_stock}`
        )) 
        {
            const result = this.model.updateProduct(id, new_name, new_price, new_stock);
           
            if (result.status) 
            {
                this.showAlert("Producto actualizado");
            } 
            else 
            {
                this.showAlert("Error al actualizar producto: " + result.message);
            }
        } 
        else 
        {
            this.showAlert("Modificación cancelada");
        }
    }

  
    async userAdminMenu() 
    {
        while (true) 
        {
            let option = this.getPrompt(
                `Menú de administración de usuarios:\n` +
                `1. Ver usuarios\n` +
                `2. Agregar usuario\n` +
                `3. Eliminar usuario\n` +
                `4. Editar usuario\n` +
                `X. Volver`
            );

            if (!option || option.toLowerCase() === 'x') 
            {
                return;
            }

            switch (option) {
                case "1":
                    this.viewUsersUI();
                    break;
                case "2":
                    await this.adminAddUserUI();
                    break;
                case "3":
                    await this.deleteUserUI();
                    break;
                case "4":
                    await this.editUserUI();
                    break;
                default:
                    this.showAlert("Opción inválida.");
            }
        }
    }

    viewUsersUI() 
    {
        const users = this.model.getAllUsers();
        let message = "Usuarios registrados:\n";

        if (users.length === 0) 
        {
            message += "No hay usuarios registrados.";
        } 
        else 
        {
            for (let [username, data] of users) 
            {
                message += `Usuario: ${username}\nID: ${data.id}\nNombre: ${data.name}\nCategoría: ${data.category}\nBloqueado: ${data.isLocked}\nIntentos fallidos: ${data.failedLoginCounter}\n\n`;
            }
        }
        this.showAlert(message);
    }

    async adminAddUserUI() 
    {
        this.showAlert(`Formulario de creación de usuario.\nComplete los siguientes campos:`);

        let category = null;
        let cat_selection = true;

        while (cat_selection) 
        {
            let option = this.getPrompt(
                `Seleccione una categoria para el usuario:\n` +
                `1. Administrador\n` +
                `2. Cliente\n` +
                `3. Trabajador\n` +
                `4. Vendedor\n`
            );

            if (option === null) 
            {
                this.showAlert("Creación de usuario cancelada.");
                return null;
            }

            switch (option) 
            {
                case "1": category = 'admin'; cat_selection = false; break;
                case "2": category = 'client'; cat_selection = false; break;
                case "3": category = 'worker'; cat_selection = false; break;
                case "4": category = 'seller'; cat_selection = false; break;
                default: this.showAlert("Opción inválida.");
            }
        }

        let username;
        let unique_name = false;

        while (!unique_name) 
        {
            username = this.getPrompt('Ingrese nombre del usuario:');

            if (username === null) return null;

            if (this.model.checkUsernameExists(username)) 
            {
                this.showAlert('Nombre en uso, ingrese uno distinto');
            }
            else 
            {
                unique_name = true;
            }
        }

        let password;
        let healthy_password = false;

        while (!healthy_password) 
        {
            password = this.getPrompt('Ingrese nueva contraseña:');

            if (password === null) return null;

            if (this.model.passHealth(password)) 
            {
                healthy_password = true;
            } 
            else 
            {
                this.showAlert(` La contraseña debe cumplir con:
                    - Ser alfanumérica
                    - Al menos 1 letra mayúscula
                    - Entre 8 y 16 caracteres
                    - Al menos 2 caracteres especiales
                    - Al menos 1 número`);
            }
        }

        let name = this.getPrompt('Ingrese su nombre completo:');
        if (name === null) return null;

        if (this.getConfirm(
            `¿Desea crear el siguiente usuario?\n\n` +
            `- Usuario: ${username}\n` +
            `- Nombre: ${name}\n` +
            `- Contraseña: ${password}\n` +
            `- Categoria: ${category}`
        )) 
        {
            const result = this.model.addUser(username, name, password, category);

            if (result.status) 
            {
                this.showAlert('Usuario creado');
                return { status: true, user_data: result.user_data };
            } 
            else 
            {
                this.showAlert('Error al crear usuario.');
                return null;
            }
        } 
        else 
        {
            this.showAlert('Acción cancelada');
            return null;
        }
    }

    async deleteUserUI() 
    {
        let username = this.getPrompt("Ingrese nombre de usuario a eliminar:");
        if (username === null) return;

        const result = this.model.deleteUser(username);

        if (result.status) 
        {
            this.showAlert("Usuario eliminado.");
        } 
        else 
        {
            if (result.message === "USER_NOT_FOUND") 
            {
                this.showAlert("Usuario no encontrado.");
            } 
            else if (result.message === "CANNOT_DELETE_ADMIN") 
            {
                this.showAlert("No se puede eliminar el usuario administrador principal.");
            } 
            else 
            {
                this.showAlert("Error al eliminar usuario.");
            }
        }
    }

    async editUserUI()
    {
        let username = this.getPrompt("Ingrese el nombre del usuario que desea editar:");
        if (username === null) return;

        let user = this.model.isValidUserGetData(username); // <-- Cambio aquí
        if (!user)
        {
            this.showAlert("Usuario no encontrado.");
            return;
        }
        this.showAlert(`Datos actuales del usuario:\nID: ${user.id}\nNombre: ${user.name}\nContraseña: ${user.password}\nIntentos fallidos: ${user.failedLoginCounter}\nBloqueado: ${user.isLocked}\nCategoría: ${user.category}`);

        let newUsername = this.getPrompt("Nuevo nombre de usuario:", username); // Capturar nuevo nombre de usuario
        if (newUsername === null)
        {
            this.showAlert("Edición cancelada.");
            return;
        }
        
        // Esto es para la propiedad 'name' del objeto de usuario
        let newName = this.getPrompt("Nuevo nombre completo:", user.name); 
        
        if (newName === null)
        {
            this.showAlert("Edición cancelada.");
            return;
        }

        let newPassword = this.getPrompt("Nueva contraseña:", user.password);
        if (newPassword === null)
        {
            this.showAlert("Edición cancelada.");
            return;
        }
        if (!this.model.passHealth(newPassword))
        {
            this.showAlert(`La nueva contraseña no cumple con los requisitos:
                - Ser alfanumérica
                - Al menos 1 letra mayúscula
                - Entre 8 y 16 caracteres
                - Al menos 2 caracteres especiales
                - Al menos 1 número`);
            return;
        }

        let newCategory = this.getPrompt("Nueva categoría (admin, seller, worker, client):", user.category);
        if (newCategory === null)
        {
            this.showAlert("Edición cancelada.");
            return;
        }
        if (!["admin", "seller", "worker", "client"].includes(newCategory))
        {
            this.showAlert("Categoría inválida.");
            return;
        }

        let newIsLocked_str = this.getPrompt("¿Está bloqueado? (true/false):", user.isLocked.toString());

        if (newIsLocked_str === null)
        {
            this.showAlert("Edición cancelada.");
            return;
        }
        let newIsLocked = (newIsLocked_str.toLowerCase() === "true");

        if (newIsLocked_str.toLowerCase() !== "true" && newIsLocked_str.toLowerCase() !== "false")
        {
            this.showAlert("Valor inválido para bloqueado (debe ser true o false).");
            return;
        }

        // Línea corregida: pasar newUsername como el segundo argumento
        const result = this.model.editUser(username, newUsername, newName, newPassword, newCategory, newIsLocked);
        if (result.status)
        {
            this.showAlert("Usuario actualizado correctamente.");
        }
        else
        {
            this.showAlert("Error al actualizar usuario: " + result.message);
        }
    }

    // --- User Specific Menus ---
    async adminMenu(user) 
    {
        let exitUserMenu = false;
        while (!exitUserMenu) {
            let subOption = this.getPrompt(
                `Menú de usuario (${user.name}):\n` +
                `Admin\n` +
                `1. Cambiar contraseña\n` +
                `2. Productos\n` +
                `3. Comprar\n` +
                `4. Usuarios\n` +
                `X. Volver al menú principal`
            );

            switch (subOption?.toLowerCase()) 
            {
                case "1":
                    await this.passwordMenu(user.name);
                    break;
                case "2":
                    await this.crud();
                    break;
                case "3":
                    await this.shoppingCart();
                    break;
                case "4":
                    await this.userAdminMenu();
                    break;
                case "x":
                    exitUserMenu = true;
                    break;
                default:
                    this.showAlert('Opción inválida');
                    break;
            }
        }
    }

    async clientMenu(user) 
    {
        let exitUserMenu = false;
        while (!exitUserMenu) 
        {
            let subOption = this.getPrompt(
                `Menú de usuario (${user.name}):\n` +
                `Client\n` +
                `1. Cambiar contraseña\n` +
                `2. Comprar\n` +
                `X. Volver al menú principal`
            );

            switch (subOption?.toLowerCase()) {
                case "1":
                    await this.passwordMenu(user.name);
                    break;
                case "2":
                    await this.shoppingCart();
                    break;
                case "x":
                    exitUserMenu = true;
                    break;
                default:
                    this.showAlert('Opción inválida');
                    break;
            }
        }
    }

    async workerMenu(user) 
    {
        let exitUserMenu = false;
        while (!exitUserMenu) 
        {
            let subOption = this.getPrompt(
                `Menú de usuario (${user.name}):\n` +
                `Worker\n` +
                `1. Cambiar contraseña\n` +
                `2. Productos\n` +
                `X. Volver al menú principal`
            );

            switch (subOption?.toLowerCase()) {
                case "1":
                    await this.passwordMenu(user.name);
                    break;
                case "2":
                    await this.crud();
                    break;
                case "x":
                    exitUserMenu = true;
                    break;
                default:
                    this.showAlert('Opción inválida');
                    break;
            }
        }
    }

    async sellerMenu(user) 
    {
        let exitUserMenu = false;
        while (!exitUserMenu) 
        {
            let subOption = this.getPrompt(
                `Menú de usuario (${user.name}):\n` +
                `Seller\n` +
                `1. Cambiar contraseña\n` +
                `2. Vender\n` +
                `X. Volver al menú principal`
            );

            switch (subOption?.toLowerCase()) {
                case "1":
                    await this.passwordMenu(user.name);
                    break;
                case "2":
                    await this.shoppingCart();  
                    break;
                case "x":
                    exitUserMenu = true;
                    break;
                default:
                    this.showAlert('Opción inválida');
                    break;
            }
        }
    }

    menuSelector(user) 
    {
        switch (user.category) {
            case 'admin':
                this.adminMenu(user);
                break;
            case 'seller':
                this.sellerMenu(user);
                break;
            case 'worker':
                this.workerMenu(user);
                break;
            case 'client':
                this.clientMenu(user);
                break;
            default:
                this.showAlert('Categoría de usuario inexistente');
                break;
        }
    }
}