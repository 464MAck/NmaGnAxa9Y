// 代码生成时间: 2025-08-04 18:53:58
 * follows JavaScript best practices for maintainability and scalability.
 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a collection for storing inventory items
const Inventory = new Mongo.Collection('inventory');

// Helper function to validate item properties
function validateItem(item) {
  check(item, {
    name: String,
    quantity: Number,
    description: Match.Optional(String),
    category: Match.Optional(String),
  });
}

// Method for adding a new inventory item
Meteor.methods({
  'inventory.add': function(item) {
    // Check if the user is logged in before adding an item
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to add items');
    }
    // Validate the item properties
    validateItem(item);
    // Add the item to the inventory collection
    Inventory.insert(item);
  },

  'inventory.update': function(itemId, item) {
    // Check if the user is logged in before updating an item
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to update items');
    }
    // Validate the item properties
    validateItem(item);
    // Check if the item exists before updating
    if (!Inventory.findOne(itemId)) {
      throw new Meteor.Error('item-not-found', 'Item not found');
    }
    // Update the item in the inventory collection
    Inventory.update(itemId, { $set: item });
  },

  'inventory.remove': function(itemId) {
    // Check if the user is logged in before removing an item
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to remove items');
    }
    // Check if the item exists before removing
    if (!Inventory.findOne(itemId)) {
      throw new Meteor.Error('item-not-found', 'Item not found');
    }
    // Remove the item from the inventory collection
    Inventory.remove(itemId);
  },
});

// Publish the entire inventory collection for the client
Meteor.publish('inventory', function() {
  return Inventory.find();
});

// Subscribe to the inventory collection
Meteor.subscribe('inventory');
