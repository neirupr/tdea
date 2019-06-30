const express = require('express'),
	app = express (),
	path = require('path'),
	hbs = require ('hbs'),
	dirViews = path.join(__dirname, '../../template/views'),
	partialsDir = path.join(__dirname,'../../template/partials'),
	// REMOVE
	courses = require('../courses'),
	students = require('../students'),
	//END REMOVE
	Course = require('../models/course'),
	User = require('../models/user'),
	bcrypt = require('bcrypt'),
	privileges = require('../privileges')
	session = require('express-session'),

require('../helpers')

//hbs
app.set('view engine', 'hbs')
   .set('views', dirViews)
	//Session
	.use(session({
		secret: 'anyName',
		resave: false,
		saveUninitialized: true
	}))

hbs.registerPartials(partialsDir)

//middleware
app.use((req, res, next)=>{
	if(req.session.user){
		res.locals.session = true
		res.locals.name = req.session.name
		res.locals.privileges = req.session.privileges
		res.locals.role = req.session.role
	} else {
		/*if(req.originalUrl !== '/login' && req.url !== "/register"){
			return res.render('login',{
				pageTitle: 'Iniciar sesión'
			})
		}*/
		res.locals.role = 'interesado'
		res.locals.privileges = privileges.getPrivileges('interesado')
	}
	next()
})

// Methods
app.get('/home', (req, res)=>{
	res.render('index', {
		pageTitle: 'Gestor de Cursos',
		developers: [
			'Neiro Torres'
		]
	})
})
.get('/', (req, res) =>{
	// CREATE ROOT USER IF DOESN'T EXIST
	User.findOne({id: 1, role: 'coordinador'},(err, result)=>{
		if(err){
			console.log(err)
		} else {
			if(!result){
				let newUser = new User({
					name: 'Admin',
					id: 1,
					email: 'admin@mailinator.com',
					password: bcrypt.hashSync('nimda', 10),
					phone: 1234567,
					role: 'coordinador'
				})

				newUser.save((err, result)=>{
					if(err){
						return console.log("Unable to create root user", err)
					}

					console.log("Root user created, user: " + result.email + ", password: nimda")
				})
			}
		}
	})

	res.render('login',{
		pageTitle: 'Iniciar sesión'
	})
})
.post('/login', (req, res)=>{
	User.findOne({email: req.body.username}, (err, result)=>{
		if(err){
			console.log(err)
			return res.render('login', {
				response: {
					message: 'Error conectando con la base de datos',
					success: 'fail'
				}
			})
		}

		if(result){
			if(bcrypt.compareSync(req.body.password, result.password)){
				req.session.user = result._id
				req.session.name = result.name
				req.session.privileges = privileges.getPrivileges(result.role)
				req.session.role = result.role

				res.redirect('home')
			} else {
				res.render('login', {
					response: {
						message: 'Las credenciales son incorrectas',
						success: 'fail'
					}
				})
			}
		} else {
			res.render('login', {
				response: {
					message: 'Las credenciales son incorrectas',
					success: 'fail'
				}
			})
		}
	})
})
.get('/register', (req, res)=>{
		res.render('register', {
			page: 'register',
			pageTitle: 'Registrar nuevo usuario',
		})		
})
.get('/logout', (req, res)=>{
	req.session.user = undefined
	req.session.name = undefined
	req.session.privileges = undefined

	res.redirect('/home')
})
.post('/register', (req, res)=>{
	let newUser = new User({
			name: req.body.name,
			id: parseInt(req.body.id),
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10),
			phone: parseInt(req.body.phone),
			role: 'aspirante'
		})

	newUser.save((err, result)=>{
		let response
		if(err){
			response = {
				message: err.errors.id.message,
				success: 'fail'
			}
		} else {
			response = {
				message: 'El usuario <strong>' + result.name + '</strong> se ha registrado correctamente! Por favor <a href="/">inicia sesión</a>',
				success: 'success'
			} 
		}


		res.render('register', {
			page: 'register',
			pageTitle: 'Registrar nuevo usuario',
			response: response
		})
	})

	/*let response = users.createUser(newUser)

	res.render('newUser', {
		page: 'newuser',
		pageTitle: 'Registrar nuevo usuario',
		response: response,
		user: currentUser,
		
	})*/	
})
.get('/listCourses', (req, res)=>{
	Course.find({}).exec((err, result)=>{
		if(err){
			return res.render('listCourses',{
				page: 'listCourses',
				pageTitle: 'Lista de Cursos',
				response: {
					message: 'Problema al cargar los cursos',
					success: 'fail'
				}
			})
		}

		res.render('listCourses',{
			page: 'listCourses',
			pageTitle: 'Lista de Cursos',
			courses: result
		})
	})
})
.get('/create', (req, res)=>{
	res.render('createCourse',{
		page: 'createCourse',
		pageTitle: 'Abrir Curso'
	})
})
.post('/create', (req, res)=>{
	let course = new Course({
			name: req.body.name,
			id: parseInt(req.body.id),
			description: req.body.description,
			price: parseFloat(req.body.price),
			modality: req.body.modality,
			intensity: parseFloat(req.body.intensity) || 0,
			available: true,
		})

	course.save((err, result)=>{
		let response
		if(err){
			console.log(err)
			response = {
				message: err.errors.id.message,
				success: 'fail'
			}
		} else {
			response = {
				message: 'Se creó el curso <strong>' + result.name + '</strong>',
				success: 'success'
			}
		}

		res.render('createCourse',{
			page: 'create',
			pageTitle: 'Abrir Curso',
			response: response
		})
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