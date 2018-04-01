var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({
	port: 1000, //监听接口  
	verifyClient: socketVerify //可选，验证连接函数  
});

function socketVerify(info) {
	return true;
	//传入的info参数会包括这个连接的很多信息，你可以在此处使用console.log(info)来查看和选择如何验证连接  
}
//广播  
wss.broadcast = function broadcast(param) {
	var jsonParam = JSON.stringify(param);
	wss.clients.forEach(function each(client) {
		client.send(jsonParam);
	});
};
// 初始化  
wss.on('connection', function (ws) {
	console.log(wss.clients);
	// 发送消息  
	ws.on('message', function (jsonStr) {
		console.log(JSON.parse(jsonStr));
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