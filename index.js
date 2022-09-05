const express = require('express');
const cors =require('cors');
require('./db/config');
const Event = require('./db/Event')
const app = express();
app.use(express.json());
app.use(cors());
var CronJob = require('cron').CronJob;
app.post('/add-event', async (req,res)=>{
    console.log(req.body)
    let event = new Event(req.body);
    let result = await event.save();
    res.send(result);
})
var job = new CronJob(
	'0 0 0 * * *',
	function() {
		console.log('You will see this message every second');
	},
	null,
	true,
	'America/Los_Angeles'
);
job.start()

app.listen(5000);