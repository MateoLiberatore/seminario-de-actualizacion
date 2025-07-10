export class ApplicationUI {
  constructor(applicationModel) {
    this.model = applicationModel;
  }

  _setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  _getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  _eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  showAlert(message) {
    alert(message);
  }

  getPrompt(message, defaultValue = '') {
    return window.prompt(message, defaultValue);
  }

  getConfirm(message) {
    return window.confirm(message);
  }

  main() {
    while (true) {
      let option = this.getPrompt(`Menú principal:\n1. Iniciar sesión\n2. Crear usuario\nX. Salir`);

      if (!option || option.toLowerCase() === 'x') {
        this.showAlert('Saliendo...');
        break;
      }

      let loginResult = null;

      switch (option.toLowerCase()) {
        case "1":
          loginResult = this.GUI_login();
          break;
        case "2":
          loginResult = this.UI_addUser();
          break;
        default:
          this.showAlert('Opción inválida');
          continue;
      }

      if (loginResult && loginResult.status && loginResult.user) {
        this.menuSelector(loginResult.user);
      }
    }
  }

  GUI_login() {
    let attempts = 0;
    while (attempts < this.model.maxLoginFailedAttempts) {
      let username = this.getPrompt("Ingrese su nombre de usuario:");
      let password = this.getPrompt("Ingrese su contraseña:");

      if (username === null || password === null) {
        this.showAlert("Inicio de sesión cancelado.");
        return {
          status: false,
          result: 'LOGIN_CANCELLED'
        };
      }

      let api_return = this.model.authenticateUser(username, password);

      if (api_return.status) {
        this.showAlert("Usuario autenticado exitosamente");
        this._setCookie('loggedInUser', username, 1);
        return api_return;
      }

      switch (api_return.result) {
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
    return {
      status: false,
      result: 'MAX_ATTEMPTS_REACHED'
    };
  }

  passwordMenu(username) {
    while (true) {
      let action = this.getPrompt("Ingrese una opción:\n1. Cambiar contraseña\nX. Volver al menú principal");

      if (action === null || action.toLowerCase() === 'x') {
        this.showAlert("Volviendo al menú principal...");
        return;
      }

      if (action === "1") {
        let valid_password = false;
        while (!valid_password) {
          let new_password = this.getPrompt(`Ingrese la nueva contraseña de: ${username}`);

          if (new_password === null) {
            this.showAlert("Cambio de contraseña cancelado.");
            break;
          }

          if (this.model.passHealth(new_password)) {
            const success = this.model.updateUserPassword(username, new_password);
            if (success) {
              this.showAlert(`Nueva contraseña de ${username}: ${new_password}`);
              valid_password = true;
            } else {
              this.showAlert("Error al actualizar la contraseña.");
            }
          } else {
            this.showAlert(` La contraseña debe cumplir con:
                            - Ser alfanumérica
                            - Al menos 1 letra mayúscula
                            - Entre 8 y 16 caracteres
                            - Al menos 2 caracteres especiales
                            - Al menos 1 número`);
          }
        }
        return;
      } else {
        this.showAlert("Opción inválida, intente de nuevo.");
      }
    }
  }

  UI_addUser() {
    this.showAlert(`Formulario de creación de usuario.\nComplete los siguientes campos:`);

    let username;
    let password;
    let name;

    let unique_name = false;
    while (!unique_name) {
      username = this.getPrompt('Ingrese nombre del usuario:');

      if (username === null) return null;

      if (this.model.checkUsernameExists(username)) {
        this.showAlert('Nombre en uso, ingrese uno distinto');
      } else {
        unique_name = true;
      }
    }

    let healthy_password = false;

    while (!healthy_password) {
      password = this.getPrompt('Ingrese nueva contraseña:');
      if (password === null) return null;

      if (this.model.passHealth(password)) {
        healthy_password = true;
      } else {
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
      )) {
      const result = this.model.addUser(username, name, password, category);
      if (result.status) {
        this.showAlert('Usuario creado');
        return {
          status: true,
          user: result.user_data
        };
      } else {
        this.showAlert('Error al crear usuario.');
        return null;
      }
    } else {
      this.showAlert('Acción cancelada');
      return null;
    }
  }

  shoppingCart() {
    let cart = [];
    let buy_end = false;
    let message = "Listado de productos:\n";

    const allProducts = this.model.getAllProducts();

    if (allProducts.length === 0) {
      this.showAlert("No hay productos disponibles.");
      return;
    }

    for (let product of allProducts) {
      message += `ID: ${product.id}\nNombre: ${product.name}\nPrecio: $${product.price}\nStock: ${product.stock}\n\n`;
    }

    if (!this.getConfirm("¿Desea ver el catálogo de productos y comprar?")) {
      this.showAlert("Compra cancelada.");
      return;
    }

    this.showAlert(message);

    while (!buy_end) {
      let added_item_id = parseInt(this.getPrompt('Ingrese ID del producto que quiere comprar:'));

      if (isNaN(added_item_id)) {
        this.showAlert("ID de producto inválido.");
        continue;
      }

      let amount = parseInt(this.getPrompt('Ingrese la cantidad:'));
      if (isNaN(amount) || amount <= 0) {
        this.showAlert("Cantidad inválida.");
        continue;
      }

      const item = this.model.getProductById(added_item_id);

      if (!item) {
        this.showAlert("Producto no encontrado.");
        continue;
      }
      if (item.stock < amount) {
        this.showAlert(`Stock insuficiente. Stock disponible: ${item.stock}.`);
        continue;
      }

      let existingCartItem = cart.find(cartItem => cartItem.productId === added_item_id);
      if (existingCartItem) {
        existingCartItem.quantity += amount;
      } else {
        cart.push({
          productId: added_item_id,
          quantity: amount
        });
      }

      if (!this.getConfirm('¿Desea agregar otro producto?')) {
        buy_end = true;
      }
    }

    if (cart.length === 0) {
      this.showAlert("No se agregaron productos al carrito.");
      return;
    }

    const purchaseResult = this.model.processPurchase(cart);

    if (purchaseResult.status) {
      let final_message = 'Resumen de compra:\n\n';

      for (let itemSummary of purchaseResult.summary) {
        final_message += `Producto: ${itemSummary.product}\nCantidad: ${itemSummary.quantity}\nSubtotal: $${itemSummary.subtotal}\n\n`;
      }
      final_message += `TOTAL A PAGAR: $${purchaseResult.total}`;
      this.showAlert(final_message);
    } else {
      this.showAlert(`Error al procesar la compra: ${purchaseResult.message}`);
    }
  }

  crud() {
    while (true) {
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
          this.addProductUI();
          break;
        case "2":
          this.readProductUI();
          break;
        case "3":
          this.deleteProductUI();
          break;
        case "4":
          this.updateProductUI();
          break;
        case "x":
          return;
        default:
          this.showAlert("Opción inválida");
      }
    }
  }

  addProductUI() {
    let new_name = this.getPrompt('Ingrese nombre del nuevo producto:');
    if (new_name === null) {
      this.showAlert('Acción cancelada');
      return;
    }

    let new_price_str = this.getPrompt('Ingrese el precio del nuevo producto:');
    let new_price = parseFloat(new_price_str);

    if (isNaN(new_price) || new_price_str === null) {
      this.showAlert('Precio inválido o acción cancelada');
      return;
    }

    let new_stock_str = this.getPrompt('Ingrese el stock del nuevo producto:');
    let new_stock = parseInt(new_stock_str);

    if (isNaN(new_stock) || new_stock_str === null) {
      this.showAlert('Stock inválido o acción cancelada');
      return;
    }

    const tempProduct = {
      name: new_name,
      price: new_price,
      stock: new_stock
    };

    if (this.getConfirm(
        `Confirmar la creación del siguiente producto:\n\n` +
        `Nombre: ${tempProduct.name}\n` +
        `Precio: ${tempProduct.price}\n` +
        `Stock:  ${tempProduct.stock}`
      )) {
      const result = this.model.addProduct(new_name, new_price, new_stock);
      if (result.status) {
        this.showAlert('Producto creado con ID: ' + result.product.id);
      } else {
        this.showAlert('Error al crear el producto.');
      }
    } else {
      this.showAlert('Acción cancelada');
    }
  }

  readProductUI() {
    let search = this.getPrompt('Ingrese nombre del producto:');

    if (search === null) return;

    const foundProducts = this.model.searchProduct(search);

    if (foundProducts.length > 0) {
      let message = "Productos encontrados:\n\n";
      for (let product of foundProducts) {
        message += `Nombre: ${product.name}\nID: ${product.id}\nPrecio: ${product.price}\nStock: ${product.stock}\n\n`;
      }
      this.showAlert(message);
    } else {
      this.showAlert('Producto no encontrado.');
    }
  }

  deleteProductUI() {
    let id_str = this.getPrompt("Ingrese ID del producto a eliminar:");
    let id = parseInt(id_str);

    if (isNaN(id) || id_str === null) {
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
      )) {
      const result = this.model.deleteProduct(id);
      if (result.status) {
        this.showAlert('Producto eliminado');
      } else {
        this.showAlert('Error al eliminar producto: ' + result.message);
      }
    } else {
      this.showAlert('Acción cancelada');
    }
  }

  updateProductUI() {
    let id_str = this.getPrompt("Ingrese ID del producto a modificar:");
    let id = parseInt(id_str);

    if (isNaN(id) || id_str === null) {
      this.showAlert('ID inválido o acción cancelada');
      return;
    }

    const product = this.model.getProductById(id);
    if (!product) {
      this.showAlert("ID no encontrado");
      return;
    }

    let new_name = this.getPrompt(`Nombre actual: ${product.name}\nNuevo nombre:`, product.name);
    if (new_name === null) {
      this.showAlert("Modificación cancelada.");
      return;
    }

    let new_price_str = this.getPrompt(`Precio actual: ${product.price}\nNuevo precio:`, product.price.toString());
    let new_price = parseFloat(new_price_str);

    if (isNaN(new_price) || new_price_str === null) {
      this.showAlert("Precio inválido o modificación cancelada.");
      return;
    }

    let new_stock_str = this.getPrompt(`Stock actual: ${product.stock}\nNuevo stock:`, product.stock.toString());
    let new_stock = parseInt(new_stock_str);

    if (isNaN(new_stock) || new_stock_str === null) {
      this.showAlert("Stock inválido o modificación cancelada.");
      return;
    }

    if (this.getConfirm(
        `¿Confirmar los siguientes cambios?\n\n` +
        `Nombre: ${new_name}\n` +
        `Precio: ${new_price}\n` +
        `Stock: ${new_stock}`
      )) {
      const result = this.model.updateProduct(id, new_name, new_price, new_stock);

      if (result.status) {
        this.showAlert("Producto actualizado");
      } else {
        this.showAlert("Error al actualizar producto: " + result.message);
      }
    } else {
      this.showAlert("Modificación cancelada");
    }
  }

  userAdminMenu() {
    while (true) {
      let option = this.getPrompt(
        `Menú de administración de usuarios:\n` +
        `1. Ver usuarios\n` +
        `2. Agregar usuario\n` +
        `3. Eliminar usuario\n` +
        `4. Editar usuario\n` +
        `X. Volver`
      );

      if (!option || option.toLowerCase() === 'x') {
        return;
      }

      switch (option) {
        case "1":
          this.viewUsersUI();
          break;
        case "2":
          this.adminAddUserUI();
          break;
        case "3":
          this.deleteUserUI();
          break;
        case "4":
          this.editUserUI();
          break;
        default:
          this.showAlert("Opción inválida.");
      }
    }
  }

  viewUsersUI() {
    const users = this.model.getAllUsers();
    let message = "Usuarios registrados:\n";

    if (users.length === 0) {
      message += "No hay usuarios registrados.";
    } else {
      for (let [username, data] of users) {
        message += `Usuario: ${username}\nID: ${data.id}\nNombre: ${data.full_name}\nCategoría: ${data.category}\nBloqueado: ${data.isLocked}\nIntentos fallidos: ${data.failedLoginCounter}\n\n`;
      }
    }
    this.showAlert(message);
  }

  adminAddUserUI() {
    this.showAlert(`Formulario de creación de usuario.\nComplete los siguientes campos:`);

    let category = null;
    let cat_selection = true;

    while (cat_selection) {
      let option = this.getPrompt(
        `Seleccione una categoria para el usuario:\n` +
        `1. Administrador\n` +
        `2. Cliente\n` +
        `3. Trabajador\n` +
        `4. Vendedor\n`
      );

      if (option === null) {
        this.showAlert("Creación de usuario cancelada.");
        return null;
      }

      switch (option) {
        case "1":
          category = 'admin';
          cat_selection = false;
          break;
        case "2":
          category = 'client';
          cat_selection = false;
          break;
        case "3":
          category = 'worker';
          cat_selection = false;
          break;
        case "4":
          category = 'seller';
          cat_selection = false;
          break;
        default:
          this.showAlert("Opción inválida.");
      }
    }

    let username;
    let unique_name = false;

    while (!unique_name) {
      username = this.getPrompt('Ingrese nombre del usuario:');

      if (username === null) return null;

      if (this.model.checkUsernameExists(username)) {
        this.showAlert('Nombre en uso, ingrese uno distinto');
      } else {
        unique_name = true;
      }
    }

    let password;
    let healthy_password = false;

    while (!healthy_password) {
      password = this.getPrompt('Ingrese nueva contraseña:');

      if (password === null) return null;

      if (this.model.passHealth(password)) {
        healthy_password = true;
      } else {
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
      )) {
      const result = this.model.addUser(username, name, password, category);

      if (result.status) {
        this.showAlert('Usuario creado');
        return {
          status: true,
          user_data: result.user_data
        };
      } else {
        this.showAlert('Error al crear usuario.');
        return null;
      }
    } else {
      this.showAlert('Acción cancelada');
      return null;
    }
  }

  deleteUserUI() {
    let username = this.getPrompt("Ingrese nombre de usuario a eliminar:");
    if (username === null) return;

    const result = this.model.deleteUser(username);

    if (result.status) {
      this.showAlert("Usuario eliminado.");
    } else {
      this.showAlert(`Error al eliminar usuario: ${result.message}`);
    }
  }

  editUserUI() {
    let oldUsername = this.getPrompt("Ingrese el nombre de usuario a editar:");
    if (oldUsername === null) return;

    let user = this.model.isValidUserGetData(oldUsername);
    if (!user) {
      this.showAlert("Usuario no encontrado.");
      return;
    }

    let newUsername = this.getPrompt(`Nombre de usuario actual: ${oldUsername}\nNuevo nombre de usuario:`, oldUsername);
    if (newUsername === null) return;

    let newName = this.getPrompt(`Nombre completo actual: ${user.name}\nNuevo nombre completo:`, user.name);
    if (newName === null) return;

    let newPassword;
    let healthy_password = false;
    while (!healthy_password) {
      newPassword = this.getPrompt(`Contraseña actual: ${user.password}\nNueva contraseña:`);
      if (newPassword === null) return;
      if (this.model.passHealth(newPassword)) {
        healthy_password = true;
      } else {
        this.showAlert(`La contraseña debe cumplir con:
                            - Ser alfanumérica
                            - Al menos 1 letra mayúscula
                            - Entre 8 y 16 caracteres
                            - Al menos 2 caracteres especiales
                            - Al menos 1 número`);
      }
    }

    let newCategory = null;
    let cat_selection = true;
    while (cat_selection) {
      let option = this.getPrompt(
        `Categoría actual: ${user.category}\nSeleccione una nueva categoría:\n` +
        `1. Administrador\n` +
        `2. Cliente\n` +
        `3. Trabajador\n` +
        `4. Vendedor\n`
      );

      if (option === null) {
        this.showAlert("Edición de usuario cancelada.");
        return;
      }

      switch (option) {
        case "1":
          newCategory = 'admin';
          cat_selection = false;
          break;
        case "2":
          newCategory = 'client';
          cat_selection = false;
          break;
        case "3":
          newCategory = 'worker';
          cat_selection = false;
          break;
        case "4":
          newCategory = 'seller';
          cat_selection = false;
          break;
        default:
          this.showAlert("Opción inválida.");
      }
    }

    let newIsLocked;
    let locked_selection = true;
    while (locked_selection) {
      let option = this.getPrompt(`Estado de bloqueo actual: ${user.isLocked ? 'Bloqueado' : 'Desbloqueado'}\nCambiar estado de bloqueo?\n1. Bloquear\n2. Desbloquear`);
      if (option === null) {
        this.showAlert("Edición de usuario cancelada.");
        return;
      }
      switch (option) {
        case "1":
          newIsLocked = true;
          locked_selection = false;
          break;
        case "2":
          newIsLocked = false;
          locked_selection = false;
          break;
        default:
          this.showAlert("Opción inválida.");
      }
    }

    if (this.getConfirm(
        `¿Confirmar los siguientes cambios para el usuario ${oldUsername}?\n\n` +
        `Nuevo Usuario: ${newUsername}\n` +
        `Nuevo Nombre: ${newName}\n` +
        `Nueva Contraseña: ${newPassword}\n` +
        `Nueva Categoría: ${newCategory}\n` +
        `Nuevo Estado de Bloqueo: ${newIsLocked ? 'Bloqueado' : 'Desbloqueado'}`
      )) {
      const result = this.model.editUser(oldUsername, newUsername, newName, newPassword, newCategory, newIsLocked);
      if (result.status) {
        this.showAlert("Usuario actualizado.");
      } else {
        this.showAlert(`Error al actualizar usuario: ${result.message}`);
      }
    } else {
      this.showAlert("Edición de usuario cancelada.");
    }
  }

  menuSelector(user) {
    let userCategory = user.category;
    let username = user.name;
    this._setCookie('lastLoggedInUser', username, 30);

    while (true) {
      let option = null;
      let menuOptions = `Bienvenido ${username} (${userCategory})\nMenú principal:\n`;

      switch (userCategory) {
        case 'admin':
          menuOptions += `1. Administrar Productos\n2. Administrar Usuarios\n3. Cambiar Contraseña\nX. Cerrar Sesión`;
          option = this.getPrompt(menuOptions);
          switch (option?.toLowerCase()) {
            case "1":
              this.crud();
              break;
            case "2":
              this.userAdminMenu();
              break;
            case "3":
              this.passwordMenu(username);
              break;
            case "x":
              this.showAlert("Cerrando sesión.");
              this._eraseCookie('loggedInUser');
              return;
            default:
              this.showAlert("Opción inválida.");
          }
          break;

        case 'seller':
          menuOptions += `1. Administrar Productos\n2. Cambiar Contraseña\nX. Cerrar Sesión`;
          option = this.getPrompt(menuOptions);
          switch (option?.toLowerCase()) {
            case "1":
              this.crud();
              break;
            case "2":
              this.passwordMenu(username);
              break;
            case "x":
              this.showAlert("Cerrando sesión.");
              this._eraseCookie('loggedInUser');
              return;
            default:
              this.showAlert("Opción inválida.");
          }
          break;

        case 'worker':
          menuOptions += `1. Ver Productos\n2. Cambiar Contraseña\nX. Cerrar Sesión`;
          option = this.getPrompt(menuOptions);
          switch (option?.toLowerCase()) {
            case "1":
              this.readProductUI();
              break;
            case "2":
              this.passwordMenu(username);
              break;
            case "x":
              this.showAlert("Cerrando sesión.");
              this._eraseCookie('loggedInUser');
              return;
            default:
              this.showAlert("Opción inválida.");
          }
          break;

        case 'client':
          menuOptions += `1. Comprar Productos\n2. Cambiar Contraseña\nX. Cerrar Sesión`;
          option = this.getPrompt(menuOptions);
          switch (option?.toLowerCase()) {
            case "1":
              this.shoppingCart();
              break;
            case "2":
              this.passwordMenu(username);
              break;
            case "x":
              this.showAlert("Cerrando sesión.");
              this._eraseCookie('loggedInUser');
              return;
            default:
              this.showAlert("Opción inválida.");
          }
          break;

        default:
          this.showAlert("Categoría de usuario desconocida.");
          this._eraseCookie('loggedInUser');
          return;
      }
    }
  }
}