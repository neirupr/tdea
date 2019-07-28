"use strict"
require('./config/config')

const express = require('express'),
	app = express(),
	path = require('path'),
	publicDir = path.join(__dirname,'../public'),
	bodyParser = require('body-parser'),
	server = require('http').createServer(app),
	io = require('socket.io')(server),

	//Mongoose connect
	mongoose = require('mongoose')

	mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, result)=>{
		if(err){
			return console.log("Unable to connect MongoDB, please check server")
		}

		console.log("Successfully connected to MongoDB")
	})

app.use(bodyParser.urlencoded({extended:false}))
.use(express.static(publicDir))

//Routes
.use(require('./routes/index'))

io.on('connection', client=>{
	client.on('message', data=>{
		client.broadcast.emit('message', data)
	})
})

server.listen(process.env.PORT, ()=>{
	console.log('Escuchando en el puerto ' + process.env.PORT)
})
