// 代码生成时间: 2025-09-10 13:37:27
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a collection for the inventory items
const Inventory = new Mongo.Collection('inventory');

// Define schema for inventory items
const InventorySchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
  },
  quantity: {
    type: Number,
    label: 'Quantity',
    min: 0,
  },
  price: {
    type: Number,
    label: 'Price',
    decimal: true,
    optional: true,
  },
  description: {
    type: String,
    label: 'Description',
    optional: true,
  },
});

// Attach the schema to the collection
Inventory.attachSchema(InventorySchema);

// Method to add an item to the inventory
Meteor.methods({
  'inventory.addItem'(item) {
    check(item, InventorySchema);
    try {
      // Check if the user is logged in
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to add items.');
      }
      // Insert the item into the inventory collection
      const result = Inventory.insert(item);
      return result;
    } catch (error) {
      // Error handling
      throw new Meteor.Error('add-item-failed', 'Adding item to inventory failed:', error.message);
    }
  },

  'inventory.updateItem'(itemId, item) {
    check(itemId, String);
    check(item, InventorySchema);
    try {
      // Check if the user is logged in
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to update items.');
      }
      // Update the item in the inventory collection
      const result = Inventory.update(itemId, { $set: item });
      return result;
    } catch (error) {
      // Error handling
      throw new Meteor.Error('update-item-failed', 'Updating item in inventory failed:', error.message);
    }
  },

  'inventory.removeItem'(itemId) {
    check(itemId, String);
    try {
      // Check if the user is logged in
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to remove items.');
      }
      // Remove the item from the inventory collection
      const result = Inventory.remove(itemId);
      return result;
    } catch (error) {
      // Error handling
      throw new Meteor.Error('remove-item-failed', 'Removing item from inventory failed:', error.message);
    }
  },
});

// Publish the inventory data for subscribed users
Meteor.publish('inventory', function () {
  return Inventory.find({});
});

// Subscribe to the inventory data
Meteor.startup(() => {
  Meteor.subscribe('inventory');
});

// Client-side code for displaying the inventory
Template.inventory.onCreated(function () {
  // Subscribe to the inventory data
  this.subscribe('inventory');
  // Get the inventory data
  this.inventory = Inventory.find({});
});

// Template for the inventory items
Template.inventory.helpers({
  'inventoryItems'() {
    return Template.instance().inventory;
  },
  'itemQuantity'() {
    return Template.instance().inventory.map((item) => item.quantity);
  },
});

// Template for adding a new item
Template.addItem.events({
  'submit form'(event, instance) {
    event.preventDefault();
    const itemData = {
      name: event.target.name.value,
      quantity: parseInt(event.target.quantity.value),
      price: parseFloat(event.target.price.value),
      description: event.target.description.value,
    };
    Meteor.call('inventory.addItem', itemData, function (error, result) {
      if (error) {
        // Handle error
        Bert.alert(error.reason, 'danger');
      } else {
        // Handle success
        Bert.alert('Item added successfully', 'success');
        // Clear the form
        $(event.target)[0].reset();
      }
    });
  },
});

// Template for updating an item
Template.updateItem.helpers({
  'item'() {
    const itemId = FlowRouter.getParam('itemId');
    return Inventory.findOne(itemId);
  },
});

Template.updateItem.events({
  'submit form'(event, instance) {
    event.preventDefault();
    const itemId = FlowRouter.getParam('itemId');
    const itemData = {
      name: event.target.name.value,
      quantity: parseInt(event.target.quantity.value),
      price: parseFloat(event.target.price.value),
      description: event.target.description.value,
    };
    Meteor.call('inventory.updateItem', itemId, itemData, function (error, result) {
      if (error) {
        // Handle error
        Bert.alert(error.reason, 'danger');
      } else {
        // Handle success
        Bert.alert('Item updated successfully', 'success');
        FlowRouter.go('inventory');
      }
    });
  },
});