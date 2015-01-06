//server/routes.js

var express = require("express");
var app = express();
var router = express.Router();
var path = require("path");
var _ = require('underscore');

var fullcardmodel = require("./models/server_fullcard_model.js");
var frontcardmodel = require("./models/server_frontCard_model.js");
var backcardmodel = require("./models/server_backCard_model.js");


module.exports = function(app) {



    router.route('/api/text')
        .get(function(req, res, next) {
            frontcardmodel.find(function(err, results) {
                if (err)
                    res.send(err);

                res.json(results);
            });
        })

    .post(function(req, res, next) {

        var frontcard = new frontcardmodel();
        frontcard.frontcardtext = req.body.frontcardtext;
        console.log('the front card text is ' + req.body.frontcardtext);

        frontcard.save(function(err, result) {
            if (err)
                res.send(err);

            res.json(result);
            console.log('front card text saved ' + result);
        });

    })
        .delete(function(req, res, next) {
            frontcardmodel.remove(function(err, results) {
                if (err)
                    res.send(err);

                res.send(results);
            })
        })



    router.route('/api/file')
        .post(function(req, res, next) {
            console.log('im hitting' + req.body, req.files);
            var data = _.pick(req.body, 'type'),
                uploadPath = path.normalize('/uploads'),
                file = req.files.file;

            //        console.log(file.name); //original name (ie: sunset.png)
            //        console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
            console.log(uploadPath + data); //uploads directory: (ie: /home/user/data/uploads)
        });

    router.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../public/views/index.html'));
    });

    app.use('/', router);
};