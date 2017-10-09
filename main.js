const electron = require('electron');
const url = require('url');
const path = require('path');
const {net} = require('electron')

const fs = require('fs');
const download = require('download');

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
            for(let i = 0; i < parsed.length; i++) {//parsed.length
                if(parsed[i].verdict == "OK") {
                    let fileUrl = "http://codeforces.com/contest/"+parsed[i].contestId+"/submission/"+parsed[i].id;
                    download(fileUrl).then(data => {
                        let data = data.toString('utf8');
                        let startIdx = data.search('style="padding: 0.5em;">')+24;
                        data = data.substr(startIdx, data.length);
                        let endIdx = data.search('</pre>');
                        data = data.substr(0, endIdx);

                        fs.writeFileSync('junk/'+parsed[i].contestId+parsed[i].problem.index+'.cpp', data);
                    });
                }
            }
        })
        })
        request.end()
    }
    else if(selected == "none"){
        console.log("choose a website");
    }

});