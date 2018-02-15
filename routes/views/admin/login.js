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

	// Render the view
	view.render('admin/login');
};
