$(function() {
	// ���־� �̹���(���̵���, ���̵�ƿ�)
	$('div#vis_rolling img:nth-of-type(1)').show().delay(2800).fadeOut(200);

	var n = 1;
	var imgNum = $('div#vis_rolling img').length;

	rolling = setInterval(function() {
		n++;
		if (n == imgNum) {
			n = 1;
		}
		$('div#vis_rolling img:nth-of-type('+n+')').fadeIn(200).delay(2500).fadeOut(200);
	}, 2900);
	// $('div#vis_rolling img:nth-of-type(1)').show().delay(2900).fadeOut(200);


	// �۷ι� ����, �Ŀ� ����Ʈ
	$('div.cont0_box').mouseenter(function() {
		$(this).css({
			'height' : '160px',
			'margin-top': '-10px'
		});
	}).mouseleave(function() {
		$('div#cont0 div').removeAttr('style');
	});


	// ������� ��û�ϱ�
	$('div#cont3_3 div input').one('click', function() {
		$(this).attr('value', "");
	});


	// ��Ʈ������ �׺���̼�
	$('table#port_nav tr td a').click(function() {
		$('table#port_nav tr td a').removeClass("focus");
		$(this).addClass("focus");
	});


	/* ��� �����̵� ��� */
	// �����̵� ���
	var i = 1;
	wFocus = setInterval(function() {
		i++;
		if (i==4) {
			i=2;
			$('ul.banner').css({'margin-left' : -1080});
		}
		$('ul.banner').stop().animate({marginLeft:-1080*i}, 1200);
	}, 5000);

	// < ������ �� �����̵� �ڷ�
	$('a#arr_left').click(function() {
		i--;
		if (i==-1) {
			i = 2;
			$('ul.banner').css({'margin-left' :-1080*i});
		}
		$('ul.banner').stop().animate({marginLeft:-1080*i}, 1200);
	});

	// > ������ �� �����̵� ������
	$('a#arr_right').click(function() {
		i++;
		if (i==4) {
			i = 2;
			$('ul.banner').css({'margin-left' :-1080});
		}
		$('ul.banner').stop().animate({marginLeft:-1080*i}, 1200);
	});
});