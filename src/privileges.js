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
			break
		case 'coordinador':
			access.push(
				{
					'name': 'create',
					'path': '/create',
					'caption': 'Abrir Curso'
				},{
					name: 'listCourses',
					path: '/listCourses',
					caption: 'Ver Cursos'
				})
			break
	}

/*	if(type === 'coordinador'){
		access.push(
			{
				'name': 'students',
				'path': '/students',
				'caption': 'Listar Inscritos por curso'
			},
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