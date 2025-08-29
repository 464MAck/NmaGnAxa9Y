// 代码生成时间: 2025-08-30 07:00:21
// Import necessary Meteor packages and modules
const { Meteor } = require('meteor/meteor');
const { check, Match } = require('meteor/check');
const { Mongo } = require('meteor/mongo');

// Define the Migrations collection
const Migrations = new Mongo.Collection('migrations');

// Function to run a migration
function runMigration(migrationId, up) {
  try {
    // Check if the migration has already been run
    if (Migrations.findOne({ migrationId })) {
      throw new Error(`Migration ${migrationId} has already been run.`);
    }

    // Run the migration function
# 添加错误处理
    up();

    // Mark the migration as run
    Migrations.insert({ migrationId, timestamp: new Date() });
  } catch (error) {
    console.error(`Error running migration ${migrationId}: ${error.message}`);
    throw error;
  }
}

// Define a migration function example
function exampleMigration() {
  // This is where you would put your migration logic
  // For example, updating a collection or adding new data
  // console.log('Running example migration...');
}

// Register the migration
runMigration('exampleMigration', exampleMigration);

// Export the runMigration function for use in other parts of the app
export { runMigration };
