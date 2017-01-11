const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

var app = express();

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");


// middleware runs in order
// as maintenance runs before home or about, it prevents them from being called
// express.static /public needs to be moved after these calls, or it will still be accessible
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;

	console.log(log);
	fs.appendFile("server.log", log + "\r\n", (err) => {
		if (err){
			console.log("Unable to append to server log");
		}
	});
	next();
});

// app.use((req, res, next) => {
// 	res.render("maintenance.hbs");
// });

app.use(express.static(__dirname + "/public"));

hbs.registerHelper("getCurrentYear", function(){
	return new Date().getFullYear();
});

hbs.registerHelper("screamIT", function(text) {
	return text.toUpperCase();
});

app.get("/", (req, res) => {
	//res.send("<h1>Hello Express</h1>");

	// res.send({
	// 	name: "Grayden",
	// 	likes: [
	// 		"chocolate",
	// 		"beer",
	// 		"science fiction"
	// 	]
	// });

	res.render("home.hbs", {
		pageTitle: "Home Page",
		welcomeMessage: "Welcome to my homepage"
	});

});

app.get("/about", function (req, res) {
	res.render("about.hbs", {
		pageTitle: "About Page"
	});
})

app.get("/projects", function (req, res) {
	res.render("projects.hbs", {
		pageTitle: "Project Page"
	});
})

app.get("/bad", function(req, res) {
	//res.status(400).send();
	res.send({
		errorMessage: "Bad Request"
	});
})

app.listen(3000, function(){
	console.log("server started on Port 3000..");
})