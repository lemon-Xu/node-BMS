const fs = require("fs")
const fileServer = require("../fileServer");
const mysql = require("../MySQL.js");
const cookie = require("cookie")
function server(method, para, response){

	if(method == "GET") {
		GET(method, para, response);
	} else if(method == "POST"){
		POST(method, para, response);
	}
}

function GET(method, para, response){
	fileServer.publicFileServer('/login.html', response);
}

function POST(method, para, response){
	console.log("用户登陆");
	let user = para["user"];
	let password = para["password"];
	let types = para["types"]
	
	if(types == 'login'){
		let p = [user, password];
		let sql = "SELECT users_id FROM users WHERE users_name = ? and users_password = MD5(?)";
		mysql.query(sql, p, function(error, results, fields){
			console.log(results.length)
			if(results.length != 0){
				console.log("用户",user,"登入");
				let  usersName= cookie.serialize('usersName', user);
				let usersID = cookie.serialize('usersID', results[0]['users_id']);

				response.writeHead(200,{'Content-Type': 'application/json', 'Set-Cookie':[usersName,usersID]});
				console.log(response.headers)
				response.end('true')
			} else {
				console.log('登陆失败',user)
				response.writeHead(200,{'Content-Type':'application/json'});
				response.end('false')
			}
		});

	} else if(types == 'register'){
		console.log('用户', user, '注册')
		let sql = "SELECT users_id FROM users WHERE users_name = ?;";
		let para = [user];
		mysql.query(sql, para, function(error, results, fields) {
			if(results.length == 0) { // 可以注册
				console.log('可以注册')
				let sql = "INSERT INTO users(users_name, users_password, users_status) VALUES (?, MD5(?), 2);"
				let para = [user, password];
				mysql.query(sql, para, function(err, results, fields){
					console.log(results)
					response.writeHead(200, {'Content-Type': 'application'})
					response.end('true')
				})
			} else {
				console.log('不可以注册')
				response.writeHead(200, {'Content-Type':'application/json'});
				response.end('false')
			}
		});
	}
	
}

exports.server = server