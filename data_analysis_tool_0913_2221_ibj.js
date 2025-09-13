// 代码生成时间: 2025-09-13 22:21:26
 * best practices for maintainability and scalability.
 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// Collection to store data
const DataCollection = new Mongo.Collection('data');

// Function to calculate mean
function calculateMean(data) {
  if (!Array.isArray(data) || !data.every(Number.isFinite)) {
    throw new Error('Invalid data for mean calculation');
  }
  const sum = data.reduce((a, b) => a + b, 0);
  return sum / data.length;
}

// Function to calculate median
function calculateMedian(data) {
  if (!Array.isArray(data) || !data.every(Number.isFinite)) {
    throw new Error('Invalid data for median calculation');
  }
  const sortedData = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sortedData.length / 2);
  return sortedData.length % 2 !== 0 ? sortedData[mid] : (sortedData[mid - 1] + sortedData[mid]) / 2;
}

// Function to calculate mode
function calculateMode(data) {
  if (!Array.isArray(data)) {
    throw new Error('Invalid data for mode calculation');
  }
  const frequencyMap = data.reduce((map, value) => {
    map[value] = (map[value] || 0) + 1;
    return map;
  }, {});
  const maxFrequency = Math.max(...Object.values(frequencyMap));
  return Object.keys(frequencyMap).filter(key => frequencyMap[key] === maxFrequency);
}

// API endpoint to analyze data
Meteor.methods({
  'dataAnalysis.calculateMean': function(data) {
    try {
      return calculateMean(data);
    } catch (error) {
      throw new Meteor.Error('meanError', error.message);
    }
  },
  'dataAnalysis.calculateMedian': function(data) {
    try {
      return calculateMedian(data);
    } catch (error) {
      throw new Meteor.Error('medianError', error.message);
    }
  },
  'dataAnalysis.calculateMode': function(data) {
    try {
      return calculateMode(data);
    } catch (error) {
      throw new Meteor.Error('modeError', error.message);
    }
  }
});

// Method to insert data into the collection
function insertData(data) {
  if (!Array.isArray(data)) {
    throw new Meteor.Error('insertionError', 'Data must be an array');
  }
  return DataCollection.insert({ data });
}

// Method to retrieve data from the collection
function getData() {
  return DataCollection.find().fetch();
}

// Exporting the functions for use in other parts of the application
export { insertData, getData, calculateMean, calculateMedian, calculateMode };
