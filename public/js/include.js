$(function() {
	$('a.lan').mouseenter(function() {
		$(this).parent().children('ul').stop().slideDown();
	}).parent().children('ul').mouseleave(function() {
		$(this).parent().children('ul').stop().slideUp();
	});
});

$(function() {
	function showNav() {
		$('div#nav_wrap').show();
		$('div#screen_black').fadeIn();
		$('body, html').addClass("vis");
		$(this).one('click', hideNav);
	}
	function hideNav() {
		$('div#nav_wrap').hide();
		$('div#screen_black').fadeOut();
		$('body, html').removeClass("vis");
		$(this).one('click', showNav);
	}
	$('a.to_nav').one('click', showNav);
	$('div#screen_black').click(function() {
		$('div#nav_wrap').hide();
		$('div#screen_black').fadeOut();
		$('body, html').removeClass("vis");
	});

	// �׺���̼� ��Ÿ�� ����
	var navHeight = $(window).height();
	$('div#nav_wrap').css({
		'height' : "100%"
	});
});