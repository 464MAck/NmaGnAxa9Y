// 代码生成时间: 2025-08-08 09:14:30
// access_control_meteor.js
// This Meteor application script handles user access control.

// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

// Define roles if not already defined
if (!Roles) {
  console.error('Roles package not installed!');
} else if (Roles.list().length === 0) {
  console.log('Creating default roles...');
  Roles.createRole('admin', 'Admins have full access.')
    .catch(error => console.error('Error creating roles:', error));
  Roles.createRole('user', 'Users have limited access.')
    .catch(error => console.error('Error creating roles:', error));
}

// Function to check if a Meteor method is allowed for the current user
function checkAccess(requiredRole) {
  // Check if the user is logged in and has the required role
  if (!Meteor.userId()) {
    // User is not logged in
    throw new Meteor.Error('not-authorized', 'You must be logged in to perform this action.');
  } else if (!Roles.userIsInRole(Meteor.userId(), requiredRole)) {
    // User does not have the required role
    throw new Meteor.Error('not-authorized', `You do not have permissions to perform this action.`);
  }
}

// Example Meteor method that requires admin access
Meteor.methods({
  'adminOnlyMethod': function() {
    checkAccess('admin');
    console.log('Admin only method called by:', Meteor.user().username);
    // Perform admin-specific logic here
    return 'Admin action performed successfully.';
  }
});

// Example Meteor publication that requires user access
Meteor.publish('userDocuments', function() {
  if (!Meteor.userId()) {
    // User is not logged in, publish nothing
    this.error(new Meteor.Error('not-authorized', 'You must be logged in to access this publication.'));
    return;
  }
  // Publish documents visible to the user
  return Documents.find({
    'owner': Meteor.userId()
  });
});

// Example route restricting access to authenticated users
// This should be used with Iron Router or Flow Router in Meteor
// Example using Flow Router
import { FlowRouter } from 'meteor/kadira:flow-router';
FlowRouter.route('/admin-page', {
  action: function() {
    if (!Meteor.userId()) {
      // Redirect to login if not logged in
      this.redirect('/login');
    } else {
      checkAccess('admin');
      // Render the admin page
      this.render('adminPage');
    }
  }
});

// Example route restricting access to users
FlowRouter.route('/user-page', {
  action: function() {
    if (!Meteor.userId()) {
      // Redirect to login if not logged in
      this.redirect('/login');
    } else {
      checkAccess('user');
      // Render the user page
      this.render('userPage');
    }
  }
});