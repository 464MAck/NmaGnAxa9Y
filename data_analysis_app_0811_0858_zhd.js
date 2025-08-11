// 代码生成时间: 2025-08-11 08:58:16
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Define a helper function to perform statistical analysis
function performStatisticalAnalysis(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Invalid data input for analysis.');
  }

  const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const sum = data.reduce((acc, val) => acc + val, 0);
  const variance = data.reduce((acc, val) => acc + (val - mean) ** 2, 0) / data.length;
  const stdDeviation = Math.sqrt(variance);

  return { mean, max, min, sum, variance, stdDeviation };
}

// Create a reactive variable to store the analysis results
const analysisResults = new ReactiveVar(null);

// Template for the main UI component
Template.main.helpers({
  // Get the analysis results
  results() {
    return analysisResults.get();
  },
});

// Template for the main UI component events
Template.main.events({
  // Handle data input submit
  'submit form'(event, templateInstance) {
    event.preventDefault();
    const rawData = templateInstance.$('input[name="data"]').val().split(',').map(Number);
    try {
      const results = performStatisticalAnalysis(rawData);
      analysisResults.set(results);
    } catch (error) {
      console.error('Error during statistical analysis:', error.message);
      // Handle error in the UI (e.g., display an error message)
    }
  },
});

// Start the Meteor app
Meteor.startup(() => {
  // Render the main UI template
  Template.main.rendered = function () {
    // You can perform any setup or initialization tasks here
  };
});
