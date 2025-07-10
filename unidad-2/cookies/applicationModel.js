export class ApplicationModel {
  constructor() {
    this.maxLoginFailedAttempts = 3;
    this._loadData();
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

  _loadData() {
    const products = this._getCookie('productData');
    const auth = this._getCookie('authData');

    if (products && auth) {
      this.productData = JSON.parse(products);
      this.authData = new Map(JSON.parse(auth));
    } else {
      this._initProductData();
      this.authData = new Map();
      this.initUserData();
      this._saveAllData();
    }
  }

  _saveAuthData() {
    this._setCookie('authData', JSON.stringify(Array.from(this.authData.entries())), 7);
  }

  _saveProductData() {
    this._setCookie('productData', JSON.stringify(this.productData), 7);
  }

  _saveAllData() {
    this._saveAuthData();
    this._saveProductData();
  }

  _initProductData() {
    this.productData = {
      1: {
        id: 1,
        name: "Lavandina x 1L",
        price: 875.25,
        stock: 3000
      },
      4: {
        id: 4,
        name: "Detergente x 500mL",
        price: 1102.45,
        stock: 2010
      },
      22: {
        id: 22,
        name: "Jabón en polvo x 250g",
        price: 650.22,
        stock: 407
      }
    };
  }

  initUserData() {
    const userData = {
      user_1: {
        id: 1,
        name: 'scorpion',
        password: '987654',
        failedLoginCounter: 0,
        isLocked: false,
        category: 'admin'
      },
      user_2: {
        id: 2,
        name: 'subZero',
        password: '987654',
        failedLoginCounter: 0,
        isLocked: false,
        category: 'seller'
      },
      user_3: {
        id: 3,
        name: 'deadpool',
        password: '987654',
        failedLoginCounter: 0,
        isLocked: false,
        category: 'worker'
      },
      user_4: {
        id: 4,
        name: 'carlitos',
        password: '987654',
        failedLoginCounter: 0,
        isLocked: false,
        category: 'client'
      }
    };
    this.authData.set('scorpion', userData.user_1);
    this.authData.set('subZero', userData.user_2);
    this.authData.set('deadpool', userData.user_3);
    this.authData.set('carlitos', userData.user_4);
  }

  isValidUserGetData(username) {
    return this.authData.get(username) || null;
  }

  authenticateUser(username, password) {
    let api_return = {
      status: false,
      result: null,
      user: null
    };
    const invalid_values = [undefined, null, ''];

    if (invalid_values.includes(username) || invalid_values.includes(password)) {
      api_return.result = 'INVALID_INPUT';
      return api_return;
    }

    let user_data = this.isValidUserGetData(username);

    if (!user_data) {
      api_return.result = 'USER_NOT_FOUND';
      return api_return;
    }

    if (user_data.isLocked === false) {
      if (user_data.password === password) {
        api_return.status = true;
        api_return.result = 'AUTH_SUCCESS';
        api_return.user = user_data;
        user_data.failedLoginCounter = 0;
      } else {
        api_return.status = false;
        api_return.result = 'USER_PASSWORD_FAILED';
        user_data.failedLoginCounter++;
        if (user_data.failedLoginCounter === this.maxLoginFailedAttempts) {
          user_data.isLocked = true;
          api_return.result = 'BLOCKED_USER';
        }
      }
    } else {
      api_return.status = false;
      api_return.result = 'BLOCKED_USER';
    }

    this._saveAuthData();
    return api_return;
  }

  getLoggedUser(username) {
    return this.authData.get(username);
  }

  updateUserPassword(username, newPassword) {
    const user = this.authData.get(username);
    if (user) {
      user.password = newPassword;
      this._saveAuthData();
      return true;
    }
    return false;
  }

  passHealth(password) {
    const pass_requirements = {
      uppercase_minimum: 1,
      character_min: 8,
      character_max: 16,
      special_needed: 2,
      any_number: 1
    };
    if (!password) return false;
    let uppercase_check = password.match(/[A-Z]/g);
    let uppercase_amount = uppercase_check ? uppercase_check.length : 0;
    let password_length = password.length;
    let special_check = password.match(/[^a-zA-Z0-9]/g);
    let special_amount = special_check ? special_check.length : 0;
    let number_check = password.match(/\d/);
    let number_amount = number_check ? number_check.length : 0;
    return (
      uppercase_amount >= pass_requirements.uppercase_minimum &&
      password_length >= pass_requirements.character_min &&
      password_length <= pass_requirements.character_max &&
      special_amount >= pass_requirements.special_needed &&
      number_amount >= pass_requirements.any_number
    );
  }

  checkUsernameExists(username) {
    return this.authData.has(username);
  }

  addUser(username, name, password, category) {
    let maxId = 0;
    for (let user of this.authData.values()) {
      if (user.id > maxId) {
        maxId = user.id;
      }
    }
    let newId = maxId + 1;
    const new_user_data = {
      id: newId,
      name: name,
      password: password,
      failedLoginCounter: 0,
      isLocked: false,
      category: category
    };
    this.authData.set(username, new_user_data);
    this._saveAuthData();
    return {
      status: true,
      user_data: new_user_data,
      user: username
    };
  }

  deleteUser(username) {
    if (!this.authData.has(username)) {
      return {
        status: false,
        message: "USER_NOT_FOUND"
      };
    }
    if (username === "scorpion") {
      return {
        status: false,
        message: "CANNOT_DELETE_ADMIN"
      };
    }
    this.authData.delete(username);
    this._saveAuthData();
    return {
      status: true,
      message: "USER_DELETED"
    };
  }

  getAllUsers() {
    return Array.from(this.authData.entries());
  }

  editUser(oldUsername, newUsername, newName, newPassword, newCategory, newIsLocked) {
    let user = this.authData.get(oldUsername);
    if (!user) {
      return {
        status: false,
        message: "USER_NOT_FOUND"
      };
    }
    if (!["admin", "seller", "worker", "client"].includes(newCategory)) {
      return {
        status: false,
        message: "INVALID_CATEGORY"
      };
    }
    if (newIsLocked !== true && newIsLocked !== false) {
      return {
        status: false,
        message: "INVALID_LOCKED_STATUS"
      };
    }
    if (newUsername !== oldUsername && this.authData.has(newUsername)) {
      return {
        status: false,
        message: "USERNAME_ALREADY_EXISTS"
      };
    }
    if (newUsername !== oldUsername) {
      this.authData.delete(oldUsername);
    }
    let updatedUser = {
      id: user.id,
      name: newName,
      password: newPassword,
      failedLoginCounter: user.failedLoginCounter,
      isLocked: newIsLocked,
      category: newCategory
    };
    this.authData.set(newUsername, updatedUser);
    this._saveAuthData();
    return {
      status: true,
      message: "USER_UPDATED",
      user: updatedUser
    };
  }

  getAllProducts() {
    return Object.values(this.productData);
  }

  addProduct(name, price, stock) {
    let usedIds = Object.keys(this.productData).map(function(id) {
      return parseInt(id);
    }).sort(function(a, b) {
      return a - b;
    });
    let nextId = 1;
    for (let id of usedIds) {
      if (id === nextId) {
        nextId++;
      } else if (id > nextId) {
        break;
      }
    }
    let product = {
      id: nextId,
      name: name,
      price: price,
      stock: stock
    };
    this.productData[product.id] = product;
    this._saveProductData();
    return {
      status: true,
      product: product
    };
  }

  searchProduct(searchName) {
    searchName = searchName.toLowerCase();
    const foundProducts = [];
    for (let id in this.productData) {
      let product = this.productData[id];
      if (product.name.toLowerCase().includes(searchName)) {
        foundProducts.push(product);
      }
    }
    return foundProducts;
  }

  deleteProduct(id) {
    if (this.productData.hasOwnProperty(id)) {
      delete this.productData[id];
      this._saveProductData();
      return {
        status: true,
        message: "PRODUCT_DELETED"
      };
    }
    return {
      status: false,
      message: "PRODUCT_NOT_FOUND"
    };
  }

  getProductById(id) {
    return this.productData[id] || null;
  }

  updateProduct(id, newName, newPrice, newStock) {
    if (this.productData.hasOwnProperty(id)) {
      let product = this.productData[id];
      product.name = newName;
      product.price = newPrice;
      product.stock = newStock;
      this._saveProductData();
      return {
        status: true,
        product: product
      };
    }
    return {
      status: false,
      message: "PRODUCT_NOT_FOUND"
    };
  }

  processPurchase(cartItems) {
    let total = 0;
    let purchaseSummary = [];
    for (let item of cartItems) {
      const productId = item.productId;
      const quantity = item.quantity;
      const product = this.productData[productId];
      if (!product || product.stock < quantity || quantity <= 0) {
        return {
          status: false,
          message: "INVALID_ITEM_OR_STOCK"
        };
      }
      let subtotal = product.price * quantity;
      this.productData[productId].stock -= quantity;
      total += subtotal;
      purchaseSummary.push({
        product: product.name,
        quantity: quantity,
        subtotal: subtotal
      });
    }
    this._saveProductData();
    return {
      status: true,
      total: total,
      summary: purchaseSummary
    };
  }
}