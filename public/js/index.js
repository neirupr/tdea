function toggleAside(){
	$('#js-aside').toggleClass('d-flex').toggleClass('d-none')
}

$('.js-stopPropagation').on('click', (e)=>{
	e.stopPropagation()
})

$('#restorePasswordForm').on('submit', (e)=>{
	if($('#confirmPassword').val() !== $('#password').val()){
		$('.js-validatePasswords-error').addClass('d-flex')
		e.preventDefault()
	} else {
		$('.js-validatePasswords-error').removeClass('d-flex')
	}
})