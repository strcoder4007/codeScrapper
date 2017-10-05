const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow } = electron;

let mainWindow;

//Listen for the app to be ready
app.on('ready', function(){
    //create new window
    mainWindow = new BrowserWindow({backgroundColor: '#222', frame: false, titleBarStyle: 'hidden', maxWidth: 800, maxHeight: 450, width: 800, height: 450, minWidth: 800, minHeight: 450});
    //load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.center();
});