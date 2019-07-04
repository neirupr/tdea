function toggleAside(){
	$('#js-aside').toggleClass('d-flex').toggleClass('d-none')
}

$('.js-stopPropagation').on('click', (e)=>{
	e.stopPropagation()
})