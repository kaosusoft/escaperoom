$(function(){

	$.datepicker.regional['ko'] = {
		closeText: '닫기',
		prevText: '이전달',
		nextText: '다음달',
		currentText: '오늘',
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		dayNames: ['일','월','화','수','목','금','토'],
		dayNamesShort: ['일','월','화','수','목','금','토'],
		dayNamesMin: ['일','월','화','수','목','금','토'],
		weekHeader: 'Wk',
		dateFormat: 'yy-mm-dd',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: true,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['ko']);
	$(".calField").datepicker({changeMonth: true, changeYear: true});

	$("input[type='checkbox'], input[type='radio']").css({"width":"18px","height":"18px"})

	$(".numField").keyup(function() {if(this.value.match(/[^0-9.]/)) { alert('숫자만 입력해 주세요.'); this.value = ''; return false;}});

	$(".toCurrencyPositive").keyup(function() { this.value=toCurrencyPositive(this.value); });

	$(".jumpselect").change(function() { this.form.submit(); });

	$(".numFieldNoAlert").keyup(function() {if(this.value.match(/[^0-9.]/)) { this.value = ''; return false;}});
	$("#chAll").click(function(){ 
		checkAll();
	});

	$(".btn-delete-s").click(function(){
		if(confirm("삭제 하시겠습니까?\n관련된 자료가 삭제되고 복구할 수 없습니다.")){ 
			location.href = $(this).attr("href");
		}else{
			return false;
		}
	});

	$("#allDelBtn").click(function(){ cgListConfirm($(this).attr("data-Mode")); });
	$(".blindBtn").click(function(){ cgListUpdate($(this).attr("data-Mode")); });
	$(".seqBtn").click(function(){ seqListUpdate($(this).attr("data-Mode")); });

	$("#allCancelBtn").click(function(){ cgListCancel($(this).attr("data-Mode")); });

	//로그인
	$("#id_login").focus();
	$("#loginFrm").ajaxForm({ beforeSubmit: validateLogin(), success: responseLogin });

	//관리자등록
	$.validator.addMethod( "chk_id", function(value, element) { return hangul_chk(document.joinForm.id.value); }, "영문, 숫자만 가능합니다." );
	$.validator.addMethod( "chk_pass", function(value, element) { return checkPass(document.joinForm.pass.value); }, "영문과 숫자를 조합해 주세요" );
	$("#joinForm").ajaxForm({ beforeSubmit: vd_Join(), success: rs_Join });

	//관리자정보수정
	$.validator.addMethod( "chk_pass_modify", function(value, element) { return checkPass(document.editForm.pass.value); }, "영문과 숫자를 조합해 주세요" );
	$("#editForm").ajaxForm({ beforeSubmit: vd_Modify(), success: rs_Modify });
	
});

//로그인
function validateLogin() {
	$("#loginFrm").validate();
}
function responseLogin(responseText, statusText, xhr, $form){
	if(responseText == "x1" || responseText == "x2"){
		$("#login-box").append("<div class='alert alert-danger' style='margin-right:12px;'>아이디 또는 비밀번호가 맞지 않습니다.</div>");
		$.doTimeout(1500, function(){ $(".alert-danger").remove() });
	}else{
		location.href = responseText;
	}
	
}

//관리자등록
function vd_Join() {
	$("#joinForm").validate({
		rules: {
			id: { rangelength: [4, 20], chk_id: true, remote: { url: "lib/ajax_process.php?Mode=ckId&id="+$("#id").val(), type: "post" } },
			pass: { rangelength: [6, 10], chk_pass: true },
			pass2: { equalTo: "#pass" },
			cell2: { number:true },
			cell3: { number:true }
		},
		messages: {
			id: { remote: "이미 사용중인 아이디입니다." }
		}
	});
}
function rs_Join(responseText, statusText, xhr, $form){
	if(responseText == "y"){
		location.href = "member.php";
	}else{
		alert("error");
	}
}

//관리자정보수정
function vd_Modify() {
	$("#editForm").validate({
		rules: {
			pass: { rangelength: [6, 10], chk_pass_modify: true },
			pass2: { equalTo: "#pass" },
			cell2: { number:true },
			cell3: { number:true }
		}
	});
}
function rs_Modify(responseText, statusText, xhr, $form){
	if(responseText == "y"){
		alert("수정되었습니다.");
		location.reload();
	}else{
		alert("error");
	}
}

function MM_jumpMenu(selObj,restore){
	window.open(selObj.options[selObj.selectedIndex].value, "_self");
	if (restore) selObj.selectedIndex=0;
}
function fLoadData(elm,strUrl){
	$.ajax({
		type: "POST",
		url: strUrl,
		data: "",
		success: function(resultText){
			$(elm).html(resultText);
		},
		error: function() {
		}
	});
}
function hangul_chk_id(word) {
	var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_";
	for (i=0; i< word.length; i++){
		idcheck = word.charAt(i);
		for ( j = 0 ;  j < str.length ; j++){
			if (idcheck == str.charAt(j)) break;
     			if (j+1 == str.length){
   					return false;
     			}
     		}
     	}
	return true;
}
function hangul_chk(word) {
	var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
	for (i=0; i< word.length; i++){
		idcheck = word.charAt(i);
		for ( j = 0 ;  j < str.length ; j++){
			if (idcheck == str.charAt(j)) break;
     			if (j+1 == str.length){
   					return false;
     			}
     		}
     	}
	return true;
}
function checkPass(pw){
	if(pw){
		var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		var number = "1234567890";
		//var sChar = "-_=+\|()*&^%$#@!~`?></;,.:'";
		 
		//var sChar_Count = 0;
		var alphaCheck = false;
		var numberCheck = false;
		  
		if(6 <= pw.length && pw.length <= 20){
			for(var i=0; i<pw.length; i++){
				/*
				if(sChar.indexOf(pw.charAt(i)) != -1){
					sChar_Count++;
				}
				*/
				if(alpha.indexOf(pw.charAt(i)) != -1){
					alphaCheck = true;
				}
				if(number.indexOf(pw.charAt(i)) != -1){
					numberCheck = true;
				}
			}
			if(alphaCheck != true || numberCheck != true){
				//alert("영문, 숫자 1자 이상으로 조합해주세요.");
				return false;
			}
		}else{
			//alert("6~20자로 입력해 주세요.");
			return false;
		}
		return true;
	}else{
		return true;
	}
}
function bsModal(title,address){
	$(".modal-title").html(title);
	fLoadData(".modal-body",address);
}
function checkAll(){
	if($("#chAll").prop('checked') == true){
		$('.chList').prop('checked',true);
	}else{
		$('.chList').prop('checked',false);
	}
}
function cgListConfirm(Mode){
	var chk_num=$('.chList:checked').length;
	if(chk_num==0) {
		alert("하나 이상 선택해 주세요.");
		return;
	}
	if (confirm('삭제하시겠습니까?\n관련된 데이터가 삭제되고\n삭제된 데이터는 복구할 수 없습니다.')){
		document.listForm.action = "lib/ajax_process.php";
		document.listForm.Mode.value = Mode;
		document.listForm.submit();
	}else{
		return;
	}
}
function cgListCancel(Mode){
	var chk_num=$('.chList:checked').length;
	if(chk_num==0) {
		alert("하나 이상 선택해 주세요.");
		return;
	}
	if (confirm('취소하시겠습니까?')){
		document.listForm.action = "lib/ajax_process.php";
		document.listForm.Mode.value = Mode;
		document.listForm.submit();
	}else{
		return;
	}
}
function cgListUpdate(Mode){
	var chk_num=$('.chList:checked').length;
	if(chk_num==0) {
		alert("하나 이상 선택해 주세요.");
		return;
	}
	if (confirm('적용하시겠습니까?')){
		document.listForm.action = "lib/ajax_process.php";
		document.listForm.Mode.value = Mode;
		document.listForm.submit();
	}else{
		return;
	}
}
function seqListUpdate(Mode){
	if (confirm('수정하시겠습니까?')){
		document.listForm.action = "lib/ajax_process.php";
		document.listForm.Mode.value = Mode;
		document.listForm.submit();
	}else{
		return;
	}
}
function toCurrencyPositive(amount){
    var firstChar = amount.substr(0,1);
    return toCurrency(amount);
}

function toCurrency(amount){
var data = amount.split('.');
    var sign = "";

    var firstChar = data[0].substr(0,1);
    if(firstChar == "-"){
        sign = firstChar;
        data[0] = data[0].substring(1, data[0].length);
    }

    data[0] = data[0].replace(/\D/g,"");
    if(data.length > 1){
        data[1] = data[1].replace(/\D/g,"");
    }

    firstChar = data[0].substr(0,1);

    //0으로 시작하는 숫자들 처리
    if(firstChar == "0"){
        if(data.length == 1){
            return sign + parseFloat(data[0]);
        }
    }

    var comma = new RegExp('([0-9])([0-9][0-9][0-9][,.])');

    data[0] += '.';
    do {
        data[0] = data[0].replace(comma, '$1,$2');
    } while (comma.test(data[0]));

    if (data.length > 1) {
        return sign + data.join('');
    } else {
        return sign + data[0].split('.')[0];
    }
}

/**
 * 주어진 값(val)을 소수점이하 num자리수에서 반올림한값을 리턴
 *
 * @param val 반올림할 값
 * @param num 반올림할 자리수
 * @return number
 */
function round(val, num){
    val = val * Math.pow(10, num - 1);
    val = Math.round(val);
    val = val / Math.pow(10, num - 1);
    return val;
}

/**
 * ,이 있는 숫자를 순수한 숫자로 바꿔준다. (+), (-) 허용
 *
 * @param num
 * @return number
 */
function toNormalNum( num ) {
    num = num.replace(/,/g, '');
    var args = Number(num);
    return args;
}

function CaricaFoto(img){ 
        foto1= new Image(); 
        foto1.src=(img); 
        Controlla(img); 
} 
function Controlla(img){ 
        if((foto1.width!=0)&&(foto1.height!=0)){ 
                viewFoto(img); 
        } 
        else{ 
                funzione="Controlla('"+img+"')"; 
                intervallo=setTimeout(funzione,20); 
        } 
} 
function viewFoto(img){
        largh=foto1.width + 30;
        altez=foto1.height + 20;

		window_left = (screen.width-largh)/2;
		window_top = (screen.height-altez)/2;

        stringa="width="+largh+",height="+altez+",left="+window_left+",top="+window_top+",resizable="+1+",scrollbars=yes";
        image_view=window.open(img,"",stringa);
        image_view.document.write("<html><head><meta HTTP-EQUIV='imagetoolbar' CONTENT='no'><title> </title></head><body leftmargin=0 marginwidth=0 topmargin=0 marginheight=0><img src="+img+" onclick='self.close()' style=cursor:hand></body></html>");
        image_view.document.close();
}
function openHZ(open_page,w,h){
	var window_left = (screen.width-w)/2;
	var window_top = (screen.height-h)/2 - 30;
	window.open(open_page,"openWin",'width='+w+',height='+h+',status=no,scrollbars=yes,top=' + window_top + ',left=' + window_left + '');
}
//팝업새창
function View_POPUP(no,skin) {
	var window_left = (screen.width-640)/2;
	var window_top = (screen.height-480)/2;

	if(skin == "y"){
		window.open("/popup.php?no="+no,"checkIDWin",'width=450,height=300,status=no,scrollbars=yes,top=' + window_top + ',left=' + window_left + '');
	}else{
		window.open("/popup.php?no="+no,"checkIDWin",'width=450,height=300,status=no,scrollbars=yes,top=' + window_top + ',left=' + window_left + '');
	}
}