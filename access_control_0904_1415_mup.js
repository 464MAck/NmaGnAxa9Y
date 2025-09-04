// 代码生成时间: 2025-09-04 14:15:56
// Import necessary Meteor packages and utilities
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';

// Define roles for access control
const ROLES = ['admin', 'user'];

// Utility function to check if a user has a specific role
const hasRole = (userId, role) => {
  return Roles.userIsInRole(userId, role);
};

// Define a function to check for admin access
const isAdmin = new ValidatedMethod({
  name: 'isAdmin',
  validate: new SimpleSchema({
    userId: { type: String }
  }).validator(),
  run({ userId }) {
    check(userId, String);
    if (!hasRole(userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'Access denied: You must be an admin to perform this action.');
    }
  }
});

// Define a function to check for user access
const isUser = new ValidatedMethod({
  name: 'isUser',
  validate: new SimpleSchema({
    userId: { type: String }
  }).validator(),
  run({ userId }) {
    check(userId, String);
    const roles = Roles.getRolesForUser(userId);
    if (!roles.includes('user')) {
      throw new Meteor.Error('not-authorized', 'Access denied: You must be a user to perform this action.');
    }
  }
});

// Define a function to check for admin or user access
const isAdminOrUser = new ValidatedMethod({
  name: 'isAdminOrUser',
  validate: new SimpleSchema({
    userId: { type: String }
  }).validator(),
  run({ userId }) {
    check(userId, String);
    const roles = Roles.getRolesForUser(userId);
    if (!roles.includes('admin') && !roles.includes('user')) {
      throw new Meteor.Error('not-authorized', 'Access denied: You must be an admin or a user to perform this action.');
    }
  }
});

// Export the methods for use in other parts of the application
export { isAdmin, isUser, isAdminOrUser };