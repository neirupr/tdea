function toggleAside(){
	$('#js-aside').toggleClass('d-flex').toggleClass('d-none')
}

function toggleChat(){
	$('.js-toggleChat').toggleClass('d-none')
	$('.js-chatContent').toggleClass('d-none').toggleClass('active')

	if($('.js-chatContent').is('.active')){
		$('.chat__bubble').addClass('d-none').removeClass('d-flex').find('span').html(0);
		$('.js-chat').scrollTop($('.js-chat').prop("scrollHeight"))
	}
}

$('.chat__input').on('submit', e=>{
	e.preventDefault()
	let $jsChat = $('.js-chat'),
		$jsChatText = $('.js-chatText'),
		text = $jsChatText.val()
	
	if(text !== ''){
		let data = {
			message: text,
			user: $('.js-user').text()
		}
		socket.emit('message', data)
		$jsChatText.val('').focus()
		$(`<p><strong>Tú: </strong> ${text} </p>`).appendTo($jsChat)
		$jsChat.scrollTop($jsChat.prop("scrollHeight"))
	}
})

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