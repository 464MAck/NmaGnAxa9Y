// 代码生成时间: 2025-09-09 20:22:00
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Crypto } from 'meteor/random';

// Password Encryption Decryption Tool
// This tool provides functions for encrypting and decrypting passwords.

// Encrypt a password using a secret key.
// @param {string} password - The password to be encrypted.
// @returns {string} - The encrypted password.
function encryptPassword(password) {
  if (!password) {
    throw new Error('Password is required for encryption.');
  }
  const secretKey = Crypto.secretKey;
  const encrypted = Crypto.encrypt(password, secretKey);
  return encrypted;
}

// Decrypt a password using a secret key.
// @param {string} encryptedPassword - The encrypted password to be decrypted.
// @param {string} secretKey - The secret key used for decryption.
// @returns {string} - The decrypted password.
function decryptPassword(encryptedPassword, secretKey) {
  if (!encryptedPassword) {
    throw new Error('Encrypted password is required for decryption.');
  }
  if (!secretKey) {
    throw new Error('Secret key is required for decryption.');
  }
  const decrypted = Crypto.decrypt(encryptedPassword, secretKey);
  return decrypted;
}

// Meteor method for client to call for password encryption.
Meteor.methods({
  'encryptPassword': function(password) {
    check(password, String); // Check if the password is a string.
    try {
      const encrypted = encryptPassword(password);
      return { result: 'success', encrypted };
    } catch (error) {
      return { result: 'error', error: error.message };
    }
  },
  'decryptPassword': function(encryptedPassword, secretKey) {
    check(encryptedPassword, String); // Check if the encrypted password is a string.
    check(secretKey, String); // Check if the secret key is a string.
    try {
      const decrypted = decryptPassword(encryptedPassword, secretKey);
      return { result: 'success', decrypted };
    } catch (error) {
      return { result: 'error', error: error.message };
    }
  }
});
