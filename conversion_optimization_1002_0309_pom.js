// 代码生成时间: 2025-10-02 03:09:23
// Import necessary Meteor packages and modules
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// Define a collection to store conversion data
const ConversionData = new Mongo.Collection('conversionData');

// Function to calculate conversion rate
function calculateConversionRate(conversions, totalVisits) {
  if (totalVisits === 0) {
    throw new Error('Total visits cannot be zero');
  }
  return (conversions / totalVisits) * 100;
}

// Define a publication to provide conversion data to the client
Meteor.publish('conversionData', function () {
  // Return the entire collection
  return ConversionData.find();
});

// Define a method to add conversion data
Meteor.methods({
  'addConversionData': function (data) {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to add data');
    }

    // Perform data validation here if necessary
    // ...

    // Insert the data into the collection
    ConversionData.insert(data);
  },
  'getConversionRate': function (startDate, endDate) {
    // Query the database for the given date range
    const data = ConversionData.find({
      timestamp: { $gte: startDate, $lte: endDate }
    }).fetch();

    if (data.length === 0) {
      throw new Meteor.Error('no-data', 'No conversion data found for the given date range');
    }

    // Calculate conversions and total visits within the date range
    const totalVisits = data.length;
    const conversions = data.filter(item => item.converted).length;

    // Calculate the conversion rate
    const conversionRate = calculateConversionRate(conversions, totalVisits);

    return conversionRate;
  }
});

// Client-side code to handle data retrieval and display
Meteor.startup(() => {
  // Subscribe to the publication
  Meteor.subscribe('conversionData');

  // Example usage of the 'getConversionRate' method
  Meteor.call('getConversionRate', '2023-01-01', '2023-01-31', (error, result) => {
    if (error) {
      console.error('Error calculating conversion rate:', error);
    } else {
      console.log('Conversion rate for the month:', result + '%' );
    }
  });
});