// 代码生成时间: 2025-10-07 02:21:30
 * It handles errors and ensures code maintainability and scalability.
 */

// Meteor.publish and subscribe functions for reactivity
import { Meteor } from 'meteor/meteor';

// Collection for storing salary data
import { Salaries } from './salaries_collection.js';

// Salary Calculation Function
function calculateSalary(base, overtime) {
  // Error handling for invalid inputs
  if (typeof base !== 'number' || typeof overtime !== 'number') {
    throw new Meteor.Error('invalid-input', 'Base pay and overtime must be numbers.');
  }

  // Calculate salary
  const salary = base + (overtime * 1.5); // Assuming overtime is paid at 1.5 times the base rate
  return salary;
}

// Meteor method to add a salary record
Meteor.methods({
  'addSalary': function(base, overtime) {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to add a salary record.');
    }

    try {
      // Calculate salary using the provided function
      const salary = calculateSalary(base, overtime);
      // Insert the salary record into the database
      Salaries.insert({
        base,
        overtime,
        calculatedSalary: salary,
        createdAt: new Date()
      });
    } catch (error) {
      // Handle any errors that occur during salary calculation
      throw new Meteor.Error('salary-calculation-error', error.message);
    }
  }
});

// Client-side code to handle user input and display results
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.calculator.onCreated(function() {
  this.basePay = new ReactiveVar(0);
  this.overtimePay = new ReactiveVar(0);
});

Template.calculator.helpers({
  'basePay': function() {
    return Template.instance().basePay.get();
  },
  'overtimePay': function() {
    return Template.instance().overtimePay.get();
  }
});

Template.calculator.events({
  // Event handler for base pay input
  'change #base-pay-input': function(event, instance) {
    instance.basePay.set(event.target.value);
  },
  // Event handler for overtime pay input
  'change #overtime-pay-input': function(event, instance) {
    instance.overtimePay.set(event.target.value);
  },
  // Event handler for the calculate button
  'click #calculate-button': function(event, instance) {
    event.preventDefault();
    const base = parseFloat(instance.basePay.get());
    const overtime = parseFloat(instance.overtimePay.get());
    Meteor.call('addSalary', base, overtime, (error, result) => {
      if (error) {
        // Handle errors from the server method
        Bert.alert(error.reason, 'danger', 'fixed-top', 'fa fa-remove');
      } else {
        // Display the calculated salary on the client side
        Bert.alert(`Your calculated salary is: ${result.calculatedSalary}`, 'success', 'fixed-top', 'fa fa-check');
      }
    });
  }
});

// Collection file with schema
// salaries_collection.js

/*
 * SimpleSchema module for schema validation
 */
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Salary record schema
const SalarySchema = new SimpleSchema({
  base: {
    type: Number,
    label: 'Base Pay'
  },
  overtime: {
    type: Number,
    label: 'Overtime Pay'
  },
  calculatedSalary: {
    type: Number,
    label: 'Calculated Salary',
    autoValue: function() {
      if (this.isInsert && !this.isSet) {
        return calculateSalary(this.value('base'), this.value('overtime'));
      }
    }
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    },
    denyUpdate: true,
    label: 'Created At'
  }
});

// Attach the schema to the Salaries collection
Salaries.attachSchema(SalarySchema);
