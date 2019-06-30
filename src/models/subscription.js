"use strict"
const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	subscriptionSchema = new Schema({
		name:{
			type: String,
			required: true
		},
		id:{
			type: Number,
			required: true,
			trim: true
		},
		email:{
			type: String,
			required: true,
			trim: true
		},
		phone:{
			type: Number,
			required: true
		},
		course:{
			type: Number,
			required: true,
			trim: true
		}
	}),

Subscription = mongoose.model('Subscription', subscriptionSchema)


module.exports = Subscription