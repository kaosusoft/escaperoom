function closeAllSelect(elmnt) {
	/*a function that will close all select boxes in the document,
	except the current select box:*/
	var x, y, i, arrNo = [];
	x = document.getElementsByClassName("select-items");
	y = document.getElementsByClassName("select-selected");
	for (i = 0; i < y.length; i++) {
		if (elmnt == y[i]) {
			arrNo.push(i)
		} else {
			y[i].classList.remove("select-arrow-active");
		}
	}
	for (i = 0; i < x.length; i++) {
		if (arrNo.indexOf(i)) {
			x[i].classList.add("select-hide");
		}
	}
}



function redirect_on_hash(hash){
	if(typeof hash != 'undefined' && hash != '') {
		jQuery('html, body').animate({
				scrollTop: jQuery(hash).offset().top
			}, 800, function(){

			window.location.hash = hash;
		});
	}
}

jQuery(document).ready(function(){
	
	/*if the user clicks anywhere outside the select box,
	then close all select boxes:*/
	document.addEventListener("click", closeAllSelect);

	/* select dropdown end*/
	
	/* select dropdown*/
	var x, i, j, selElmnt, a, b, c;
	/*look for any elements with the class "custom-select":*/
	x = document.getElementsByClassName("customselect");
	for (i = 0; i < x.length; i++) {
		selElmnt = x[i].getElementsByTagName("select")[0];
		/*for each element, create a new DIV that will act as the selected item:*/
		a = document.createElement("div");
		a.setAttribute("class", "select-selected");
		a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
		x[i].appendChild(a);
		/*for each element, create a new DIV that will contain the option list:*/
		b = document.createElement("div");
		b.setAttribute("class", "select-items select-hide");
		for (j = 0; j < selElmnt.length; j++) {
			/*for each option in the original select element,
			create a new DIV that will act as an option item:*/
			c = document.createElement("div");
			c.innerHTML = selElmnt.options[j].innerHTML;
			c.addEventListener("click", function(e) {
				/*when an item is clicked, update the original select box,
				and the selected item:*/
				var y, i, k, s, h;
				s = this.parentNode.parentNode.getElementsByTagName("select")[0];
				h = this.parentNode.previousSibling;
				for (i = 0; i < s.length; i++) {
					if (s.options[i].innerHTML == this.innerHTML) {
						s.selectedIndex = i;
						h.innerHTML = this.innerHTML;
						y = this.parentNode.getElementsByClassName("same-as-selected");
						for (k = 0; k < y.length; k++) {
							y[k].removeAttribute("class");
						}
						this.setAttribute("class", "same-as-selected");
						location.href = jQuery('#locations option:eq('+i+')').val();
						break;
					}
				}
				h.click();
			});
			b.appendChild(c);
		}
		x[i].appendChild(b);
		a.addEventListener("click", function(e) {
			/*when the select box is clicked, close any other select boxes,
			and open/close the current select box:*/
			e.stopPropagation();
			closeAllSelect(this);
			this.nextSibling.classList.toggle("select-hide");
			this.classList.toggle("select-arrow-active");
		});
	}
	
	/* Hexagon Center */	
	if(jQuery("#blog-hexagon").length > 0) {
		var blog_hexagon_top = jQuery("#blog-hexagon").offset().top + 85;
		
		jQuery(window).scroll(function(){
			if (jQuery(window).scrollTop() + 85 > blog_hexagon_top) {
				jQuery("#blog-hexagon").addClass("sticky");
				jQuery("#blog-hexagon").css("top",jQuery(window).scrollTop() - blog_hexagon_top);

			} else {
				jQuery("#blog-hexagon").css("top","");
				jQuery("#blog-hexagon").removeClass("sticky");
			}
		});
	}	
	
	var hash = window.location.hash;
	if(typeof hash!= 'undefined' && hash!= '') {
		redirect_on_hash(hash);
	}
	
	/*jQuery('.booknow-button').click(function(event){
		event.preventDefault();	
		booking();
	});*/
	
	jQuery("a").on('click',function(event) {
		redirection_url = jQuery(this).prop('protocol')+'//'+jQuery(this).prop('host')+jQuery(this).prop('pathname');
		current_url = location.protocol+'//'+location.host+location.pathname;
		
		if (redirection_url == current_url && this.hash !== "") {
			event.preventDefault();	
			var hash = this.hash;
			redirect_on_hash(hash);
		}
	});
});

function booking() {
	if(jQuery('.partials-booking-steps-php').length > 0){
		jQuery('html,body').animate({
			scrollTop: jQuery('.partials-booking-steps-php').offset().top
		}, 'slow');
	} else if(jQuery('.booking-widget-iframe').length > 0){
		jQuery('html,body').animate({
			scrollTop: jQuery('.booking-widget-iframe').offset().top
		}, 'slow');
	} else {
		
		if(settings.is_main_website == 0){
			location.href = settings.booking_page+"#book-now";
		} else {
			location.href = settings.booking_page;
		}
		
	}
}

var booknowButtons = document.getElementsByClassName('booknow-button');
for(var i = 0; i < booknowButtons.length; i++) {
	(function(index) {
		booknowButtons[index].addEventListener("click", function(event) {
			event.preventDefault();
			booking();
		})
	})(i);
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

jQuery(document).ready(function() {
	jQuery(".single-post .blog-content iframe").each(function() {
		jQuery(this).wrap("<div class='embed-responsive embed-responsive-16by9'></div>")		
	});
	jQuery(".single-post .blog-content iframe").addClass("embed-responsive-item");
});