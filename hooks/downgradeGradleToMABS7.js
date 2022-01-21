var fs = require('fs');
var path = require('path');

var constants = {
    path:"platforms/android/cdv-gradle-config.json"
}

module.exports = function (context) {
    
    console.log("Start changing Gradle config!");
    var Q = require("q");
    var deferral = new Q.defer();

    if(fs.existsSync(constants.path)){

        var preferencesContent = fs.readFileSync("package.json", {encoding:'utf8'});
        var preferencesJson = JSON.parse(preferencesContent);
        var preferences = preferencesJson.cordova.plugins["com.msk.connexientplugin"]

        if(preferences.ISDEBUG == "True"){

            var content = fs.readFileSync(constants.path, {encoding:'utf8'});
            var jsonContent = JSON.parse(content);

            jsonContent.GRADLE_VERSION = "6.5";
            jsonContent.AGP_VERSION = "4.0.1";
            jsonContent.KOTLIN_VERSION = "1.3.50";  
            jsonContent.GRADLE_PLUGIN_GOOGLE_SERVICES_VERSION = "4.2.0";
            jsonContent.BUILD_TOOLS_VERSION = "31.0.0";
            jsonContent.SDK_VERSION = 30;

            let out = require('child_process').spawnSync("cp", ["-R","/opt/android-sdk/build-tools/31.0.0/d8","/opt/android-sdk/build-tools/31.0.0/dx"]);
            console.log(out.stdout.toString());
            let out2 = require('child_process').spawnSync("cp", ["-R","/opt/android-sdk/build-tools/31.0.0/d8.jar","/opt/android-sdk/build-tools/31.0.0/dx.jar"]);
            console.log(out2.stdout.toString());

            content = JSON.stringify(jsonContent);

            fs.writeFileSync(constants.path, content);
            
            console.log("Finished changing Gradle config!");
        }else{
            console.log("Preference set to not change Gradle config!")
        }

    }else{
        console.warn("Gradle config file not found!")
    }
    deferral.resolve();

    return deferral.promise;
}
