'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validation = require('./validation.server.model');

/**
 * Validation
 */
function validateLength (v) {
  // a custom validation function for checking string length to be used by the model
  return v.length <= 15;
}

/**
 * Category Schema
 */
var CategorySchema = new Schema({
    // the property name
    created: {         
        type: Date,   
        default: Date.now 
    },
    description: {
        type: String,
        default: '',
        // gets rid of whitespace
        trim: true
    },
    name: {
        type: String,
        default: '',
        trim: true,     
        unique : true,
        // make this a required field
        required: 'name cannot be blank',
        // wires in a custom validator
        validate: [validation.len(20), 'name must be 20 chars in length or less']
    },
    icon: {
      type: String,
      //comes from font-awesome's birthday.
      default: 'fa fa-birthday-cake',
      trim: true
    }
});

// similar to a 'public' setter).
mongoose.model('Category', CategorySchema);