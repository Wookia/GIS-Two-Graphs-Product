'use strict';

const electron = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// SET ENV
process.env.NODE_ENV = 'production';

const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;

let mainWindow;

// Listen for app to be ready
app.on('ready', function(){
  // Create new window
  mainWindow = new BrowserWindow({});
  // Load html in window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Quit app when closed
  mainWindow.on('closed', function(){
    app.quit();
  });
  
  mainWindow.on('did-finish-load', () => {
    mainWindow.webContents.send('ready');
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);

});


// Create menu template
const mainMenuTemplate =  [];

// If OSX, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}
  mainMenuTemplate.push({
    label: 'Files',
    submenu:[
      {
        label: 'Graph one',
        submenu: [{
          label: 'Import',
          click(item, focusedWindow){
            showFileSelector('ONE');
          }},{
            label: 'Export',
            click(item, focusedWindow){
              showFileSaver('ONE');
          }}],
      },
      {
        label: 'Graph two',
        submenu: [{
          label: 'Import',
          click(item, focusedWindow){
            showFileSelector('TWO');
          }},{
            label: 'Export',
            click(item, focusedWindow){
              showFileSaver('TWO');
          }}],
      },
      {
        label: 'Summary graph',
        submenu: [{
            label: 'Export',
            click(item, focusedWindow){
              showFileSaver('RESULT');
          }}],
      }
    ]
  });
// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}


function showFileSelector(type) {
  let options = {
      title: "Select File",
      properties: ['openFile'],
  };
  dialog.showOpenDialog(mainWindow, options, (filenames)=>{
    if (filenames && filenames.length > 0) {
      let options = {
        type: type
      };
      fs.readFile(filenames[0], 'utf-8', (err, data) => {
        options.data = data;
        mainWindow.webContents.send('import-data', options);
      });
    }
  });
}

function showFileSaver(type) {
  dialog.showSaveDialog((fileName) => {
    if (fileName === undefined) return;
    else{
      mainWindow.webContents.send('export-data', {
        fileName: fileName,
        type: type
      });
    }
  });
}

ipcMain.on('save-data', (event, arg) => {
  fs.writeFile(arg.fileName, arg.data, 'utf8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
});


