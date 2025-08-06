// 代码生成时间: 2025-08-06 12:11:10
// user_permissions.js
// This file contains the user permission management system in a Meteor application.

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

// Define user roles.
const ROLES = ['guest', 'user', 'admin'];

// Function to check if a user has a specific role.
// @param {Meteor.userId} userId - The ID of the user to check.
// @param {String} role - The role to check against.
// @returns {Boolean} - True if the user has the role, false otherwise.
function hasRole(userId, role) {
  return Roles.userIsInRole(userId, role);
}

// Function to add a role to a user.
// @param {Meteor.userId} userId - The ID of the user to add the role to.
// @param {String} role - The role to add.
// @throws {Meteor.Error} - If the role is not defined or the user doesn't exist.
function addRole(userId, role) {
  if (!ROLES.includes(role)) {
    throw new Meteor.Error('role-not-defined', 'The role does not exist.');
  }
  Roles.addUsersToRoles(userId, role);
}

// Function to remove a role from a user.
// @param {Meteor.userId} userId - The ID of the user to remove the role from.
// @param {String} role - The role to remove.
// @throws {Meteor.Error} - If the role is not defined or the user doesn't exist.
function removeRole(userId, role) {
  if (!ROLES.includes(role)) {
    throw new Meteor.Error('role-not-defined', 'The role does not exist.');
  }
  Roles.removeUsersFromRoles(userId, role);
}

// Meteor methods for role management.
Meteor.methods({
  'userPermissions.addRole': function(userId, role) {
    check(userId, String);
    check(role, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to add a role.');
    }
    if (!hasRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'Only admins can add roles.');
    }
    addRole(userId, role);
  },
  'userPermissions.removeRole': function(userId, role) {
    check(userId, String);
    check(role, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to remove a role.');
    }
    if (!hasRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'Only admins can remove roles.');
    }
    removeRole(userId, role);
  }
});

// Export the hasRole function for server-side access.
export { hasRole };
