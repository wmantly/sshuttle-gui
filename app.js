var electron = require('electron'); // http://electron.atom.io/docs/api
const {BrowserWindow, Tray, Menu} = electron;
const path = require('path');         // https://nodejs.org/api/path.html
const url = require('url');           // https://nodejs.org/api/url.html
const pubsub = require('electron-pubsub');

const ip = require('./lib/wtfismyip');
var sshuttle = require('./lib/process_sshuttle')();

var window;
var tray;
sshuttle.start()


// Wait until the app is ready
electron.app.once('ready', function () {
  // Create a new window

  /*window = new electron.BrowserWindow({
    // Set the initial width to 500px
    width: 1000,
    // Set the initial height to 400px
    height: 500,
    // skipTaskbar: true,
    // Show the minimize/maximize buttons inset in the window on macOS
    // titleBarStyle: 'hidden-inset',
    // Set the default background color of the window to match the CSS
    // background color of the page, this prevents any white flickering
    // backgroundColor: "#111",
    // Don't show the window until it ready, this prevents any white flickering
    // show: false
    icon: __dirname + '/static/img/fav.png'
  });
*/
  tray = new Tray(__dirname + '/static/img/vpn_red.png')
  tray.images = {
    green: __dirname +'/static/img/vpn_green.png',
    red: __dirname +'/static/img/vpn_red.png',
    blue: __dirname +'/static/img/vpn_blue.png',
    yellow: __dirname +'/static/img/vpn_yellow.png',
    orange: __dirname +'/static/img/vpn_orange.png'
  }

  let tooltiplock = false;
  const updateToolTip = function(color, message){
    if(tooltiplock) return ;
    tooltiplock = true;
    
    ip.get(function(error, body){
      tooltiplock = false;
      
      if(error || !body ){
        tray.setToolTip('IP ERROR!');
        tray.setImage(tray.images.red);
        return ;
      }
      let tor = body.TorExit === 'false' ? '' : `\nTor node: ${body.TorExit}`
      tray.setToolTip(`IP: ${body.IPAddress}\nISP: ${body.ISP}\nLocation: ${body.Location}, ${body.CountryCode}${tor}`  );
    });
    
  }

  setInterval(updateToolTip, 10000);

  pubsub.subscribe('sshuttle', function(data){
    // setTimeout(updateToolTip, 10);
  });

  pubsub.subscribe('sshuttle.connected', function(data){
    tray.setImage(tray.images.green);
    setTimeout(updateToolTip, 10);
  });

  pubsub.subscribe('sshuttle.exit', function(data){
    tray.setImage(tray.images.red);
    setTimeout(updateToolTip, 10);
    setTimeout(pubsub.publish, 20, 'sshuttle.reconnect');
  });

  pubsub.subscribe('sshuttle.reconnect', function(data){
    tray.setImage(tray.images.orange);
    tray.setToolTip('Connecting!')
    setTimeout(sshuttle.start, 100);
  })


  // window.tray = tray;

  // // tray.on('click', () => {
  // //   window.isVisible() ? window.hide() : window.show()
  // // })
  // window.on('show', () => {
  //   tray.setHighlightMode('always')
  // })
  // window.on('hide', () => {
  //   tray.setHighlightMode('never')
  // })
  // // Load a URL in the window to the local index.html path
  // window.loadURL(url.format({
  //   pathname: path.join(__dirname, 'index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));

  // // Show window when page is ready
  // window.once('ready-to-show', function () {
  //   window.show();
  // });
});
