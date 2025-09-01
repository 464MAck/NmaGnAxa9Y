// 代码生成时间: 2025-09-02 02:26:35
import { Mongo } from 'meteor/mongo';

// Define a collection to store cart items
const CartItems = new Mongo.Collection('cartItems');

// Meteor method to add an item to the cart
Meteor.methods({
  'cart.addItem': function(itemId, quantity) {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to add items to cart');
    }

    // Check for valid item ID and quantity
    if (!itemId || quantity <= 0) {
      throw new Meteor.Error('invalid-input', 'Item ID and quantity must be valid and positive');
    }

    // Check if the item already exists in the cart
    const existingItem = CartItems.findOne({
      userId: this.userId,
      itemId: itemId
    });

    if (existingItem) {
      // If the item exists, update the quantity
      CartItems.update({
        _id: existingItem._id
      }, {
        $set: {
          quantity: existingItem.quantity + quantity
        }
      });
    } else {
      // If the item does not exist, insert a new item into the cart
      CartItems.insert({
        userId: this.userId,
        itemId: itemId,
        quantity: quantity
      });
    }
  },

  'cart.removeItem': function(cartItemId) {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to remove items from cart');
    }

    // Remove the item from the cart
    CartItems.remove({
      _id: cartItemId,
      userId: this.userId
    });
  },

  'cart.getCart': function() {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to view the cart');
    }

    // Get the cart items for the logged-in user
    return CartItems.find({
      userId: this.userId
    }).fetch();
  }
});

// Publish the cart items for a user
Meteor.publish('cartItems', function() {
  if (this.userId) {
    return CartItems.find({
      userId: this.userId
    });
  } else {
    this.ready();
  }
});