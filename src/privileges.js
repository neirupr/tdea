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
				'name': 'subscribe',
				'path': '/subscribe',
				'caption': 'Inscribirse'
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
					'name': 'createCourse',
					'path': '/create',
					'caption': 'Abrir Curso'
				},{
					name: 'listCourses',
					path: '/listCourses',
					caption: 'Ver Cursos'
				},{
					'name': 'students',
					'path': '/students',
					'caption': 'Listar Inscritos por curso'
				})
			break
	}

/*	if(type === 'coordinador'){
		access.push(
			{
				'name': 'registered',
				'path': '/allusers',
				'caption': 'Administrar usuarios'
			}
			)
	} else {
		access.push({
				'name': 'subscribe',
				'path': '/subscribe',
				'caption': 'Inscribirse'
			},
			{
				'name': 'cursos',
				'path': '/courseList',
				'caption': 'Mis Cursos'
			})
	}*/

	return access
}

module.exports = { getPrivileges }