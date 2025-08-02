// 代码生成时间: 2025-08-02 11:39:45
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';

// Math Toolkit Service
class MathToolkit {
  // Adds two numbers
  add(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Meteor.Error('invalid-argument', 'Both arguments must be numbers');
    }
    return a + b;
  }

  // Subtracts two numbers
  subtract(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Meteor.Error('invalid-argument', 'Both arguments must be numbers');
    }
    return a - b;
  }

  // Multiplies two numbers
  multiply(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Meteor.Error('invalid-argument', 'Both arguments must be numbers');
    }
    return a * b;
  }

  // Divides two numbers
  divide(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Meteor.Error('invalid-argument', 'Both arguments must be numbers');
    }
    if (b === 0) {
      throw new Meteor.Error('division-by-zero', 'Cannot divide by zero');
    }
    return a / b;
  }

  // Calculates the power of a number
  power(base, exponent) {
    if (typeof base !== 'number' || typeof exponent !== 'number') {
      throw new Meteor.Error('invalid-argument', 'Both arguments must be numbers');
    }
    return Math.pow(base, exponent);
  }

  // Calculates the square root of a number
  sqrt(number) {
    if (typeof number !== 'number') {
      throw new Meteor.Error('invalid-argument', 'The argument must be a number');
    }
    if (number < 0) {
      throw new Meteor.Error('negative-square-root', 'Cannot calculate the square root of a negative number');
    }
    return Math.sqrt(number);
  }
}

// Create an instance of MathToolkit to use in Meteor
const mathToolkit = new MathToolkit();

// Export the MathToolkit service for use in other parts of the application
export { MathToolkit, mathToolkit };