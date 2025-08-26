// 代码生成时间: 2025-08-26 11:01:09
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

// Define a namespace for the system monitor tool
const SystemMonitor = {
  // Define a setting to store the last fetched data
  lastFetch: null,
};

// Function to fetch system performance data
function fetchSystemPerformanceData() {
  // Define the URL to fetch the system performance data
  const url = 'http://localhost:8080/performance';
  try {
    // Perform an HTTP GET request to fetch the data
    const response = HTTP.get(url, {
      timeout: 5000, // Set a timeout for the request
    });
    
    // Check if the response status code is 200 OK
    if (response.statusCode === 200) {
      // Store the fetched data
      SystemMonitor.lastFetch = response.data;
      return response.data;
    } else {
      // Handle non-200 status codes
      throw new Error(`Failed to fetch data: HTTP status code ${response.statusCode}`);
    }
  } catch (error) {
    // Handle errors during the HTTP request
    console.error('Error fetching system performance data:', error.message);
    throw error;
  }
}

// Function to periodically fetch system performance data
function startMonitoring() {
  // Set an interval to fetch data every 5 minutes
  Meteor.setInterval(() => {
    try {
      fetchSystemPerformanceData();
      console.log('System performance data fetched successfully.');
    } catch (error) {
      console.error('Error during monitoring:', error.message);
    }
  }, 5 * 60 * 1000); // 5 minutes in milliseconds
}

// Start the monitoring process when the Meteor app starts
Meteor.startup(() => {
  startMonitoring();
  console.log('System Monitor Tool has started.');
});
