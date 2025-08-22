// 代码生成时间: 2025-08-22 10:42:20
// Meteor is assumed to be already imported and set up in the environment.

// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Define the MathUtilities class
class MathUtilities {
    // Constructor
    constructor() {
        // Initialize any required variables
    }

    // Addition method
    add(a, b) {
        // Check if arguments are numbers
        check(a, Number);
        check(b, Number);
        // Return the sum of a and b
        return a + b;
    }

    // Subtraction method
    subtract(a, b) {
        // Check if arguments are numbers
        check(a, Number);
        check(b, Number);
        // Return the difference of a and b
        return a - b;
    }

    // Multiplication method
    multiply(a, b) {
        // Check if arguments are numbers
        check(a, Number);
        check(b, Number);
        // Return the product of a and b
        return a * b;
    }

    // Division method
    divide(a, b) {
        // Check if arguments are numbers
        check(a, Number);
        check(b, Number);
        // Check if division by zero is attempted
        if (b === 0) {
            throw new Error('Division by zero is not allowed.');
        }
        // Return the quotient of a and b
        return a / b;
    }

    // Power method
    power(a, b) {
        // Check if arguments are numbers
        check(a, Number);
        check(b, Number);
        // Return a raised to the power of b
        return Math.pow(a, b);
    }

    // Square root method
    sqrt(a) {
        // Check if argument is a non-negative number
        check(a, Number);
        // Check if the number is non-negative
        if (a < 0) {
            throw new Error('Cannot compute the square root of a negative number.');
        }
        // Return the square root of a
        return Math.sqrt(a);
    }
}

// Create an instance of MathUtilities
const mathUtils = new MathUtilities();

// Expose the MathUtilities methods as Meteor methods
Meteor.methods({
    'math.add': function(a, b) {
        return mathUtils.add(a, b);
    },
    'math.subtract': function(a, b) {
        return mathUtils.subtract(a, b);
    },
    'math.multiply': function(a, b) {
        return mathUtils.multiply(a, b);
    },
    'math.divide': function(a, b) {
        return mathUtils.divide(a, b);
    },
    'math.power': function(a, b) {
        return mathUtils.power(a, b);
    },
    'math.sqrt': function(a) {
        return mathUtils.sqrt(a);
    }
});
