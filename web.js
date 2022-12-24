var express = require('express');
var requestIP = require('request-ip');
var http = require('http');
//var low = require('lowdb');
//var FileSync = require('lowdb/adapters/FileSync');
var ejs = require('ejs');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const crypto = require('crypto');
var popbill = require('popbill');
var util = require('./util.js');
var shop = require('./shop.js');
var isServer = require('./server/server.js');

// ***** mySQL db setting ***** //
var client;

var adminData = undefined;
var myThemeData = shop.getThemes();

const reserveTimeByNormal = [
	{index:0, time:[{time:'12:10', res:0}, {time:'13:20', res:0}, {time:'14:30', res:0}, {time:'15:40', res:0}, {time:'16:50', res:0}, {time:'18:00', res:0}, {time:'19:10', res:0}, {time:'20:20', res:0}, {time:'21:30', res:0}]},
	{index:2, time:[{time:'12:10', res:0}, {time:'13:20', res:0}, {time:'14:30', res:0}, {time:'15:40', res:0}, {time:'16:50', res:0}, {time:'18:00', res:0}, {time:'19:10', res:0}, {time:'20:20', res:0}, {time:'21:30', res:0}]},
	{index:6, time:[{time:'12:30', res:0}, {time:'13:40', res:0}, {time:'14:50', res:0}, {time:'16:00', res:0}, {time:'17:10', res:0}, {time:'18:20', res:0}, {time:'19:30', res:0}, {time:'20:40', res:0}]},
	{index:1, time:[{time:'12:50', res:0}, {time:'14:00', res:0}, {time:'15:10', res:0}, {time:'16:20', res:0}, {time:'17:30', res:0}, {time:'18:40', res:0}, {time:'19:50', res:0}, {time:'21:00', res:0}]},
	{index:4, time:[{time:'12:50', res:0}, {time:'14:00', res:0}, {time:'15:10', res:0}, {time:'16:20', res:0}, {time:'17:30', res:0}, {time:'18:40', res:0}, {time:'19:50', res:0}, {time:'21:00', res:0}]},
	{index:7, time:[{time:'리뉴얼', res:1}]}
];

const reserveTimeByHoliday = [
	{index:0, time:[{time:'11:00', res:0}, {time:'12:10', res:0}, {time:'13:20', res:0}, {time:'14:30', res:0}, {time:'15:40', res:0}, {time:'16:50', res:0}, {time:'18:00', res:0}, {time:'19:10', res:0}, {time:'20:20', res:0}, {time:'21:30', res:0}, {time:'22:40', res:0}]},
	{index:2, time:[{time:'11:00', res:0}, {time:'12:10', res:0}, {time:'13:20', res:0}, {time:'14:30', res:0}, {time:'15:40', res:0}, {time:'16:50', res:0}, {time:'18:00', res:0}, {time:'19:10', res:0}, {time:'20:20', res:0}, {time:'21:30', res:0}, {time:'22:40', res:0}]},
	{index:6, time:[{time:'11:20', res:0}, {time:'12:30', res:0}, {time:'13:40', res:0}, {time:'14:50', res:0}, {time:'16:00', res:0}, {time:'17:10', res:0}, {time:'18:20', res:0}, {time:'19:30', res:0}, {time:'20:40', res:0}, {time:'21:50', res:0}]},
	{index:1, time:[{time:'11:40', res:0}, {time:'12:50', res:0}, {time:'14:00', res:0}, {time:'15:10', res:0}, {time:'16:20', res:0}, {time:'17:30', res:0}, {time:'18:40', res:0}, {time:'19:50', res:0}, {time:'21:00', res:0}, {time:'22:10', res:0}]},
	{index:4, time:[{time:'11:40', res:0}, {time:'12:50', res:0}, {time:'14:00', res:0}, {time:'15:10', res:0}, {time:'16:20', res:0}, {time:'17:30', res:0}, {time:'18:40', res:0}, {time:'19:50', res:0}, {time:'21:00', res:0}, {time:'22:10', res:0}]},
	{index:7, time:[{time:'리뉴얼', res:1}]}
];

var reserveTimeByDay = [reserveTimeByHoliday, reserveTimeByNormal, reserveTimeByNormal, reserveTimeByNormal, reserveTimeByNormal, reserveTimeByNormal, reserveTimeByHoliday];
var serverData = {
	day : 0,
	date : '2021-10-19',
	endDate : '2021-10-19'
}

for(var i=0; i<reserveTimeByDay.length; i++){
	for(var j=0; j<reserveTimeByDay[i].length; j++){
		for(var k=0; k<myThemeData.length; k++){
			if(reserveTimeByDay[i][j].index == myThemeData[k].index){
				reserveTimeByDay[i][j].name = myThemeData[k].name;
				reserveTimeByDay[i][j].image = myThemeData[k].image;
				reserveTimeByDay[i][j].miniImage = myThemeData[k].miniImage;
				reserveTimeByDay[i][j].comment = myThemeData[k].comment;
				break;
			}
		}
	}
}

if(isServer.isServer()){
	client = mysql.createConnection({
		host: '211.47.75.102',
		port: 3306,
		user: 'kaosu',
		password: 'kaosu12345',
		database: 'dbkaosu'
	});
	popbill.config({
		LinkID : 'KAOSU',
		SecretKey : 'yzj2Bkxou/QL/8XsZNlffUD0xB4EQquRYOs+5IShqEk=',
		IsTest : false,
		IPRestrictOnOff: false,
		UseStaticIP: false,
		UseLocalTimeYN: true,
		defaultErrorHandler: function(error){
			console.log('Error : ['+error.code + '] '+error.message);
		}
	});
}else{
	client = mysql.createConnection({
		user: 'root',
		password: '0123523u',
		database: 'lible'
	});
	popbill.config({
		LinkID : 'KAOSU',
		SecretKey : 'yzj2Bkxou/QL/8XsZNlffUD0xB4EQquRYOs+5IShqEk=',
		IsTest : true,
		IPRestrictOnOff: false,
		UseStaticIP: false,
		UseLocalTimeYN: true,
		defaultErrorHandler: function(error){
			console.log('Error : ['+error.code + '] '+error.message);
		}
	});
}

var kakaoService = popbill.KakaoService();

// ***** local db setting ***** //
// var adapter = new FileSync('db.json');
// var db = low(adapter);
// db.defaults({theme:[], memo:{}, data:{}}).write();

// variable setting
const encKey = 'insideRoomKey';

var app = express();
app.use(cookieParser());
app.set('views', __dirname + '/public'); 
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname+'/public'));

// ******************************************* 관리페이지 ************************************************** //

app.all('/*', function(request, response, next){
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
})

app.get('/insideAdmin', function(request, response){
	let reqCookie = request.cookies;
	if(reqCookie.user != undefined && reqCookie.user.uuid != undefined){
		for(var i=0; i<adminData.length; i++){
			if(adminData[i].cookie == reqCookie.user.uuid){
				response.redirect('/insideManagerToday');
				return;
			}
		}
	}
	response.render('adminLogin.html');
});

app.post('/insideAdmin', function(request, response){
	var id = request.body.id;
	var pass = request.body.pass;
	var encPass = generateHMAC(encKey, pass);

	for(var i=0; i<adminData.length; i++){
		if(adminData[i].id == id && adminData[i].pass == encPass){
			var cookie = generateHMAC(encKey, util.getDateYMDHMS());
			adminData[i].cookie = cookie;
			client.query('update myinside set cookie = ? where id=? and pass=?', [cookie, id, encPass], function(error, result, fields){

			});
			response.cookie('user',{uuid:cookie});
			response.redirect('/insideAdmin');
			return;
		}
	}
	response.redirect('/insideAdmin');
});

app.get('/insideManagerToday', function(request, response){
	let reqCookie = request.cookies;
	if(reqCookie.user != undefined && reqCookie.user.uuid != undefined){
		for(var i=0; i<adminData.length; i++){
			if(adminData[i].cookie == reqCookie.user.uuid){
				client.query('SELECT * from reservation where dateStr = ? and cancel=0 order by timeStr desc',[util.getDateYYYYMMDD()], function(error, result, fields){
					if(error){
						response.send('Error');
					}else{
						response.render('admintoday.html', {data:result});
					}
				});
				return;
			}
		}
	}
	response.redirect('/insideAdmin');
});

app.get('/insideManagerAll', function(request, response){
	let reqCookie = request.cookies;
	var page = 1;
	if(request.query.page != undefined) page = request.query.page;
	var row = 30;
	var start = (page-1)*row;
	if(reqCookie.user != undefined && reqCookie.user.uuid != undefined){
		for(var i=0; i<adminData.length; i++){
			if(adminData[i].cookie == reqCookie.user.uuid){
				// limit 10, 3 등등...
				client.query('SELECT * from reservation where cancel=0 order by dateStr desc, timeStr desc limit ?, ?',[start, row], function(error, result, fields){
					if(error){
						response.send('Error');
					}else{
						response.render('adminall.html', {data:result});
					}
				});
				return;
			}
		}
	}
	response.redirect('/insideAdmin');
});

app.get('/insideManagerCancel', function(request, response){
	let reqCookie = request.cookies;
	var page = 1;
	if(request.query.page != undefined) page = request.query.page;
	var row = 30;
	var start = (page-1)*row;
	if(reqCookie.user != undefined && reqCookie.user.uuid != undefined){
		for(var i=0; i<adminData.length; i++){
			if(adminData[i].cookie == reqCookie.user.uuid){
				// limit 10, 3 등등...
				client.query('SELECT * from reservation where cancel=1 order by dateStr desc, timeStr desc limit ?, ?',[start, row], function(error, result, fields){
					if(error){
						response.send('Error');
					}else{
						response.render('admincancel.html', {data:result, server:serverData});
					}
				});
				return;
			}
		}
	}
	response.redirect('/insideAdmin');
});

app.get('/insideManagerEnd', function(request, response){
	serverData.endDate = serverData.date;
	console.log("Today End");
	response.redirect('/insideAdmin');
});

app.get('/insideDeleteItemToday', function(request, response){
	var uuid = request.query.id;
	if(!isServer.isServer()) console.log('canceling : ',uuid);
	deleteReserveItem(response, uuid, '/insideManagerToday', true);
});

app.get('/insideDeleteItemAll', function(request, response){
	var uuid = request.query.id;
	if(!isServer.isServer()) console.log('canceling : ',uuid);
	deleteReserveItem(response, uuid, '/insideManagerAll', true);
});

app.get('/insideReserveItemToday', function(request, response){
	client.query('SELECT * from reservation where dateStr = ? and cancel=0',[serverData.date], function(error, result, fields){
		if(error){
			response.json({error:1, result:[]});
		}else{
			response.json({error:0, result:result});
		}
	});
});

app.post('/insideReserveItemAdd', function(request, response){
	var branch = '인사이드 방탈출카페';
	var theme = request.body.theme;
	var date = util.getDateYYYYMMDD();
	var time = request.body.time;
	var name = request.body.name;
	var phone = request.body.phone;
	var phoneEnc = generateHMAC(encKey, name+phone);
	var person = request.body.person;
	var price = 0;
	var method = 0;
	var ip = requestIP.getClientIp(request);
	var uuid = uuidv4();

	if(!checkTime(time) || !checkPhone(phone) || !checkDate(date) || name.length < 2){
		response.json({state:3});
		return;
	}

	addReserveItem(response, branch, theme, date, time, name, phone, phoneEnc, person, price, method, ip, uuid, false);
});

app.get('/insideReserveItemDelete', function(request, response){
	var uuid = request.query.id;
	
	deleteReserveItem(response, uuid, '/', false)
});

// app.get('/insideTest', function(request, response){
// 	response.render('test.html');
// });

// ******************************************* 홈페이지 ************************************************** //

app.get('/', function(request, response){
	response.render('main.html', {themeData:myThemeData});
});

app.get('/naver', function(request, response){
	client.query('update insidelog set count=count+1 where _id=1', function(error, result, fields){});
	response.redirect('/');
});
app.get('/daum', function(request, response){
	client.query('update insidelog set count=count+1 where _id=2', function(error, result, fields){});
	response.redirect('/');
});
app.get('/google', function(request, response){
	client.query('update insidelog set count=count+1 where _id=3', function(error, result, fields){});
	response.redirect('/');
});

app.get('/reserve', function(request, response){
	var sDate = request.query.date;
	var searchDate = serverData.date;
	if(sDate != undefined){
		searchDate = sDate;
	}

	var searchDay = util.getDay(searchDate);
	var timeList = reserveTimeByDay[searchDay];
	for(var i=0; i<timeList.length; i++){
		for(var j=0; j<timeList[i].time.length; j++){
			if(checkTime(timeList[i].time[j].time)){
				if(serverData.endDate < searchDate){
					timeList[i].time[j].res = 0;
				}else{
					timeList[i].time[j].res = 1;
				}
			}else{
				timeList[i].time[j].res = 1;
			}
		}
	}
	client.query('SELECT * from reservation where dateStr = ? and cancel=0',[searchDate], function(error, result, fields){
		if(error){
			
		}else{
			if(result.length>0){
				for(var k=0; k<result.length; k++){
					var flag = false;
					for(var i=0; i<timeList.length; i++){
						for(var j=0; j<timeList[i].time.length; j++){
							if(timeList[i].time[j].time == result[k].timeStr && timeList[i].index == result[k].theme){
								timeList[i].time[j].res = 1;
								flag = true;
							}
						}
						if(flag) break;
					}
				}
			}
			response.render('reservation.html', {timeList:timeList, date:searchDate});
		}
	});
});

// 예약 입력페이지
app.get('/book', function(request, response){
	var bookDate = request.query.date;
	var bookTheme = request.query.theme;
	var bookTime = request.query.time;
	response.render('book.html', {date:bookDate, theme:bookTheme, themeStr:getThemeStr(bookTheme), time:bookTime, phone1:'010', phone2:'', phone3:''});
});

// 예약 신청
app.post('/book', function(request, response){
	var branch = request.body.name_branch;
	var theme = request.body.name_theme;
	var date = request.body.name_date;
	var time = request.body.name_time;
	var name = request.body.name_name;
	var phone1 = request.body.name_phone1;
	var phone2 = request.body.name_phone2;
	var phone3 = request.body.name_phone3;
	var phone = ''+phone1+'-'+phone2+'-'+phone3;
	var phoneEnc = generateHMAC(encKey, name+phone);
	var person = request.body.name_person;
	var price = request.body.name_price;
	var method = request.body.name_method;
	var ip = requestIP.getClientIp(request);
	var uuid = uuidv4();

	if(!checkTime(time) || !checkPhone(phone) || !checkDate(date) || name.length < 2){
		response.redirect('/reserve');
		return;
	}

	addReserveItem(response, branch, theme, date, time, name, phone, phoneEnc, person, price, method, ip, uuid, true);
});

// 예약 완료 후 예약정보 확인
app.get('/complete', function(request, response){
	var uuid = request.query.id;
	client.query('select * from reservation where uuid=?', [uuid], function(error, result, fields){
		if(error){

		}else{
			if(result.length>0){
				response.render('complete.html', {branchStr:result[0].branchStr, date:result[0].dateStr, time:result[0].timeStr, themeStr:result[0].themeName, name:result[0].name, phone:result[0].phone, person:result[0].person, price:result[0].price, method:result[0].method});
			}else{
				response.redirect('/reserve');
			}
		}
	});
});

// 예약 확인 페이지
app.get('/confirm', function(request, response){
	response.render('search.html', {isError:0});
});

app.post('/confirm', function(request, response){
	var name = request.body.name_name;
	var phone1 = request.body.name_phone1;
	var phone2 = request.body.name_phone2;
	var phone3 = request.body.name_phone3;
	var phone = ''+phone1+'-'+phone2+'-'+phone3;
	var phoneEnc = generateHMAC(encKey, name+phone);

	if(!checkPhone(phone) || name.length < 2){
		response.render('search.html', {isError:2});
		return;
	}

	client.query('select * from reservation where phoneEnc=? and dateStr>=?', [phoneEnc, serverData.date], function(error, result, fields){
		if(error){
			console.log(error);
			response.render('search.html', {isError:1});
		}else{
			if(!isServer.isServer()) console.log('search : ',result);
			if(result.length > 0){
				var url = '/cancel?id='+result[0].phoneEnc;
				response.redirect(url);
				// response.writeHead(302, {'Location':url});
				// response.end();
			}else{
				response.render('search.html', {isError:2});
			}
			//response.render('complete.html', {branchStr:branch, date:date, time:time, themeStr:getThemeStr(theme), name:name, phone:phone, person:person, price:price, method:method});
		}
	});
});

// 예약 확인 리스트(취소) 페이지
app.get('/cancel', function(request, response){
	var phoneEnc = request.query.id;
	if(!isServer.isServer()) console.log(phoneEnc);
	client.query('select * from reservation where phoneEnc=? and dateStr>=? order by dateStr desc, timeStr desc', [phoneEnc, serverData.date], function(error, result, fields){
		if(error){
			if(!isServer.isServer()) console.log('cancel Page Error');
			response.redirect('/reserve');
		}else{
			if(result.length>0){
				if(!isServer.isServer()) console.log('cancel Page Success');
				response.render('cancel.html', {isError:0, data:result, title:result[0]});
			}else{
				if(!isServer.isServer()) console.log('cancel No data');
				response.render('search.html', {isError:2});
			}
		}
	});
});

app.get('/delete', function(request, response){
	var uuid = request.query.id;
	if(!isServer.isServer()) console.log('canceling : ',uuid);
	client.query('select * from reservation where uuid=?', [uuid], function(error, result, fields){
		if(error){
			response.render('search.html', {isError:1});
		}else{
			console.log('delete result : ',result.length);
			if(result.length > 0){
				var enc = result[0].phoneEnc;
				client.query('update reservation set cancel = 1 where uuid=?', [uuid], function(error, result, fields){
					if(error){
						response.render('search.html', {isError:1});
					}else{
						var url = '/cancel?id='+enc;
						response.redirect(url);
						// response.writeHead(302, {'Location':url});
						// response.end();
					}
				});
			}else{
				response.render('search.html', {isError:2});
			}
		}
	});
});

app.get('/location', function(request, response){
	response.render('location.html');
});

var server = http.createServer(app);

server.listen(8080, function(){
	if(isServer.isServer()){
		console.log('Server Running at http://insideroom.co.kr');
	}else{
		console.log('Server Running at http://127.0.0.1:8080');
	}
});

var sqlConnectCnt = 0;
setInterval(repeatFunc, 1000);

function repeatFunc(){
	sqlConnectCnt++;
	if(sqlConnectCnt >= 5){sqlConnect(); sqlConnectCnt=0;}
	dateChange();
}

function sqlConnect(){
	client.query('SELECT 1');
}

function adminSQL(){
	client.query('select * from myinside', function(error, result, fields){
		if(error){
			console.log('adminSQL Error!');
		}else{
			adminData = result;
		}
	});
}

function dateChange(){
	serverData.day = util.getDayToday();
	serverData.date = util.getDateYYYYMMDD();
}

console.log(util.getDateYMDHMS());

function generateHMAC(key, clearString){
	var hmac = crypto.createHmac('sha256', key);
	hmac.update(clearString, 'utf8');
	var hdigest = hmac.digest('hex');
	return hdigest;
}

function checkTime(str){
	var filter = /^\d{2}:\d{2}$/;
	return filter.test(str)
}

function checkPhone(str){
	var filter = /^\d{3}-\d{4}-\d{4}$/;
	return filter.test(str)
}

function checkDate(str){
	var filter = /^\d{4}-\d{2}-\d{2}$/;
	return filter.test(str)
}

function getThemeStr(theme){
	for(var i=0; i<myThemeData.length; i++){
		if(theme == myThemeData[i].index){
			return myThemeData[i].name;
		}
	}
	return "";
}

function addReserveItem(response, branch, theme, date, time, name, phone, phoneEnc, person, price, method, ip, uuid, isClient){
	client.query('select * from reservation where dateStr=? and timeStr=? and theme=? and cancel=0', [date, time, theme], function(error, result, fields){
		if(error){

		}else{
			if(result.length > 0){
				if(isClient) {response.redirect('/reserve');}
				else {response.json({state:2});}
				return;
			}else{
				client.query('INSERT INTO reservation (branch, branchStr, dateStr, timeStr, theme, themeName, name, phone, phoneEnc, person, price, method, ipStr, resTime, uuid) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[0, branch, date, time, theme, getThemeStr(theme), name, phone, phoneEnc, person, price, method, ip, util.getDateYMDHMS(), uuid], function(error, result, fields){
					if(error){
						console.log(error);
						if(isClient) {response.redirect('/reserve');}
						else { response.json({state:3});}
					}else{
						if(!isServer.isServer()) console.log('Reserve Success!');
						if(phone != '010-0000-0000'){
							sendKakaoMessage(getThemeStr(theme), date, time, person, method, phone, name);
						}
						if(isClient){
							var url = '/complete?id='+uuid;
							response.redirect(url);
						}else{
							response.json({state:1});
						}
						// response.writeHead(302, {'Location':url});
						// response.end();
					}
				});
			}
		}
	});
}

function deleteReserveItem(response, uuid, url, isClient){
	client.query('select * from reservation where uuid=?', [uuid], function(error, result, fields){
		if(error){
			if(isClient) { response.redirect('/insideManager'); }
			else {response.json({state:2});}
		}else{
			console.log('delete result : ',result.length);
			if(result.length > 0){
				var enc = result[0].phoneEnc;
				client.query('update reservation set cancel = 1 where uuid=?', [uuid], function(error, result, fields){
					if(error){
						if(isClient) { response.redirect('/insideManager'); }
						else {response.json({state:2});}
					}else{
						if(isClient) { response.redirect(url); }
						else {response.json({state:1});}
					}
				});
			}else{
				if(isClient) { response.redirect('/insideManager'); }
				else {response.json({state:2});}
			}
		}
	});
}

function sendKakaoMessage(themeStr, dateStr, time, person, method, phone, name){
	var corpNum = '1216953572';
	var templateCode = '021110000060';
	var snd = '010-6386-1357';
	var content = '방탈출카페 인사이드\n';
	content += '[예약확인]\n';
	content += '지점 : 일산점 (031-915-2077)\n';
	content += '테마 : '+themeStr+'\n';
	content += '예약 : '+dateStr+'\n';
	content += '시간 : '+time+'\n';
	content += '인원 : '+person+'명\n';
	content += '결제방법 : ';
	if(method==0) content += '현장결제';
	else if(method == 1) content += '무통장결제';
	else if(method == 2) content += '소셜결제';
	
	var altContent = '대체문자';
	var altSendType = 'C';
	var sndDT = '';
	var receiver = phone.replace('-','');
	var receiverName = name;
	var UserID = 'kaosu12';
	var requestNum = '';
	var btns = null;

	kakaoService.sendATS_one(corpNum, templateCode, snd, content, altContent, altSendType, sndDT, receiver, receiverName, UserID, requestNum, btns, 
		function(receiptNum){
			console.log('Kakao OK');
		}, function(error){
			console.log('Error : ['+error.code + '] '+error.message);
		}
	);
}