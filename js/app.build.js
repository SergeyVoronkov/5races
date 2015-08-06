({
    appDir: "../",
    baseUrl: "js/",
    dir: "../../requirejsbackbone-build/",
    //Comment out the optimize line if you want
    //the code minified by UglifyJS
    //optimize: "none",

    paths: {
        "jquery": "require-jquery",
		"underscore": "libs/underscore", 
		"backbone": "libs/backbone"
    },

    modules: [
        //Optimize the require-jquery.js file by applying any minification
        //that is desired via the optimize: setting above.
        {
            name: "require-jquery"
        },

        //Optimize the application files. Exclude jQuery since it is
        //included already in require-jquery.js
        {
            name: "main",
            exclude: ["jquery"]
        }
    ]
})