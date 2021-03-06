var express = require("express");
var bodyParser = require('body-parser');
var apiai = require('apiai');
var apiApp = apiai('d77d60abb4b84890aa418baeaa493af3');


const Botly = require("botly");
const botly = new Botly({
    accessToken: "EAAK2hAmkY0UBAE5AqtACForYmdHqDlMHOasbasZBLBScQ7ZAZBw7RDfDVgpB0GGnhQwW0VAwmrFoBrnZCaypEZCRKDNKnwNkM92Obey42xIZBwGb4DiUODf16SwkihYdbVrK0GBZCDhUKTVYh7NrGkXtoE6PRwpnEqipQMZAtq1wZBwZDZD", //page access token provided by facebook 
    verifyToken: "sims", //needed when using express - the verification token you provided when defining the webhook in facebook 
    webHookPath: "/", //defaults to "/", 
    notificationType: Botly.CONST.REGULAR //already the default (optional), 
});



botly.on("message", (senderId, message, data) => {
	console.log(data.text);
    var request = apiApp.textRequest(data.text, {
    sessionId: '71' 
	});
	
    request.on('response', function(response) {
	console.log(response);	

		botly.sendText({
			id: senderId,
			text: response.result.fulfillment.speech
			});
	});
	
	request.on('error', function(error) {
		console.log(error);
	});
	 
	request.end();
	
});



const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use("/webhook", botly.router());
app.set('port', (process.env.PORT || 5000))

app.get("/",function(req,res){
	res.sendFile(__dirname+"/input.html");
});

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));

})
