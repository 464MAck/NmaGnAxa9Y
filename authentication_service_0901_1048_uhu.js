// 代码生成时间: 2025-09-01 10:48:12
 * ensuring error handling and maintaining best practices.
 */

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

/**
 * SignIn Method - Allows users to sign in with their username and password.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {boolean} - Returns true if the sign-in is successful, otherwise false.
 */
export const signIn = ({ username, password }) => {
  // Check if both username and password are provided
  if (!username || !password) {
    throw new Meteor.Error('invalid-credentials', 'Username and password are required.');
  }
  
  try {
    // Attempt to sign in the user
    const result = Meteor.loginWithPassword(username, password);
    if (result.error) {
      throw new Meteor.Error('login-failed', result.error.reason);
    }
    return true;
  } catch (error) {
    // Handle any exceptions that occur during the sign-in process
    console.error('Sign-in error:', error);
    throw error;
  }
};

/**
 * SignOut Method - Logs the current user out of the application.
 * @returns {boolean} - Returns true if the sign-out is successful, otherwise false.
 */
export const signOut = () => {
  try {
    // Attempt to sign out the user
    const result = Meteor.logout();
    if (result.error) {
      throw new Meteor.Error('logout-failed', result.error.reason);
    }
    return true;
  } catch (error) {
    // Handle any exceptions that occur during the sign-out process
    console.error('Sign-out error:', error);
    throw error;
  }
};