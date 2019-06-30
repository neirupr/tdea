"use strict"
const mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator'),
	Schema = mongoose.Schema,
	courseSchema = new Schema({
		description:{
			type: String,
			required: true
		},
		id:{
			type: Number,
			required: true,
			unique: true,
			trim: true
		},
		intensity:{
			type: Number,
			trim: true
		},
		modality:{
			type: String,
			enum: {values: ['Presencial','Virtual']}
		},
		name:{
			type: String,
			required: true
		},
		price:{
			type: Number,
			required: true
		},
		available:{
			type: Boolean,
			required: true
		}
	}),

	Course = mongoose.model('Course', courseSchema)

courseSchema.plugin(uniqueValidator, {message: 'Ya existe un curso con el id <strong>{VALUE}</strong>'})

module.exports = Course