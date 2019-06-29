"use strict"
require('./config/config')

const express = require('express'),
	app = express(),
	path = require('path'),
	publicDir = path.join(__dirname,'../public'),
	bodyParser = require('body-parser'),

	//Mongoose connect
	mongoose = require('mongoose')

	mongoose.connect('mongodb://localhost:27017/neiro', {useNewUrlParser: true}, (err, result)=>{
		if(err){
			return console.log("Unable to connect MongoDB, please check server")
		}

		console.log("Successfully connected to MongoDB")
	})

app.use(bodyParser.urlencoded({extended:false}))
.use(express.static(publicDir))

//Routes
.use(require('./routes/index'))

app.listen(3000, ()=>{
	console.log('Escuchando en el puerto 3000')
})
