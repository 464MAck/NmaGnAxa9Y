// 代码生成时间: 2025-08-03 23:28:32
import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { HTTP } from 'meteor/http';
import { check, Match } from 'meteor/check';

// DocumentConverter is a Meteor method that can be called from client-side code
// to convert documents from one format to another using an external API.
Meteor.methods({
  'documentConverter:convert': function (inputFormat, outputFormat, documentData) {
    // Check if the inputFormat, outputFormat and documentData are provided
    check(inputFormat, String);
    check(outputFormat, String);
    check(documentData, Buffer);

    // Error handling to ensure the required parameters are valid
    if (!inputFormat || !outputFormat || !documentData) {
      throw new Meteor.Error('invalid-parameters', 'Invalid input parameters');
    }

    // Define the URL for the document conversion service
    const conversionServiceUrl = 'https://api.document-conversion-service.com/convert';

    // Prepare the headers for the HTTP request
    const headers = {
      'Content-Type': 'application/octet-stream',
      'Accept': `application/${outputFormat}`
    };

    // Prepare the HTTP request options
    const options = {
      data: documentData,
      headers: headers
    };

    // Make the HTTP request to the conversion service
    try {
      const response = HTTP.post(conversionServiceUrl, options);
      // Check if the response status code is 200 (OK)
      if (response.statusCode === 200) {
        // Return the converted document data
        return response.content;
      } else {
        // Handle non-200 status codes by throwing an error
        throw new Meteor.Error('conversion-failed', 'Document conversion failed');
      }
    } catch (error) {
      // Catch any exceptions that occur during the HTTP request and throw an error
      throw new Meteor.Error('network-error', 'Network error occurred during document conversion');
    }
  }
});

// Documentation for the 'documentConverter:convert' method
/**
 * Converts a document from one format to another using an external API.
 *
 * @param {String} inputFormat - The format of the input document (e.g., 'pdf', 'docx').
 * @param {String} outputFormat - The desired format of the output document (e.g., 'html', 'txt').
 * @param {Buffer} documentData - The binary data of the input document.
 * @returns {Buffer} The binary data of the converted document.
 * @throws {Meteor.Error} - If the input parameters are invalid or the conversion fails.
 */