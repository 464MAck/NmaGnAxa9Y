// 代码生成时间: 2025-09-22 09:10:17
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Define a simple user schema if needed
// const SimpleSchema = require('meteor/aldeed:simple-schema').SimpleSchema;
// const schema = new SimpleSchema({
//   // Define schema fields here
// });

// Helper function to set up a default user profile
const setupUserProfile = (userId) => {
  // Placeholder for setting up user profiles
  // Implement logic to create a user profile based on userId
};

// Function to handle user registration
const createUser = (username, email, password) => {
  try {
    // Check if the user is already registered with the same email
    const userExists = Meteor.users.findOne({ emails: { $elemMatch: { address: email } } });
    if (userExists) {
      throw new Meteor.Error('user-already-exists', 'A user with this email already exists.');
    }

    // Create a new user
    const userId = Accounts.createUser({
      username,
      emails: [{ address: email, verified: false }],
      password,
    });

    // Set up the user profile
    setupUserProfile(userId);

    return userId;
  } catch (error) {
    // Handle any errors that occur during user creation
    console.error('User creation failed:', error.message);
    throw error;
  }
};

// Function to handle user login
const login = (email, password) => {
  try {
    // Attempt to log the user in with their email and password
    const userId = Accounts.login({
      password,
      user: { emails: [{ address: email }] },
    });

    return userId;
  } catch (error) {
    // Handle any errors that occur during login
    console.error('Login failed:', error.message);
    throw error;
  }
};

// Expose the functions to the server
Meteor.methods({
  'user.create': function(username, email, password) {
    check(username, String);
    check(email, String);
    check(password, String);

    const userId = createUser(username, email, password);
    return userId;
  },
  'user.login': function(email, password) {
    check(email, String);
    check(password, String);

    const userId = login(email, password);
    return userId;
  },
});

// Optional: Add publication for logged-in user's profile
Meteor.publish('user.profile', function() {
  if (this.userId) {
    return Meteor.users.find({
      _id: this.userId,
      'profile.isPublic': true,
    }, {
      fields: {
        'profile': 1,
        'username': 1,
        'emails': 1,
      },
    });
  } else {
    this.ready();
  }
});

// Optional: Add subscription for logged-in user's profile
Meteor.subscribe('user.profile');
// Optional: Use this subscription in client code to access the user's profile
