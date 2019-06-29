"use strict"

const fs = require('fs')
let coursesList = []

const read = () =>{
	try{
		coursesList = require('../data/courses.json')
		//coursesList => JSON.parse(fs.readFileSync('./data/courses.json'))
	} catch(error){
		console.log("El archivo courses.json necesita crearse")
	}
}

const save = () =>{
	let data = JSON.stringify(coursesList)
	fs.writeFile('./data/courses.json', data, err=>{
		if(err) trow(err)
		console.log("El archivo courses.json se ha creado con éxito")
	})
}


const getCourses = () =>{
	read()
	return coursesList
}

const create = (ecourse) =>{
	read()

	let exists = coursesList.find(course => course.id === ecourse.id)

	if (!exists){
		coursesList.push(ecourse)
		save()
		return {message: 'Se ha creado el curso!', success: 'success'}
	} else {
		return {message: 'El curso ya existe', success: 'fail'}
	}
}

const close = (id) =>{
	let course = coursesList.find(c => c.id === id)
	
	coursesList[coursesList.indexOf(course)].available = false
	save()

	return {message: 'Se desactivó el curso ' + course.name + ' exitosamente', success: 'success'}
}

module.exports = {create, close, getCourses}