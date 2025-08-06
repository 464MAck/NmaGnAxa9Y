// 代码生成时间: 2025-08-07 01:22:36
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// A simple JSON data format converter
class JsonDataConverter {
  // Constructor
  constructor() {
    this.originalJson = new ReactiveVar('{}');
    this.convertedJson = new ReactiveVar('{}');
  }

  // Method to convert JSON data
  convertJson(originalJson) {
    try {
      // Attempt to parse the input JSON string
      const parsedJson = JSON.parse(originalJson);
      // Convert the parsed JSON object back to a string
      this.convertedJson.set(JSON.stringify(parsedJson, null, 2));
    } catch (error) {
      // Handle parsing errors
      console.error('Error parsing JSON:', error);
      this.convertedJson.set('Error: Invalid JSON format');
    }
  }

  // Method to get the original JSON
  getOriginalJson() {
    return this.originalJson.get();
  }

  // Method to get the converted JSON
  getConvertedJson() {
    return this.convertedJson.get();
  }
}

// Meteor method to call the JsonDataConverter
Meteor.methods({
  'jsonConverter:convert'(originalJson) {
    // Create a new instance of JsonDataConverter
    const converter = new JsonDataConverter();
    // Convert the JSON and return the result
    converter.convertJson(originalJson);
    return converter.getConvertedJson();
  }
});

// Template for the JSON data converter
Template.jsonConverter.onCreated(function () {
  // Initialize the instance of JsonDataConverter
  this.converter = new JsonDataConverter();
});

Template.jsonConverter.helpers({
  // Helper to get the original JSON data
  originalJson() {
    // Return the original JSON data from the instance
    return Template.instance().converter.getOriginalJson();
  },

  // Helper to get the converted JSON data
  convertedJson() {
    // Return the converted JSON data from the instance
    return Template.instance().converter.getConvertedJson();
  },

  // Helper to update the original JSON data
  'updateOriginalJson'(newJson) {
    // Update the original JSON data in the instance
    Template.instance().converter.convertJson(newJson);
  }
});

Template.jsonConverter.events({
  // Event to handle input changes and update the original JSON data
  'input #jsonInput'(event, instance) {
    // Set the new JSON data into the instance's converter
    instance.converter.convertJson(event.target.value);
  },
});
