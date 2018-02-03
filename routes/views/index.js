var keystone = require('keystone');

exports = module.exports = function (req, res)
{
	var view = new keystone.View(req, res);
	var locals = res.locals;

	var msg = req.query.msg;
	if(msg)
	{
		console.log(msg);
	}else{
		console.log('msg is not defined');
	}

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	var contact_ctrl = require('./contact.js');
	var c = new contact_ctrl(req, res, view);
	/*if(locals.success_message)
	{
		console.log(">>"+locals.success_message);
	}else console.log('success_message is not defined.');*/

	// Render the view
	view.render('index');
};
