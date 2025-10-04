// 代码生成时间: 2025-10-05 04:00:21
 * It includes client and server-side logic, error handling, and documentation for maintainability and scalability.
 */

// Meteor specific imports
import { Meteor, Template, ReactiveVar } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

// Define the EnergyData collection
const EnergyData = new Mongo.Collection('energyData');

// Collection schema for validation
const EnergyDataSchema = new SimpleSchema({
    timestamp: {
        type: Date,
        label: 'Timestamp'
    },
    energyConsumption: {
        type: Number,
        label: 'Energy Consumption'
    }
});

// Attach the schema to the collection
EnergyData.attachSchema(EnergyDataSchema);

// Server-side publication
Meteor.publish('energyData', function () {
    return EnergyData.find();
});

// Server-side method to insert energy data
Meteor.methods({
    'insertEnergyData': function (energyData) {
        check(energyData, {
            timestamp: Date,
            energyConsumption: Number
        });
        try {
            EnergyData.insert(energyData);
        } catch (error) {
            throw new Meteor.Error('insert-error', 'Failed to insert energy data', error.message);
        }
    }
});

// Client-side template definition
Template.energyDashboard.helpers({
    'energyData': function () {
        return EnergyData.find();
    }
});

// Client-side template events
Template.energyDashboard.events({
    'submit form': function (event) {
        event.preventDefault();
        const timestamp = new Date();
        const energyConsumption = event.target.energyConsumption.value;
        Meteor.call('insertEnergyData', { timestamp, energyConsumption }, function (error, result) {
            if (error) {
                // Handle the error on the client side
                console.error('Error inserting energy data:', error.message);
            } else {
                // Clear the form and provide feedback
                event.target.reset();
                alert('Energy data inserted successfully.');
            }
        });
    }
});
