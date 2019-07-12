const express = require('express'),
	app = express (),
	path = require('path'),
	hbs = require ('hbs'),
	dirViews = path.join(__dirname, '../../template/views'),
	partialsDir = path.join(__dirname,'../../template/partials'),
	Course = require('../models/course'),
	User = require('../models/user'),
	Subscription = require('../models/subscription')
	bcrypt = require('bcrypt'),
	privileges = require('../privileges'),
	session = require('express-session'),
	sgMail = require('@sendgrid/mail')

	sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
.get('/instructions',(req, res)=>{
	res.render('instructions', {
		pageTitle: 'Instrucciones',
		pageName: 'instructions'
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
	User.findOne({email: req.body.username.toLowerCase()}, (err, result)=>{
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
	
	res.redirect('/')
})
.post('/register', (req, res)=>{
	let newUser = new User({
			name: req.body.name,
			id: parseInt(req.body.id),
			email: req.body.email.toLowerCase(),
			password: bcrypt.hashSync(req.body.password, 10),
			phone: parseInt(req.body.phone),
			role: 'aspirante'
		})

	newUser.save((err, result)=>{
		let response
		if(err){
			let errObject = err.errors.id || err.errors.email
			response = {
				message: errObject.message,
				success: 'fail'
			}
		} else {
			response = {
				message: 'El usuario <strong>' + result.name + '</strong> se ha registrado correctamente! Por favor <a href="/">inicia sesión</a>',
				success: 'success'
			} 
		}

		const msg = {
			to: req.body.email.toLowerCase(),
			from: 'neiro.torres@keyrus.com',
			subject: 'Bienvenid@ ' + newUser.name + ' a mi sistema gestor de cursos' ,
			html: `
				<div style="border: 1px solid black; width: 100%;">
					<div style="background-color:black;color:white;text-align: center;padding: 5px 0;font-size: 28px;">
						Bienvenid@ a mi Gestor de Cursos!
					</div>
					<div style="padding: 10px;">
						<p>Muchas gracias <strong>${newUser.name}</strong> por suscribirte a mis cursos. Te doy la bienvenida y espero que sea de tu agrado probar mi entrega.</p>
						<p>Tus datos de inicio de sesión son:</p>
						<div>
							<p style="margin: 0px"><strong>Usuario: </strong> ${newUser.email}</p>
							<p style="margin: 0px"><strong>Contraseña: </strong> ${req.body.password}</p>
						</div>
					</div>
				</div>

				<br>
				<p style="margin: 0px">Si estás en busca de una oportunidad laboral como Front-end y sabes JavaScript, HTML, CSS y JQuery ó</p>
				<p style="margin: 0px">Si estás en busca de una oportunidad laboral como Back-end y sabes Java y Spring</p>
				<p style="margin: 0px">No dudes en enviarme tu hoja de vida a <strong>neiro.torres@keyrus.com</strong> y <strong>neiroandres@yahoo.com.co</strong> (aplican para Medellín y Bogotá)</p>
			`
		};

		sgMail.send(msg)
		res.render('register', {
			page: 'register',
			pageTitle: 'Registrar nuevo usuario',
			response: response
		})
	})	
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
	User.findById(req.session.user, (err, user)=>{
		if(err){
			console.log(err)
			return res.render('subscribe',{
				response:{
					message: 'Hubo un problema accediendo la base de datos',
					success: 'fail'
				}
			})
		}

		let name='', id='', email='', phone=''
		if(user){
			name = user.name
			id = user.id
			email = user.email
			phone = user.phone
		}

		Course.find({}).exec((error, result)=>{
			if(error){
				console.log(error)
			}

			res.render('subscribe',{
				page: 'subscribe',
				pageTitle: 'Inscribirse en un Curso',
				courses: result,
				name: name,
				id: id,
				email: email,
				phone: phone
			})
		})
	})
})
.post('/subscribe', (req, res)=>{
	let subscription = new Subscription({
			name: req.body.name,
			id: parseInt(req.body.id),
			email: req.body.email,
			phone: parseInt(req.body.phone),
			course: parseInt(req.body.course)
		})

	Subscription.findOne({id: subscription.id, course: subscription.course}, (err, subs)=>{
		let response,
			renderPage = ()=>{
				User.findById(req.session.user, (err, user)=>{
					if(err){
						console.log(err)
						response = {
							message: 'Hubo un problema accediendo la base de datos',
							success: 'fail'
						}
					}

					let name='', id='', email='', phone=''
					if(user){
						name = user.name
						id = user.id
						email = user.email
						phone = user.phone
					}

					Course.find({}).exec((error, result)=>{
						if(error){
							console.log(error)
						}

						res.render('subscribe',{
							page: 'subscribe',
							pageTitle: 'Inscribirse en un Curso',
							courses: result,
							name: name,
							id: id,
							email: email,
							phone: phone,
							response: response
						})
					})
				})
			}

		if(err){
			response = {
				message: err.errors,
				success: 'fail'
			}

			return renderPage()
		}

		if(subs){
			response = {
				message: 'Ya estás matriculado en este curso',
				success: 'fail'
			}

			renderPage()
		} else {
			subscription.save((error, result)=>{
				if(error){
					console.log(error)
					response = {
						message: error,
						success: 'fail'
					}
				} else {
					response = {
						message: 'Te has matriculado correctamente en el curso!',
						success: 'success'
					}
				}

				renderPage()
			})
		}
	})
})
.get('/students', (req, res)=>{
	let subscriptions = []

	Course.find({}).exec((err, courseList)=>{
		if(err){
			return console.log(err)
		}

		Subscription.find({}).exec((error, subscriptionList)=>{
			if(error){
				return console.log(error)
			}

			res.render('listStudents',{
				page: 'students',
				pageTitle: 'Estudiantes Inscritos',
				courses: courseList,
				students: subscriptionList
			})
		})
	})

})
.post('/students', (req, res)=>{
	let method = req.body.method,
		id = parseInt(req.body.id),
		response,
		subscriptions = []

	if(method !== 'delete'){
		Course.updateOne({id: id}, {$set:{available: false}}, (err, result)=>{
			if(err){
				response = {
					message: err,
					success: 'fail'
				}
			} else {
				response = {
					message: `Se cerró correctamente el curso <strong>${id}</strong>`,
					success: 'success'
				}
			}

			Course.find({}).exec((err, courseList)=>{
				if(err){
					return console.log(err)
				}

				Subscription.find({}).exec((error, subscriptionList)=>{
					if(error){
						return console.log(error)
					}

					res.render('listStudents',{
						page: 'students',
						pageTitle: 'Estudiantes Inscritos',
						courses: courseList,
						students: subscriptionList,
						response: response
					})
				})
			})
		})
	} else {
		let course = parseInt(req.body.course)
		
		Subscription.findOneAndDelete({id: id, course: course}, (err, result)=>{
			if(err){
				response = {
					message: err,
					success: 'fail'
				}
			} else {
				response = {
					message: `El estudiante con identificación <strong>${id}</strong> se eliminó del curso correctamente.`,
					success: 'success'
				}
			}
			
			Course.find({}).exec((err, courseList)=>{
				if(err){
					return console.log(err)
				}

				Subscription.find({}).exec((error, subscriptionList)=>{
					if(error){
						return console.log(error)
					}

					res.render('listStudents',{
						page: 'students',
						pageTitle: 'Estudiantes Inscritos',
						courses: courseList,
						students: subscriptionList,
						response: response
					})
				})
			})
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