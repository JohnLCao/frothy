var express   = require('express');
var config  = require('./config');
var http      = require('http');
var util      = require('util');
var path = require('path');
var Excel = require('exceljs');
var async = require('async');
var colors  = require('colors');
console.log(('Server time: ').yellow, (new Date()).toString());
require('log-timestamp')(function() { return '[' + new Date() + '] %s' });

let app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/public'));

var objFlow = require("./JsonData/Flow.json");
var objAssay = require("./JsonData/Assay.json");
var objPump = require("./JsonData/Pump.json");

app.get('/getAssayJSON', function(req,res){
	console.log("Sending the JSON data!");
	res.send(objAssay);
});

app.get('/getFlowJSON', function(req,res){
	console.log("Sending the JSON data!");
	res.send(objFlow);
});

app.get('/getPumpJSON', function(req,res){
	console.log("Sending the JSON data!");
	res.send(objPump);
});	


app.get('*', function(req, res) {
	console.log("Sending the index.html");
    res.status(200).sendFile(path.resolve('public/index.html'));
});

let port = process.env.VCAP_APP_PORT || config.get('port');

console.log("Listening port: " + port);
let server = http.createServer(app).listen(port, function() {
    console.log('Express server listening on port ' + port);
});