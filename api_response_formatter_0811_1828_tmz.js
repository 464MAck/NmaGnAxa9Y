// 代码生成时间: 2025-08-11 18:28:01
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Define the API namespace
const ApiResponseFormatter = {
  
  // Function to format API responses
  formatResponse: function(data, statusCode = 200) {
    // Check if data is an object
    if (typeof data !== 'object') {
      throw new Error('Data must be an object');
    }

    // Format the response object
    const response = {
      statusCode: statusCode,
      message: 'Success',
      data: data
    };

    return response;
  },

  // Function to handle API errors
  formatError: function(error) {
    // Check if error is an instance of Error
    if (!(error instanceof Error)) {
      throw new Error('Error must be an instance of Error');
    }

    // Format the error object
    const response = {
      statusCode: 500,
      message: error.message,
      data: null
    };

    return response;
  }
};

// Define an API method to test the formatter
Meteor.methods({
  'apiFormatter.test': function() {
    // Check the arguments
    check(arguments, [String]);

    try {
      // Call the formatResponse function with sample data
      const response = ApiResponseFormatter.formatResponse({
        test: 'This is a test response'
      });

      // Return the formatted response
      return response;
    } catch (error) {
      // Catch any errors and format them
      return ApiResponseFormatter.formatError(error);
    }
  }
});
