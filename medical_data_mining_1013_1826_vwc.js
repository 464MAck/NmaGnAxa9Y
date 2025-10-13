// 代码生成时间: 2025-10-13 18:26:43
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// Define a collection for storing medical data
const MedicalData = new Mongo.Collection('medicalData');

// Simple schema validation for the medical data
const medicalDataSchema = new SimpleSchema({
  patientId: {
    type: String,
    label: 'Patient ID'
  },
  diagnosis: {
    type: String,
    label: 'Diagnosis'
  },
  treatment: {
    type: String,
    label: 'Treatment'
  },
  outcome: {
    type: String,
    label: 'Outcome'
  },
  date: {
    type: Date,
    label: 'Date'
  }
});

// Attach schema to the collection
MedicalData.attachSchema(medicalDataSchema);

// Method for inserting medical data
Meteor.methods({
  'insertMedicalData': function(data) {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to insert data.');
    }
    // Insert data into the collection
    try {
      MedicalData.insert(data);
    } catch (error) {
      // Handle any errors during insertion
      throw new Meteor.Error('insert-error', 'Error inserting medical data: ' + error.message);
    }
  },
  'retrieveMedicalData': function() {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to retrieve data.');
    }
    // Retrieve data from the collection
    return MedicalData.find().fetch();
  }
});

// Publish the medical data to the subscribed clients
Meteor.publish('allMedicalData', function () {
  return MedicalData.find();
});

// Client-side code for handling data insertion and retrieval
export const insertData = (data) => {
  Meteor.call('insertMedicalData', data, (error, result) => {
    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully:', result);
    }
  });
};

export const fetchData = () => {
  Meteor.subscribe('allMedicalData');
  const data = MedicalData.find().fetch();
  console.log('Fetched medical data:', data);
};

// Example usage of the functions
// insertData({ patientId: '123', diagnosis: 'Flu', treatment: 'Medication', outcome: 'Recovered', date: new Date() });
// fetchData();
