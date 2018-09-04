const request = require('request');

const options = {
	url: 'http://wtfismyip.com/json',
	headers: {
		'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/68.0.3440.106 Chrome/68.0.3440.106 Safari/537.36'
	}
};

const get = function(callback) {
	
	request(options, function (error, response, body) {
		if(error){
			return callback(error, response, body);
		}
		body = JSON.parse(body);

		for(key of Object.keys(body)){
			body[key.replace('YourFucking', '')] = body[key];
		}

		callback(null, body);
	});
};

module.exports = {get};
