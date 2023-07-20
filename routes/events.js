const express = require("express");
const auth = require("../middleware/auth");
const Event = require('../db/Event')
const User = require('../db/User');
const session = require('express-session')
const router = express.Router();
router.get('/', async (req,res)=>{
	const user = await User.findById(req.session.user_id).populate('events');
	res.send(user.events)
})
router.post('/add-event', async (req,res)=>{
	let event = new Event(req.body);
	User.findById(req.session.user_id, function(err, user){
		user.events.push(event);
		user.save();
	 });
	const user = await User.findById(req.session.user_id);
	res.send(user.events)
})
router.delete('/delete/:id', async (req,res)=>{
	User.update({ _id: req.session.user_id },
	    { "$pull": { "events": { "_id": req.params.id } }},
		{ safe: true }, function(err, obj) {
		if(err) res.send(res)
	});	
	const user = await User.findById(req.session.user_id);
	res.send(user.events)
})
router.put('/:id', async (req,res)=>{
	const event = req.body;
	delete event['_id']
	console.log(req.params.id)
	Event.findByIdAndUpdate(req.params.id,{name: "1"}, function(err, result){
        if(err){
            res.send(err)
        }
        else{
            res.send(result)
        }

    })
	res.redirect("/events");
})
module.exports = router;