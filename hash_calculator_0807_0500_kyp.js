// 代码生成时间: 2025-08-07 05:00:58
import { Meteor } from 'meteor/meteor';
import CryptoJS from 'crypto-js';

// HashCalculator is a Meteor service that provides methods to calculate hash values.
class HashCalculator {
  // Calculate the SHA-256 hash of a given string.
  // @param {string} input - The string to be hashed.
  // @returns {string} - The SHA-256 hash of the input string.
  sha256(input) {
    try {
      // Check if input is a string
      if (typeof input !== 'string') {
        throw new Error('Input must be a string.');
      }
      // Calculate the SHA-256 hash using CryptoJS library.
      return CryptoJS.SHA256(input).toString();
    } catch (error) {
      // Log the error and rethrow it to be handled by Meteor's error handling.
      console.error('Error calculating hash:', error);
      throw error;
    }
  }
}

// Create an instance of HashCalculator.
const hashCalculator = new HashCalculator();

// Expose the hash calculation method as a Meteor method.
Meteor.methods({
  'hash.calculateSHA256': function (input) {
    // Check if the user is logged in.
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to calculate hash.');
    }
    // Use the hashCalculator to compute the hash.
    return hashCalculator.sha256(input);
  }
});

// Simple documentation for the Meteor method.
/**
 * Calculate the SHA-256 hash of a given string.
 * @param {string} input - The string to be hashed.
 * @returns {string} - The SHA-256 hash of the input string.
 * @memberOf Meteor.methods
 */

// Example usage of the hash calculation method.
// You can call this from the client side using Meteor.call('hash.calculateSHA256', 'your input').