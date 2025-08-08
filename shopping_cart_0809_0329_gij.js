// 代码生成时间: 2025-08-09 03:29:26
class ShoppingCart {
  /**
   * Initializes the ShoppingCart instance with an empty cart.
   */
  constructor() {
    this.cart = {};
  }

  /**
   * Adds an item to the shopping cart.
   *
   * @param {string} itemId - ID of the item to add.
   * @param {number} quantity - Quantity of the item to add.
   * @returns {void}
   */
  addItem(itemId, quantity) {
    if (!itemId) {
      throw new Error('Item ID is required.');
    }
    if (typeof quantity !== 'number' || quantity <= 0) {
      throw new Error('Quantity must be a positive number.');
    }

    if (!this.cart[itemId]) {
      this.cart[itemId] = {
        item: itemId,
        quantity: 0,
        // Additional item properties can be added here such as price, name, etc.
      };
    }

    this.cart[itemId].quantity += quantity;
  }

  /**
   * Removes an item from the shopping cart.
   *
   * @param {string} itemId - ID of the item to remove.
   * @returns {void}
   */
  removeItem(itemId) {
    if (!itemId) {
      throw new Error('Item ID is required.');
    }

    if (this.cart[itemId] && this.cart[itemId].quantity > 0) {
      this.cart[itemId].quantity -= 1;
    }
  }

  /**
   * Clears the shopping cart.
   *
   * @returns {void}
   */
  clearCart() {
    this.cart = {};
  }

  /**
   * Retrieves the current state of the shopping cart.
   *
   * @returns {Object} The shopping cart object.
   */
  getCart() {
    return this.cart;
  }
}

// Export the ShoppingCart class for use in other parts of the application.
export default ShoppingCart;