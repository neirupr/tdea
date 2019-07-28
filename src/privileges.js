"use strict"

const getPrivileges = (role) =>{
	let access = []

	switch(role){
		case 'aspirante':
			access.push({
				name: 'listCourses',
				path: '/listCourses',
				caption: 'Ver Cursos'
			},{
				name: 'subscribe',
				path: '/subscribe',
				caption: 'Inscribirse'
			},{
				name: 'myAccount',
				path: '/myAccount',
				caption: 'Mi cuenta'
			})
			break
		case 'interesado':
			access.push({
				name: 'listCourses',
				path: '/listCourses',
				caption: 'Ver Cursos'
			})
			break
		case 'coordinador':
			access.push(
				{
					name: 'createCourse',
					path: '/create',
					caption: 'Crear Curso'
				},{
					name: 'listCourses',
					path: '/listCourses',
					caption: 'Ver Cursos'
				},{
					name: 'students',
					path: '/students',
					caption: 'Listar Inscritos por curso'
				},{
					name: 'myAccount',
					path: '/myAccount',
					caption: 'Mi cuenta'
				})
			break
	}

	return access
}

module.exports = { getPrivileges }