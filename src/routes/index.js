const express = require('express'),
	app = express (),
	path = require('path'),
	hbs = require ('hbs'),
	dirViews = path.join(__dirname, '../../template/views'),
	partialsDir = path.join(__dirname,'../../template/partials'),
	courses = require('../courses'),
	students = require('../students')

require('../helpers')

//hbs
app.set('view engine', 'hbs')
   .set('views', dirViews)

hbs.registerPartials(partialsDir)

// Methods
app.get('/', (req, res) =>{
	res.render('index', {
		pageTitle: 'Gestor de Cursos',
		developers: [
			'Neiro Torres'
		]
	})
})
.get('/view', (req, res)=>{
	res.render('listCourses',{
		page: 'view',
		pageTitle: 'Lista de Cursos',
		courses: courses.getCourses()
	})
})
.get('/create', (req, res)=>{
	res.render('createCourse',{
		page: 'create',
		pageTitle: 'Abrir Curso'
	})
})
.post('/create', (req, res)=>{
	let course = {
		name: req.body.name,
		id: parseInt(req.body.id),
		description: req.body.description,
		price: parseFloat(req.body.price),
		modality: req.body.modality,
		intensity: parseFloat(req.body.intensity) || 0,
		available: true,
	}

	let response = courses.create(course)

	res.render('createCourse', {
		page: 'create',
		pageTitle: 'Abrir Curso',
		response: response
	})
})
.get('/subscribe', (req, res)=>{
	res.render('subscribe',{
		page: 'subscribe',
		pageTitle: 'Inscribir Alumnos',
		courses: courses.getCourses()
	})
})
.post('/subscribe', (req, res)=>{
	let student = {
		name: req.body.name,
		id: parseInt(req.body.id),
		email: req.body.email,
		phone: parseInt(req.body.phone),
		course: parseInt(req.body.course)
	}

	let response = students.create(student)

	res.render('subscribe',{
		page: 'subscribe',
		pageTitle: 'Inscribirse en un curso',
		courses: courses.getCourses(),
		response: response
	})
})
.get('/students', (req, res)=>{
	res.render('listStudents',{
		page: 'students',
		pageTitle: 'Estudiantes Inscritos',
		courses: courses.getCourses(),
		students: students.getStudents()
	})
})
.post('/students', (req, res)=>{
	let method = req.body.method,
		id = parseInt(req.body.id),
		response

	if(method !== 'delete'){
		response = courses.close(id)
	
		res.render('listStudents', {
			page: 'students',
			pageTitle: 'Estudiantes Inscritos',
			courses: courses.getCourses(),
			students: students.getStudents(),
			response: response
		})
	} else {
		let course = parseInt(req.body.course)
		
		response = students.cancel(id, course)

		res.render('listStudents', {
			page: 'students',
			pageTitle: 'Estudiantes Inscritos',
			courses: courses.getCourses(),
			students: students.getStudents(),
			response: response
		})
	}
})
.get('*', (req, res)=>{
	res.render('index', {
		pageTitle: 'Gestor de Cursos',
		developers: [
			'Neiro Torres'
		]
	})
})

module.exports = app