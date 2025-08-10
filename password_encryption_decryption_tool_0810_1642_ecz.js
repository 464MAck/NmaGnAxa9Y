// 代码生成时间: 2025-08-10 16:42:23
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { check } from 'meteor/check';

// Encryption and decryption functions
const encryptPassword = (password) => {
  // Check if password is a string
  check(password, String);
  
  try {
    // Use crypto package for encryption (example uses OpenSSL)
    const encrypted = CryptoJS.AES.encrypt(password, Meteor.settings.public.encryptionKey).toString();
    return encrypted;
  } catch (error) {
    console.error('Error encrypting password:', error);
    throw new Meteor.Error('encryption-error', 'Failed to encrypt password');
  }
};

const decryptPassword = (encryptedPassword) => {
  // Check if encryptedPassword is a string
  check(encryptedPassword, String);
  
  try {
    // Use crypto package for decryption (example uses OpenSSL)
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, Meteor.settings.public.encryptionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Error decrypting password:', error);
    throw new Meteor.Error('decryption-error', 'Failed to decrypt password');
  }
};

// API endpoints for encrypting and decrypting passwords
Meteor.methods({
  'password.encrypt': function(password) {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to encrypt a password');
    }
    
    // Encrypt the password and return the result
    const encrypted = encryptPassword(password);
    return {
      encrypted,
      success: true,
      message: 'Password encrypted successfully'
    };
  },
  'password.decrypt': function(encryptedPassword) {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to decrypt a password');
    }
    
    // Decrypt the password and return the result
    const decrypted = decryptPassword(encryptedPassword);
    return {
      decrypted,
      success: true,
      message: 'Password decrypted successfully'
    };
  }
});

// Publish settings for the encryption key (not recommended for production)
Meteor.startup(() => {
  ServiceConfiguration.configurations.remove({ service: 'password-encryption' });
  ServiceConfiguration.configurations.insert({
    service: 'password-encryption',
    encryptionKey: Meteor.settings.public.encryptionKey
  });
});