
var path = require("path");
var WebSocketServer = require('ws').Server;
var JsBase = require("./libs/JsBase/jsbase.js");
var Player = require("./libs/CircleGameLib/Player.js");

require('./libs/CircleGameLib/global');

//Require Cmds
var Cmder = require("./libs/CircleGameLib/CommandDispatch");

//Find every files in ./src/Cmds
var cmdFilesPath = "./src/Cmds";
var fs = require('fs');
var cmdFiles = fs.readdirSync(cmdFilesPath); 

//Find out every .js files //TODO:Find a better solution
for (var key in cmdFiles) {
	var cmdPath = "./" + path.join(cmdFilesPath, cmdFiles[key]);
	var pathParse = path.parse(cmdPath);

	if (pathParse.ext === ".js") {
		var cmdName = pathParse.name;
		require(cmdPath);
	}
}

//Establish WebSocketServer
var wss = new WebSocketServer({
	port: 1000, //监听接口  
	verifyClient: socketVerify //可选，验证连接函数  
});

//Verify method, figure out where to put in
function socketVerify(info) {
	return true;
	//传入的info参数会包括这个连接的很多信息，你可以在此处使用console.log(info)来查看和选择如何验证连接  
}

//BroadCast
wss.broadcast = function broadcast(param) {
	var jsonParam = JSON.stringify(param);
	wss.clients.forEach(function each(client) {
		client.send(jsonParam);
	});
};

// 初始化  
wss.on('connection', function (ws) {
	// 发送消息  
	ws.on('message', function (jsonStr) {
		function SendMsg(param) {
			var jsonParam = JSON.stringify(param);
			ws.send(jsonParam);
		}
		//Bind MsgSender For this client
		global.EvEmitter.On("Msger_SendMsg", SendMsg);
		var param = JSON.parse(jsonStr);
		Cmder.DispatchCmd(param);
		global.EvEmitter.Off("Msger_SendMsg", SendMsg);

	});
	// 退出聊天  
	ws.on('close', function (close) {
		try {
			wss.broadcast(0, this.user.name);
		} catch (e) {
			console.log('刷新页面了');
		}
	});
});  