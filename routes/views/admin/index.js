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
	locals.section = 'admin';

	//var login_ctrl = require('./login.js');
	//var c = new login_ctrl(req, res, view);

	// Render the view
	view.render('admin/index');
};
