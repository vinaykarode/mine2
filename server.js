// server.js
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongoose = require("mongoose");
var app = express();
var app2 = express();
//var multipart = require('connect-multiparty');
var busboy = require('connect-busboy');
var uuid = require('node-uuid');

//var multer = require('multer'); //another multipart-form data middleware built on busboy

var fs = require('fs-extra');
var cors = require('cors');


//var fullcardmodel = require("./server/models/server_fullcard_model.js");
//var frontcardmodel = require("./server/models/server_frontCard_model.js");
//var backcardmodel = require("./server/models/server_backCard_model.js");

var db = require("./server/db");
mongoose.connect(db.url);

app.use(cors());
app.use(busboy());
//
//app.use(multipart({
//    uploadDir: '/audio'
//}));

//var multipartMiddleware = multipart();
//app.post('/upload', multipartMiddleware, function(req, resp) {
//  console.log(req.body, req.files, req.files.name, req.files.file.name);
//  // don't forget to delete all req.files when done
//});

//var port = process.env.PORT || process.env.IP;

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.text({
    type: 'text/html'
})) //parse html
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); //parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({
    extended: false
})); //parse application/x-www-form-urlencoded

//set static route
app.use(express.static(__dirname + '/public'));


//=========== routes ========//
require('./server/routes')(app); //configure our routes
//============






app.route('/upload/audio')
    .post(function(req, res, next) {
        var audnum = uuid.v4();
        var fstream;
        console.log(req.busboy);
        req.pipe(req.busboy);
        req.busboy.on('file', function(fieldname, file, filename) {
//            console.log("Uploading audio: " + filename);
//            console.log(audnum + Date.now() + filename);
            filename ='aud'+ audnum+ Date.now()+ filename.replace(/\s+/g, '');
            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/public/audio/' + filename);
            file.pipe(fstream);
            fstream.on('close', function() {
                console.log("Upload Finished of audio" + filename);
                //                res.redirect('back'); //where to go next
                res.json( filename);
            });
        });
    });


//app2.use(multer({
//    includeEmptyFields: true
//}));


app.route('/upload/image')
    .post(function(req, res, next) {
        var imgnum = uuid.v4();
        //
        //        app.use(multer({
        //            dest: './public/image/',
        //            rename: function(fieldname, filename) {
        //                return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
        //            }
        //        }));

        //        var form = {
        //            body: req.body,
        //            files: req.files
        //        };
        //        onFileUploadStart: function(file) {
        //            console.log(file.fieldname + ' is starting ...')
        //        };
        //        onFileUploadData: function(file, data) {
        //            console.log(data.length + ' of ' + file.fieldname + ' arrived')
        //        }
        //        onFileUploadComplete: function(file) {
        //            console.log(file.fieldname + ' uploaded to  ' + file.path)
        //        }

        var fstream;
        console.log(req.busboy);
        req.pipe(req.busboy);
        req.busboy.on('file', function(fieldname, file, filename) {
            console.log("Uploading image: " + filename + file + fieldname);
            filename = 'img' + imgnum + Date.now() + '.png';
            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/public/image/' + filename);
            file.pipe(fstream);
            fstream.on('close', function() {
                console.log("Upload Finished of image " + filename);
                //                res.redirect('back'); //where to go next
                res.json(filename);
            });
        });
    });






app.listen(3000, function() {
    console.log("I'm Listening Baby" + 3000);
});

exports = module.exports = app;