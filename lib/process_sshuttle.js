const fs = require('fs');
const {spawn, execSync} = require('child_process');
const pubsub = require('electron-pubsub');


if (!fs.existsSync('/etc/sudoers.d/sshuttle_gui_auto')) {
	console.log('Adding to sudoers file')
    let myProcess = execSync('sshuttle --sudoers --sudoers-filename "sshuttle_gui_auto"', {
		env: {
			PATH: __dirname+'/python/bin:'+process.env.PATH,
			PYTHONPATH: __dirname+'/python/lib/python3.6/site-packages'
		}
	});

	console.log('sudoers output:', myProcess);
}

var events = function(manager){
	
	manager.process.stdout.on('data', function(data){
		console.log('sshuttle out:', data.toString());
	});

	manager.process.stderr.on('data', function(data){
	 	console.error('sshuttle error:', data.toString());
	 	if(data.toString().match("client: Connected")){
	 		console.info('sshuttle connected!!!');
	 		pubsub.publish('sshuttle.connected')
	 	}
	});

	manager.process.on('exit', function(code){
		// console.error('sshuttle exit:', code.toString());
		pubsub.publish('sshuttle.exit')
	});
};

var manager = function(options){
	options = options || {};
	let user = options.user || 'william';
	let host = options.host || 'ron.theta42.com';

	this.process = null;
	this.events = null

	this.start = function(){
		console.info('starting sshuttle');
		if(!this.process){
			console.info('starting sshuttle...');

			this.process = spawn('sshuttle', ['--dns', '-r', `${user}@${host}`, '0/0', '-x', '67.250.219.169'],{
				env: {
					PATH: __dirname+'/python/bin:'+process.env.PATH,
					PYTHONPATH: __dirname+'/python/lib/python3.6/site-packages'
				}
			});
			this.events = events(this);
			pubsub.publish('sshuttle.starting', options);
		}
	};

	this.stop = function(){
		if(this.process){
			this.process.kill();
			this.process = null;
			this.events = null;
		}
	};

	return this;
};

module.exports = manager;
