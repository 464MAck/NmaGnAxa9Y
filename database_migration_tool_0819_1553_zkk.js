// 代码生成时间: 2025-08-19 15:53:05
// Import necessary Meteor packages
const { Meteor } = require('meteor/meteor');
const { Migrations } = require('meteor/percolate:migrations');

// Define a function to handle database migrations
function migrateDatabase() {
  // Define a migration schema using Migrations
  Migrations.newMigrationDefinition('initializeDatabase', {
    version: 1,
    up() {
      // Define the schema for the collections that need to be initialized
      const usersCollectionSchema = new SimpleSchema({
        name: {
          type: String,
          label: "User's Name"
        },
        email: {
          type: String,
          regEx: SimpleSchema.RegEx.Email,
          label: "User's Email"
        },
        // Add more fields as necessary
      });

      // Create a new collection with the defined schema
      const Users = new Mongo.Collection('users', {
        idGeneration: 'MONGO',
        transform: null,
        connection: null
      });
      Users.attachSchema(usersCollectionSchema);

      // Add initial data to the collection if necessary
      if (Users.find().count() === 0) {
        Users.insert({
          name: 'Initial User',
          email: 'initial@example.com'
        });
      }
    },
    down() {
      // Drop the collection to reverse the migration
      const Users = Meteor.collection('users');
      Users.drop();
    }
  });

  // Run the migration
  Migrations.migrateTo('latest');
}

// Call the migration function to apply migrations
migrateDatabase();