socket = io()

socket.on('message', data=>{
	$(`<p><strong>${data.user}: </strong> ${data.message} </p>`).appendTo($('.js-chat'))
	$('.js-chat').scrollTop($('.js-chat').prop("scrollHeight"))
	if(!$('.js-chatContent').is('.active')){
		let unreadMessages = parseInt($('.js-newMessagesCounter').html())
		$('.js-newMessagesCounter').html(unreadMessages + 1)
		$('.chat__bubble').addClass('d-flex').removeClass('d-none')
	}
})