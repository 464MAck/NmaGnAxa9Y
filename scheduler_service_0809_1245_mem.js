// 代码生成时间: 2025-08-09 12:45:07
 * Features:
 * - Add, remove, and clear tasks
 * - Error handling
 * - Logging
 *
 * Maintainability and scalability are considered in the design.
 *
 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Define a collection to store scheduled tasks
const Tasks = new Mongo.Collection('tasks');

// Define a schema for our tasks
const TaskSchema = new SimpleSchema({
    taskId: {
        type: String,
        regEx: /^\S{1,30}$/, // Alphanumeric, max 30 chars
    },
    taskName: {
        type: String,
        label: 'Task Name',
        regEx: /^[a-zA-Z0-9_]+$/, // Alphanumeric and underscores only
    },
    taskFunction: {
        type: String,
        label: 'Task Function',
        optional: true,
    },
    schedule: {
        type: Object,
        label: 'Task Schedule',
        blackbox: true,
    },
    active: {
        type: Boolean,
        defaultValue: true,
        label: 'Task Active',
    },
    nextRunTime: {
        type: Date,
        optional: true,
        label: 'Next Run Time',
    },
    lastRunTime: {
        type: Date,
        optional: true,
        label: 'Last Run Time',
    },
    lastResult: {
        type: String,
        optional: true,
        label: 'Last Result',
    },
    errors: {
        type: Array,
        optional: true,
        label: 'Errors',
    },
    'errors.$': {
        type: Object,
    },
    'errors.$.error': {
        type: String,
    },
    'errors.$.time': {
        type: Date,
    },
});
Tasks.attachSchema(TaskSchema);

// Helper function to run a task
function runTask(task) {
    try {
        if (task.taskFunction) {
            // Evaluate the task function
            const result = Function('return ' + task.taskFunction)();
            console.log(`Task ${task.taskName} executed successfully. Result: ${result}`);
            return result;
        }
    } catch (error) {
        console.error(`Error executing task ${task.taskName}: ${error}`);
        // Save the error to the task
        const errorRecord = { error: error.message, time: new Date() };
        Tasks.update(task.taskId, { $addToSet: { errors: errorRecord } });
        throw error;
    }
}

// Method to add a new scheduled task
Meteor.methods({
    'scheduler:addTask': function (taskData) {
        check(taskData, TaskSchema);
        // Validate taskData and add to the database
        const taskId = Tasks.insert(taskData);
        console.log(`Task ${taskData.taskName} added. Task ID: ${taskId}`);
        return taskId;
    },
    'scheduler:removeTask': function (taskId) {
        // Remove a task by taskId
        Tasks.remove(taskId);
        console.log(`Task with ID ${taskId} removed.`);
    },
    'scheduler:clearTasks': function () {
        // Clear all tasks
        Tasks.remove({});
        console.log('All tasks cleared.');
    },
});

// Publication for tasks
Meteor.publish('scheduledTasks', function () {
    return Tasks.find({});
});

// Start the scheduler
Meteor.startup(() => {
    console.log('Starting the scheduler...');
    // Add a task to the system for demonstration purposes
    Meteor.call('scheduler:addTask', {
        taskId: 'example-task-1',
        taskName: 'Example Task',
        taskFunction: '() => { console.log("This is an example task."); return true; }',
        schedule: {
            minutes: 1, // Run every minute
        },
        active: true,
    });

    // Periodically run tasks
    const schedule = require('node-schedule');
    Tasks.find().forEach(task => {
        if (task.active) {
            // Use node-schedule to schedule the task
            schedule.scheduleJob(task.schedule, () => {
                runTask(task);
                // Update next run time after execution
                Tasks.update(task.taskId, { $set: { nextRunTime: new Date(new Date().getTime() + task.schedule.minutes * 60000) } });
            });
        }
    });
});