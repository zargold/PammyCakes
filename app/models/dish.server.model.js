'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Validation
 */
function validateLength (v) {
  // a custom validation function for checking string length to be used by the model
  return v.length <= 40;
}


/**
 * Dish Schema
 */
var DishSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	category: { 
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: 'invalid category'
  },
	name: {
		type: String,
		default: '',
		required: 'Please fill Dish name',
		validate: [validateLength, 'name must be 40 chars in length or less'],
		trim: true
	},
	description: {
	  type: String,
	  default: '',
	  trim: true
	},
	quantityPerUnit: {
	    type: String,
	    default: 1
	},
	unitPrice: {
	    type: Number,
	    default: 0
	},
	occasions: [{
		type: Schema.Types.ObjectId,
		ref: 'Occasions'
	}],
	imgUrl: {
		type: String,
		default: '',
		trim: true
	},
	calories: {
		type: Number
	},
	
	ingredients: [{
		type: Schema.Types.ObjectId,
		ref: 'Ingredient'
	}],
	discontinued: {
		type: Boolean,
		default: false
	}
});

mongoose.model('Dish', DishSchema);