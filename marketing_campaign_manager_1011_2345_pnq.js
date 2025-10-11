// 代码生成时间: 2025-10-11 23:45:45
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

// Define a collection to store marketing campaigns
const MarketingCampaigns = new Mongo.Collection('marketingCampaigns');

// Define a schema for the marketing campaign documents
const campaignSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
    max: 200
  },
  description: {
    type: String,
    label: 'Description',
    optional: true
  },
  startDate: {
    type: Date,
    label: 'Start Date',
    optional: true
  },
  endDate: {
    type: Date,
    label: 'End Date',
    optional: true
  },
  status: {
    type: String,
    label: 'Status',
    allowedValues: ['active', 'inactive'],
    optional: true
  }
});
MarketingCampaigns.attachSchema(campaignSchema);

// Method to insert a new marketing campaign
Meteor.methods({
  'campaigns.insert': function (campaignData) {
    check(campaignData, campaignSchema);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to create a campaign.');
    }
    return MarketingCampaigns.insert(campaignData);
  }
});

// Method to update an existing marketing campaign
Meteor.methods({
  'campaigns.update': function (campaignId, campaignData) {
    check(campaignId, String);
    check(campaignData, campaignSchema);
    const campaign = MarketingCampaigns.findOne(campaignId);
    if (campaign.private === true && campaign.owner !== this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to update this campaign.');
    }
    return MarketingCampaigns.update(campaignId, { $set: campaignData });
  }
});

// Method to remove a marketing campaign
Meteor.methods({
  'campaigns.remove': function (campaignId) {
    check(campaignId, String);
    const campaign = MarketingCampaigns.findOne(campaignId);
    if (campaign.private === true && campaign.owner !== this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to remove this campaign.');
    }
    return MarketingCampaigns.remove(campaignId);
  }
});

// Method to list all marketing campaigns
Meteor.methods({
  'campaigns.list': function () {
    return MarketingCampaigns.find().fetch();
  }
});

// Publish the marketing campaigns to the client
Meteor.publish('marketingCampaigns', function () {
  return MarketingCampaigns.find();
});
