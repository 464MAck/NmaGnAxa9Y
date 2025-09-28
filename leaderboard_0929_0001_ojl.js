// 代码生成时间: 2025-09-29 00:01:10
 * Features:
 * - Add new scores to the leaderboard.
 * - Retrieve the leaderboard data.
 * - Error handling for invalid operations.
 * - Follows best practices for code maintainability and scalability.
 */

// Meteor.publish is used to publish the leaderboard collection to the client.
Meteor.publish('leaderboard', function () {
  return Leaderboard.find();
});

// Method to allow clients to add new scores to the leaderboard.
Meteor.methods({
  'leaderboard.addScore': function (score) {
    // Check if the score is a valid number and not negative.
    check(score, Number);
    if (score < 0) {
      throw new Meteor.Error('invalid-score', 'Score must be a non-negative number.');
    }

    // Insert the score into the leaderboard collection.
    Leaderboard.insert({
      score: score,
      timestamp: new Date()
    });
  }
});

// Collection definition for the leaderboard.
Leaderboard = new Mongo.Collection('leaderboard');

// Simple schema validation for the leaderboard collection.
Leaderboard._simpleSchema = new SimpleSchema({
  score: {
    type: Number,
    min: 0
  },
  timestamp: {
    type: Date
  }
});

// Attach the schema to the collection.
Leaderboard.attachSchema(Leaderboard._simpleSchema);

// Publication allowing clients to retrieve the leaderboard data.
Meteor.publish('leaderboardData', function () {
  return Leaderboard.find({}, {
    sort: {
      score: -1,
      timestamp: -1
    },
    limit: 10 // Limit to the top 10 scores for simplicity.
  });
});

// Client-side code to call the 'leaderboard.addScore' method.
Template.leaderboard.helpers({
  scores: function () {
    return Leaderboard.find({}, {sort: {score: -1, timestamp: -1}}).fetch();
  },
  addScoreForm: function () {
    return {
      score: ''
    };
  }
});

Template.leaderboard.events({
  'submit form': function (event) {
    event.preventDefault();
    var score = event.target.score.value;
    Meteor.call('leaderboard.addScore', score, function (error, result) {
      if (error) {
        // Handle the error if adding the score failed.
        alert(error.reason);
      } else {
        // Clear the form and focus on the score input after a successful submission.
        event.target.score.value = '';
        event.target.score.focus();
      }
    });
  }
});