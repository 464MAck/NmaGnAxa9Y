// 代码生成时间: 2025-09-15 18:03:52
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Define a reactive variable to store the current theme
const currentTheme = new ReactiveVar('light');

// Define a helper function to switch themes
function switchTheme() {
  const newTheme = currentTheme.get() === 'light' ? 'dark' : 'light';
  currentTheme.set(newTheme);
  // Inform other parts of the app to reactively update
  Session.set('theme', newTheme);
}

// Define a template for the theme switcher
Template.themeSwitcher.helpers({
  // Return the current theme
  theme() {
    return currentTheme.get();
  },
});

// Define a template for the theme switcher
Template.themeSwitcher.events({
  // Event to handle the theme switch button click
  'click #switchTheme'(event) {
    event.preventDefault();
    // Call the switchTheme function to toggle the theme
    switchTheme();
  },
});

// Define a template to apply the theme to the entire app
Template.body.helpers({
  // Return the class name based on the current theme
  themeClass() {
    return `theme-${currentTheme.get()}`;
  },
});

// Optionally, you can use the CSS class to apply styles
// in a separate CSS file and use Meteor's CSS package to import it
// For example:
// @import '/imports/css/themes.css';

// Define a Meteor method to handle theme changes from the server (if needed)
Meteor.methods({
  changeTheme(newTheme) {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to change themes.');
    }
    // Set the new theme
    currentTheme.set(newTheme);
    // Inform other parts of the app to reactively update
    Session.set('theme', newTheme);
  },
});

// This is a simple example and does not include error handling for server methods
// or advanced theming techniques such as deep theming or theming based on user preferences.

// Make sure to include the necessary CSS to style the 'light' and 'dark' themes.
