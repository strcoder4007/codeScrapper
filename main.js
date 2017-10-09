const electron = require('electron');
const url = require('url');
const path = require('path');
const {net} = require('electron')

const { app, BrowserWindow, ipcMain } = electron;

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


ipcMain.on('getData', (event, arg, selected) => {
    if(selected == "codeforces") {
        let username = arg;
        const request = net.request('http://codeforces.com/api/user.status?handle='+username)
        request.on('response', (response) => {
            var myData = '';
        response.on('data', (chunk) => {
            myData += chunk;
        })
        response.on('end', () => {
            var parsed = JSON.parse(myData).result;
            for(let i = 0; i < parsed.length; i++) {
                if(parsed[i].verdict == "OK")
                    console.log("Accepted " + parsed[i].contestId);
                //download the files
            }
        })
        })
        request.end()
    }
    else if(selected == "none"){
        alert("none");
    }

});