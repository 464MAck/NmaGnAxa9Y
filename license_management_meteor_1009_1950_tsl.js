// 代码生成时间: 2025-10-09 19:50:42
 * Features:
 * - Clear code structure
 * - Error handling
 * - Comments and documentation
 * - Adherence to JavaScript best practices
 * - Maintainability and scalability
 */

// Import required Meteor packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a collection for storing licenses
const Licenses = new Mongo.Collection('licenses');

// Define schema for validation
const licenseSchema = new SimpleSchema({
  userId: {
    type: String,
    label: 'User ID',
  },
  productId: {
    type: String,
    label: 'Product ID',
  },
  isActive: {
    type: Boolean,
    defaultValue: true,
    label: 'Is Active',
  },
  issueDate: {
    type: Date,
    autoValue: function() {
      return new Date();
    },
    label: 'Issue Date',
  },
  expiryDate: {
    type: Date,
    label: 'Expiry Date',
  },
  licenseKey: {
    type: String,
    label: 'License Key',
  },
});

// Attach schema to the collection for validation
Licenses.attachSchema(licenseSchema);

// Method to add a new license
Meteor.methods({
  'licenses.add': function(licenseData) {
    check(licenseData, {
      userId: String,
      productId: String,
      expiryDate: Date,
      licenseKey: String,
    });
    // Simple error handling
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to add a license');
    }
    // Insert new license document
    return Licenses.insert({
      userId: licenseData.userId,
      productId: licenseData.productId,
      expiryDate: licenseData.expiryDate,
      licenseKey: licenseData.licenseKey,
    });
  },
});

// Method to deactivate a license
Meteor.methods({
  'licenses.deactivate': function(licenseId) {
    check(licenseId, String);
    // Simple error handling
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to deactivate a license');
    }
    // Update license document to deactivate
    return Licenses.update(licenseId, {
      $set: { isActive: false },
    });
  },
});

// Publication for active licenses
Meteor.publish('activeLicenses', function() {
  if (!this.userId) {
    return this.ready();
  }
  // Publish active licenses for the current user
  return Licenses.find({ userId: this.userId, isActive: true });
});

// Publication for all licenses
Meteor.publish('allLicenses', function() {
  if (!this.userId) {
    return this.ready();
  }
  // Publish all licenses for the current user
  return Licenses.find({ userId: this.userId });
});

// Publication for license by ID
Meteor.publish('licenseById', function(licenseId) {
  check(licenseId, String);
  if (!this.userId) {
    return this.ready();
  }
  // Publish a single license document by ID for the current user
  return Licenses.find({ _id: licenseId, userId: this.userId });
});
