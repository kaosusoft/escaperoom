var express = require('express');
var requestIP = require('request-ip');
var http = require('http');
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var ejs = require('ejs');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var utf8 = require('utf8');
const {v4: uuidv4} = require('uuid');
const crypto = require('crypto');
var popbill = require('popbill');
var util = require('./util.js');
var iconv = require('iconv-lite');
var isServer = require('./server/server.js');

// ***** mySQL db setting ***** //
var client;

if(isServer.isServer()){
	client = mysql.createConnection({
		host: '211.47.75.102',
		port: 3306,
		user: 'escapeadmin1',
		password: 'escape12345',
		database: 'dbescapeadmin1'
	});
}else{
	client = mysql.createConnection({
		user: 'root',
		password: '0123523u',
		database: 'lible'
	});
}

// ***** local db setting ***** //
var adapter = new FileSync('./data_ignore/shop.json');
var adapteredit = new FileSync('./data_ignore/shopedit.json');
var db = low(adapter);
var dbedit = low(adapteredit);
db.defaults({shop:[]}).write();
dbedit.defaults({shop:[]}).write();

var shopData = {};
var shopEditData = {};

// variable setting
const encKey = 'EscapeRoomKey';

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
});

app.post('/moneydata', async function(request, response){
	var data = JSON.parse(request.body.json);
	var tempOrigin = data.code + data.date; if(data.hour < 10) tempOrigin += '0'; tempOrigin += data.hour;
	var tempShopData = getShopData(data.code)
	if(tempShopData == undefined) {response.send({state:2, memo:""}); return;}

	for(var i=0; i<data.data.length; i++){
		var tempOriginTheme = tempOrigin; if(data.data[i].uid < 10) tempOriginTheme += '0'; tempOriginTheme += data.data[i].uid;
		try{
			await client.query('update money set old=0 where (code=? and date=? and uid=?)', [data.code, data.date, data.data[i].uid], function(e, r, f){
				if(e){
					response.send({state:4, memo:""});
				}else{
					
				}
			});
			await client.query('insert into money (code, shop, name, date, h, today, money, submoney, old, uid, theme, useStr, origin) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) on duplicate key update today=?, money=?, old=1, submoney=?',
			[data.code, tempShopData.index, tempShopData.name, data.date, data.hour, JSON.stringify(data.data[i].today), JSON.stringify(data.data[i].data), '', 1, data.data[i].uid, data.data[i].name, JSON.stringify(data.shopdata), tempOriginTheme, JSON.stringify(data.data[i].today), JSON.stringify(data.data[i].data), ''], function(error, result, fields){
				if(error){
					console.log(error);
					response.send({state:3, memo:""});
				}else{
					
				}
			});
		}catch(error){
			console.log(error);
		}
	}
	response.send({state:1, memo:getMemo(data.code)});
	// console.log(data.data);
	// console.log(data.shopdata);
	
});

app.post('/shoplogin', function(request, response){
	var id = request.body.mb_id;
	var pw = request.body.mb_password;
	console.log(id, pw);
	var encPass = generateHMAC(encKey, pw);
	if(!isServer.isServer()){
		console.log(encPass);
	}
	for(var i=0; i<shopData.shop.length; i++){
		if(shopData.shop[i].id == id){
			if(shopData.shop[i].encPassword == encPass){
				var cookie = generateHMAC(encKey, util.getDateYMDHMS());
				console.log('Login Success');
				response.send({state:1, msg:"success", name:shopData.shop[i].name, code:shopData.shop[i].code});
				return;
			}else{
				console.log('Login Fail');
				response.send({state:2, msg:'fail', name:"", code:""});
				return;
			}
		}
	}
	response.send({state:0, msg:'error', name:"", code:""});
	return;
});

// ******************************************* 홈페이지 ************************************************** //

app.get('/', function(request, response){
	response.send('방탈출카페 매장 정보');
});

app.get('/money', function(request, response){
	var param = request.query.id;
	var shopCode = '';
	if(param == undefined) shopCode = '6s2d2w1r2z2';
	else shopCode = param;
	var todayStr = util.getDateYYYYMMDD();
	client.query('select * from money where (code=? and date=? and old=1)', [shopCode, todayStr], function(error, result, fields){
		if(error){

		}else{
			var data = [];
			if(result.length > 0){
				for(var i=0; i<result.length; i++){
					var obj = {};
					obj._id = result[i]._id;
					obj.code = result[i].code;
					obj.shop = result[i].shop;
					obj.name = result[i].name;
					obj.date = result[i].date;
					obj.h = result[i].h;
					obj.today = JSON.parse(result[i].today);
					obj.money = JSON.parse(result[i].money);
					obj.uid = result[i].uid;
					obj.theme = result[i].theme;
					obj.useStr = JSON.parse(result[i].useStr);
					data.push(obj);
				}
				response.render('money.html', {data: data});
			}else{
				response.send('데이터가 없습니다.');
			}
		}
	});
});

var server = http.createServer(app);

server.listen(8080, function(){
	if(isServer.isServer()){
		console.log('Server Running at http://escaperoom.kr');
	}else{
		console.log('Server Running at http://127.0.0.1:8080');
	}
});

var sqlConnectCnt = 0;
setInterval(repeatFunc, 1000);

function repeatFunc(){
	sqlConnectCnt++;
	if(sqlConnectCnt >= 5){sqlConnect(); sqlConnectCnt=0;}
}

function sqlConnect(){
	client.query('SELECT 1');
}

function initServer(){
	shopData = db.value();
	shopEditData = dbedit.value();
	var encTest = "zero9242test";
	var encPass = generateHMAC(encKey, encTest);
	if(!isServer.isServer()){
		console.log(encPass);
	}
}

function getShopData(code){
	for(var i=0; i<shopData.shop.length; i++){
		if(shopData.shop[i].code == code){
			return shopData.shop[i];
		}
	}
	return undefined;
}

function getMemo(code){
	for(var i=0; i<shopEditData.shop.length; i++){
		if(shopEditData.shop[i].code == code){
			return shopEditData.shop[i].memo;
		}
	}
	return "";
}

function saveShopData(){
	dbedit.set('shop', shopEditData.shop).write();
}

console.log(util.getDateYMDHMS());
console.log(util.getDateYYYYMMDD());
initServer();

function generateHMAC(key, clearString){
	var hmac = crypto.createHmac('sha256', key);
	hmac.update(clearString, 'utf8');
	var hdigest = hmac.digest('hex');
	return hdigest;
}

// git stash
// git pull ~~
// git stash pop
// git rm 'data_ignore/shop.json'
// pm2 start web.js --watch --ignore-watch="data_ignore/* .git/*" --no-daemon