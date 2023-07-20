const express = require('express');
const cors =require('cors');
require('./db/config');
const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const session = require('express-session')
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
var cron = require('node-cron');
const Nexmo = require('nexmo');
const { eventNames } = require('./db/Event');
const nexmo = new Nexmo({
  apiKey: '849b6cc3',
  apiSecret: 'G4rOTp5bDD5PLoqA'
});
cron.schedule('0 0 * * *',async () => {
	console.log("working")
	var todayDate = new Date().toISOString().slice(0, 10);
	console.log(todayDate)
	let events = await Event.find({date: String(todayDate)})
	console.log(events);
	events.forEach((event)=>{
		nexmo.message.sendSms(
			'Vonage APIs', event.phone, event.message+ "   \n by " + "myName",
			(err, responseData) => {
				if (err) {
				console.log(err);
				} else {
				console.dir(responseData);
				}
			}
		);
	});
});
app.use("/auth", authRoutes);
app.use("/events", auth.verifyToken, eventRoutes);
app.listen(5000);