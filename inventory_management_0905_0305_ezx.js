// 代码生成时间: 2025-09-05 03:05:08
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a collection for storing inventory items.
const InventoryItems = new Mongo.Collection('inventoryItems');

// Define the schema for inventory items.
const InventoryItemSchema = new SimpleSchema({
  itemName: {
    type: String,
    label: 'Item Name',
  },
  itemDescription: {
    type: String,
    optional: true,
    label: 'Item Description',
  },
  quantity: {
    type: Number,
    label: 'Quantity',
  },
  price: {
    type: Number,
    label: 'Price',
  },
});

// Attach the schema to the collection.
InventoryItems.attachSchema(InventoryItemSchema);

// Method to add a new inventory item.
Meteor.methods({
  'inventory.addItem'(item) {
    check(item, InventoryItemSchema);
    // Ensure the user is logged in.
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to add an item.');
    }
    // Add the item to the collection.
    return InventoryItems.insert(item);
  },

  'inventory.updateItem'(itemId, item) {
    check(itemId, String);
    check(item, InventoryItemSchema);
    // Check if the user is authorized to update the item.
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to update an item.');
    }
    const existingItem = InventoryItems.findOne(itemId);
    if (existingItem) {
      // Update the item in the collection.
      return InventoryItems.update(itemId, { $set: item });
    } else {
      throw new Meteor.Error('not-found', 'Item not found.');
    }
  },

  'inventory.deleteItem'(itemId) {
    check(itemId, String);
    // Check if the user is authorized to delete the item.
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to delete an item.');
    }
    const existingItem = InventoryItems.findOne(itemId);
    if (existingItem) {
      // Delete the item from the collection.
      return InventoryItems.remove(itemId);
    } else {
      throw new Meteor.Error('not-found', 'Item not found.');
    }
  },
});

// Publish the inventory items to the client.
Meteor.publish('inventoryItems', function () {
  // Assuming this.userId is defined.
  if (this.userId) {
    return InventoryItems.find({});
  } else {
    return this.ready();
  }
});

// Helper function to format error messages.
function formatErrorMessage(error) {
  if (error.error === 'not-authorized') {
    return 'You must be logged in to perform this action.';
  } else if (error.error === 'not-found') {
    return 'The item you are trying to access was not found.';
  }
  return error.error;
}

// Export the collection and helper function for use in other parts of the application.
export { InventoryItems, formatErrorMessage };