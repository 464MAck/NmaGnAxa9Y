// 代码生成时间: 2025-08-08 19:36:00
// Import required Meteor packages and utilities
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:standard-packages';
import { check, Match } from 'meteor/check';
import Papa from 'papaparse';
import _ from 'underscore';

// Define the file collection
FS.Collection.configure({
  // Configuration options
  store: FS.Store.GridFS,
  filter: {
    allow: {
      ContentType: ['text/csv'],
    },
  },
  debug: true,
});

// Define CSV file validation
const validateCSV = (file) => {
  if (!file.contentType || file.contentType !== 'text/csv') {
    throw new Meteor.Error('InvalidContentType', 'Only CSV files are allowed');
  }
  if (file.size === 0) {
    throw new Meteor.Error('EmptyFile', 'The file is empty');
  }
};

// Process a single CSV file
const processCSV = (file) => {
  try {
    validateCSV(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target.result;
      const parsedData = Papa.parse(csvData);
      
      // Handle the parsed CSV data here
      // For example, you can insert it into a MongoDB collection or perform any other processing
      console.log(parsedData);
    };
    reader.onerror = (e) => {
      throw new Meteor.Error('ReadError', 'Error reading the file:', e.target.error);
    };
    reader.readAsText(file.reader);
  } catch (error) {
    console.error('Error processing CSV file:', error);
  }
};

// Define a Meteor method to process CSV files
Meteor.methods({
  'processCSVFiles': function(files) {
    check(files, [Match.Where((file) => file instanceof FS.File && file.isValid() && FS.File.fileIsAllowed(file) && file.size > 0)]);
    
    // Process each CSV file in the list
    files.forEach((file) => {
      processCSV(file);
    });
    
    return 'CSV files processed successfully';
  },
});
