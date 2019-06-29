"use strict"
const mongoose = require('mongoose'),
	uniqueValidator = require('mongoose-unique-validator'),
	Schema = mongoose.Schema,
	userSchema = new Schema({
		name:{
			type: String,
			required: true
		},
		password:{
			type: String,
			required: true
		},
		id:{
			type: Number,
			required: true,
			unique: true,
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
		type:{
			type: String,
			required: true,
			enum: {values: ['admin', 'aspirante', 'interesado', 'docente']}
		}
	}),

	User = mongoose.model('User', userSchema)

module.exports = User