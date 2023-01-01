var express = require('express');
var requestIP = require('request-ip');
var http = require('http');
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var ejs = require('ejs');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const crypto = require('crypto');
var popbill = require('popbill');
var util = require('./util.js');
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
var adapter = new FileSync('shop.json');
var db = low(adapter);
db.defaults({shop:[]}).write();

var shopData = {};

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

app.post('/moneydata', function(request, response){
	var data = JSON.parse(request.body.json);
	console.log(data.shop + "// date : " + data.date + " // hour : "+data.h + " // data : "+data.data.length);
	response.send({state:1});
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
				shopData.shop[i].cookie = cookie;
				saveShopData();
				console.log('Login Success');
				response.send({state:1, msg:"success", name:shopData.shop[i].name, code:shopData.shop[i].code, cookie:cookie});
				return;
			}else{
				console.log('Login Fail');
				response.send({state:2, msg:'fail', name:"", code:"", cookie:""});
				return;
			}
		}
	}
	response.send({state:0, msg:'error', name:"", code:"", cookie:""});
	return;
});

// ******************************************* 홈페이지 ************************************************** //

app.get('/', function(request, response){
	response.send('방탈출카페 매장 정보');
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
}

function sqlConnect(){
	client.query('SELECT 1');
}

function initServer(){
	shopData = db.value();
	var encTest = "asdf";
	var encPass = generateHMAC(encKey, encTest);
	if(!isServer.isServer()){
		console.log(encPass);
	}
}

function saveShopData(){
	db.set('shop', shopData.shop).write();
}

console.log(util.getDateYMDHMS());
initServer();

function generateHMAC(key, clearString){
	var hmac = crypto.createHmac('sha256', key);
	hmac.update(clearString, 'utf8');
	var hdigest = hmac.digest('hex');
	return hdigest;
}