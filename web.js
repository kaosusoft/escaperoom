var express = require('express');
var requestIP = require('request-ip');
var http = require('http');
// var low = require('lowdb');
// var FileSync = require('lowdb/adapters/FileSync');
var ejs = require('ejs');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const crypto = require('crypto');
var popbill = require('popbill');
var util = require('./util.js');
var shop = require('./shop.js');
var isServer = require('./server.js');

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

// ******************************************* 홈페이지 ************************************************** //

app.get('/', function(request, response){
	response.render('main.html');
});

app.post('/moneydata', function(request, response){
	var data = JSON.parse(request.body.json);
	console.log(data.shop + "// date : " + data.date + " // hour : "+data.h + " // data : "+data.data.length);
	response.send({state:1});
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

console.log(util.getDateYMDHMS());