// 代码生成时间: 2025-08-01 15:16:50
 * This Meteor application provides a simple tool to calculate hash values for strings.
 * It includes error handling and is structured to be easy to understand and maintain.
 */

import { Meteor } from 'meteor/meteor';
import { SHA256 } from 'meteor/sha';

// HashCalculator is a class that encapsulates the hash calculation functionality
class HashCalculator {
  // Calculate the SHA-256 hash of a given string
  calculateSHA256(input) {
    // Check if the input is a string
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }

    // Calculate the hash and return the result
    return SHA256(input);
  }
}

// Expose the HashCalculator class to the global scope
const hashCalculator = new HashCalculator();

// Method to calculate hash from client-side code
Meteor.methods({
  'calculateHash': function(input) {
    try {
      // Check if the input is provided
      if (!input) throw new Meteor.Error('missing-input', 'Input is required');

      // Call the hash calculation method
      const hash = hashCalculator.calculateSHA256(input);
      return {
        success: true,
        hash: hash
      };
    } catch (error) {
      // Handle errors and return an error message
      return {
        success: false,
        error: error.message
      };
    }
  }
});

// Example usage from client-side code
// You would call `Meteor.call('calculateHash', 'Hello World')` to calculate the hash of 'Hello World'
