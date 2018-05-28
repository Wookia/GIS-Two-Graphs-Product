"use strict";

var Jasmine = require('jasmine');
var jasmine = new Jasmine();
jasmine.loadConfigFile();

if (!process.env.VSCODE_PID) {
    var reporters = require('jasmine-reporters');
    jasmine.addReporter(new reporters.TeamCityReporter());
}

jasmine.onComplete(function(){
    console.log("Jasmine Complete - Callback");  
    process.exit();  // Do this otherwise we may hang running tests
});

jasmine.execute();