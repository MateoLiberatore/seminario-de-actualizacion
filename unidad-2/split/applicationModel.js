export class ApplicationModel
{
    constructor()
    {
        this.maxLoginFailedAttempts = 3;
        this.productData =
        {
            1:  { id: 1,  name: "Lavandina x 1L",        price: 875.25,  stock: 3000 },
            4:  { id: 4,  name: "Detergente x 500mL",    price: 1102.45, stock: 2010 },
            22: { id: 22, name: "Jabón en polvo x 250g", price: 650.22,  stock: 407 }
        };
        this.authData = new Map();
        this.initUserData();
    }

    initUserData()
    {
        const userData =
        {
            user_1: { id: 1, name: 'scorpion', password: '987654', failedLoginCounter: 0, isLocked: false, category: 'admin' },
            user_2: { id: 2, name: 'subZero', password: '987654', failedLoginCounter: 0, isLocked: false, category: 'seller' },
            user_3: { id: 3, name: 'deadpool', password: '987654', failedLoginCounter: 0, isLocked: false, category: 'worker' },
            user_4: { id: 4, name: 'liukang', password: '987654', failedLoginCounter: 0, isLocked: false, category: 'client' }
        };

        for (const key in userData)
        {
            if (userData.hasOwnProperty(key))
            {
                this.authData.set(userData[key].name, userData[key]);
            }
        }
    }

    authenticateUser(username, password)
    {
        const user = this.authData.get(username);

        if (!user) {
            return { status: false, result: "USER_NOT_FOUND" };
        }

        if (user.isLocked) {
            return { status: false, result: "BLOCKED_USER" };
        }

        if (user.password !== password) {
            user.failedLoginCounter++;
            if (user.failedLoginCounter >= this.maxLoginFailedAttempts) {
                user.isLocked = true;
                return { status: false, result: "BLOCKED_USER" };
            }
            return { status: false, result: "USER_PASSWORD_FAILED" };
        }

        user.failedLoginCounter = 0;
        return { status: true, user: user };
    }

    getNextUserId() {
        let maxId = 0;
        this.authData.forEach(user => {
            if (user.id > maxId) {
                maxId = user.id;
            }
        });
        return maxId + 1;
    }

    checkUsernameExists(username) {
        return this.authData.has(username);
    }

    addUser(username, name, password, category) {
        if (this.authData.has(username)) {
            return { status: false, message: "USER_ALREADY_EXISTS" };
        }

        const newUserId = this.getNextUserId();
        const newUser = {
            id: newUserId,
            name: username,
            full_name: name,
            password: password,
            failedLoginCounter: 0,
            isLocked: false,
            category: category
        };
        this.authData.set(username, newUser);
        return { status: true, user_data: newUser };
    }

    updateUserPassword(username, newPassword) {
        const user = this.authData.get(username);
        if (user) {
            user.password = newPassword;
            return true;
        }
        return false;
    }

    isValidUserGetData(username) {
        return this.authData.get(username) || null;
    }

    getAllUsers() {
        return Array.from(this.authData.entries());
    }

    deleteUser(username) {
        const user = this.authData.get(username);
        if (!user) {
            return { status: false, message: "USER_NOT_FOUND" };
        }
        if (user.category === 'admin' && user.name === 'scorpion') {
            return { status: false, message: "CANNOT_DELETE_ADMIN" };
        }

        if (this.authData.delete(username)) {
            return { status: true, message: "USER_DELETED" };
        }
        return { status: false, message: "UNKNOWN_ERROR" };
    }

    editUser(oldUsername, newUsername, newName, newPassword, newCategory, newIsLocked) {
        const user = this.authData.get(oldUsername);
        if (!user) {
            return { status: false, message: "USER_NOT_FOUND" };
        }

        if (oldUsername !== newUsername) {
            if (this.authData.has(newUsername)) {
                return { status: false, message: "NEW_USERNAME_ALREADY_EXISTS" };
            }
            this.authData.delete(oldUsername);
            user.name = newUsername;
            this.authData.set(newUsername, user);
        }

        user.full_name = newName;
        user.password  = newPassword;
        user.category  = newCategory;
        user.isLocked  = newIsLocked;

        if (!newIsLocked && user.failedLoginCounter > 0) {
            user.failedLoginCounter = 0;
        }

        return { status: true, user: user };
    }

    passHealth(password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length >= 2;
        const isAlphaNumeric = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(password);
        const isLengthValid = password.length >= 8 && password.length <= 16;

        return hasUpperCase && hasNumber && hasSpecialChar && isAlphaNumeric && isLengthValid;
    }

    getNextProductId() {
        let maxId = 0;
        for (const id in this.productData) {
            if (this.productData.hasOwnProperty(id) && parseInt(id) > maxId) {
                maxId = parseInt(id);
            }
        }
        return maxId + 1;
    }

    addProduct(name, price, stock) {
        const newProductId = this.getNextProductId();
        const newProduct = {
            id: newProductId,
            name: name,
            price: price,
            stock: stock
        };
        this.productData[newProductId] = newProduct;
        return { status: true, product: newProduct };
    }

    searchProduct(searchTerm) {
        const found = [];
        for (const id in this.productData) {
            if (this.productData.hasOwnProperty(id)) {
                const product = this.productData[id];
                if (product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    found.push(product);
                }
            }
        }
        return found;
    }

    deleteProduct(id) {
        if (this.productData.hasOwnProperty(id)) {
            delete this.productData[id];
            return { status: true, message: "PRODUCT_DELETED" };
        }
        return { status: false, message: "PRODUCT_NOT_FOUND" };
    }

    getProductById(id) {
        return this.productData[id] || null;
    }

    getAllProducts() {
        return Object.values(this.productData);
    }

    updateProduct(id, newName, newPrice, newStock) {
        if (this.productData.hasOwnProperty(id)) {
            let product = this.productData[id];
            product.name = newName;
            product.price = newPrice;
            product.stock = newStock;
            return { status: true, product: product };
        }
        return { status: false, message: "PRODUCT_NOT_FOUND" };
    }

    processPurchase(cartItems) {
        let total = 0;
        let purchaseSummary = [];

        const tempStocks = {};
        for (const id in this.productData) {
            if (this.productData.hasOwnProperty(id)) {
                tempStocks[id] = this.productData[id].stock;
            }
        }

        for (let item of cartItems) {
            const productId = item.productId;
            const quantity = item.quantity;
            const product = this.productData[productId];

            if (!product || tempStocks[productId] < quantity || quantity <= 0) {
                return { status: false, message: "INVALID_ITEM_OR_STOCK" };
            }

            let subtotal = product.price * quantity;
            tempStocks[productId] -= quantity;
            total += subtotal;
            purchaseSummary.push({ productId: productId, product: product.name, quantity: quantity, subtotal: subtotal });
        }

        for (const id in tempStocks) {
            if (tempStocks.hasOwnProperty(id)) {
                this.productData[id].stock = tempStocks[id];
            }
        }

        return { status: true, total: total, summary: purchaseSummary };
    }
}