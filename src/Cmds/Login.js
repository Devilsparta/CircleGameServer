(function () {
	var namespace = "Login";
	if (typeof window !== "undefined") {
		window[namespace] = _namespace;
	}

	if(typeof module !== "undefined"){
		Cmd = require("../../libs/CircleGameLib/Base_Cmd");
		Cmder = require("../../libs/CircleGameLib/CommandDispatch");
	}

	function _namespace() {
		Cmd.call(this, namespace);
	}
	_namespace.prototype = new Cmd();

	_namespace.prototype.Check = function(param){
		return true;
	}

	_namespace.prototype.Do = function(param){
		Cmder.SendCmd("LoginFinished", {Player: {a:100}});
		return true;
	}
	new _namespace();
})()