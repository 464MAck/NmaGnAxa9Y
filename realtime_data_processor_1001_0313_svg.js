// 代码生成时间: 2025-10-01 03:13:21
import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp';

// Define a collection to store our real-time data
const RealTimeData = new Mongo.Collection('realTimeData');

// Function to handle incoming real-time data
function processData(data) {
  // Error handling for incoming data
  if (!data.isValid) {
    throw new Meteor.Error('invalid-data', 'Invalid data received');
  }
  
  // Process the data (this is a placeholder for actual processing logic)
  console.log('Processing data:', data);
  
  // Insert processed data into the collection
  RealTimeData.insert({
    receivedAt: new Date(),
    data: data
  }, (error, result) => {
    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Data inserted successfully:', result);
    }
  });
}

// Setting up a method for clients to call to send real-time data
Meteor.methods({
  'sendRealTimeData': function(realTimeData) {
    // Check if the user is logged in (add authentication logic if needed)
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User not logged in');
    }
    
    // Call the processData function with the received data
    processData(realTimeData);
  }
});

// If you want to handle incoming data from a DDP connection, you can use the following
DDP.connect('wss://your-meteor-server.com/websocket').call('sendRealTimeData', {data: 'your-real-time-data'}, (error, result) => {
  if (error) {
    console.error('Error sending real-time data:', error);
  } else {
    console.log('Data processed and inserted:', result);
  }
});

// You can also set up publication to broadcast real-time data to subscribed clients
Meteor.publish('realTimeData', function() {
  // This is a simple example, you might want to add parameters or use different publication
  // logic depending on your application's needs
  return RealTimeData.find({}, {sort: {receivedAt: -1}});
});