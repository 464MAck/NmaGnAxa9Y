// 代码生成时间: 2025-08-04 11:02:32
// Meteor core packages
import { Meteor } from 'meteor/meteor';
import { FSCollection } from 'meteor/ostrio:files';

// Custom packages
import Sharp from 'sharp'; // Image processing library

// Constants
const IMAGES_COLLECTION_NAME = 'images'; // File collection name

// Create a new FSCollection instance
const Images = new FSCollection(IMAGES_COLLECTION_NAME, {
  stores: [
    {
      name: IMAGES_COLLECTION_NAME,
      storage: new FS.FileSystem.Storage('images', {
        filePath: Meteor.settings.public.imagesDir // Path to store images
      })
    }
  ]
});

// Allow client to upload images
Meteor.allowInsecure();
Images.allowClientCode = true;
Images.files.deny({insert() { return true; }}); // Deny inserts for security reasons
Images.files.denyClient();

// Check for permissions before resizing
Meteor.methods({
  'resizeImage': function(fileId, targetWidth, targetHeight) {
    check(fileId, String);
    check(targetWidth, Number);
    check(targetHeight, Number);
    
    try {
      const file = Images.collection.findOne(fileId);
      if (!file) {
        throw new Meteor.Error('file-not-found', 'File not found');
      }
      if (file.metadata.type !== 'image') {
        throw new Meteor.Error('invalid-file-type', 'File is not an image');
      }
      
      // Resize the image using Sharp
      const resizedPath = `${Meteor.settings.public.imagesDir}${file._id}_resized.${file.extension}`;
      Sharp(file.path)
        .resize(targetWidth, targetHeight)
        .toFile(resizedPath, (err, info) => {
          if (err) {
            throw new Meteor.Error('resize-error', 'Error resizing image');
          }
          
          // Save the resized file back to the database
          Images.insert({
            file: resizedPath,
            metadata: {
              type: 'image',
              originalFileId: fileId
            }
          });
        });
    } catch (error) {
      // Handle any errors that occur during resizing
      throw new Meteor.Error(error.error, error.reason);
    }
  }
});

// Client-side code to handle file uploads and image resizing
Template.body.onCreated(function() {
  this.imageFileInput = new ReactiveVar(null);
  this.resizedImage = new ReactiveVar(null);

  this.autorun(() => {
    const fileId = this.imageFileInput.get();
    if (!fileId) return;

    Meteor.call('resizeImage', fileId, 800, 600, (error, resizedFileId) => {
      if (error) {
        alert(error.reason);
      } else {
        this.resizedImage.set(resizedFileId);
      }
    });
  });
});

Template.body.helpers({
  imageFileInput: function() {
    return Template.instance().imageFileInput;
  },
  resizedImage: function() {
    return Template.instance().resizedImage.get();
  }
});

Template.body.events({
  // Event to handle file input change
  'change #imageInput'(event) {
    const files = event.target.files;
    const file = files[0];

    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(fileEvent) {
      const dataUrl = fileEvent.target.result;
      Images.insert({
        file: dataUrl,
        metadata: { type: 'image' }
      }, (error, fileRef) => {
        if (error) {
          alert(error.reason);
        } else {
          Template.instance().imageFileInput.set(fileRef._id);
        }
      });
    };
    reader.readAsDataURL(file);
  }
});