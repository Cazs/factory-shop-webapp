var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res, view)
{
	console.log('init contact ctrl');
	//var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	//locals.section = 'contact';
	locals.enquiryTypes = Enquiry.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function ()
	{
		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);

		updater.process(req.body, 
		{
			flashErrors: true,
			fields: 'name, email, enquiryType, message',
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err)
		{
			if (err)
			{
				locals.validationErrors = err.errors;
			} else
			{
				locals.enquirySubmitted = true;
				res.redirect('/?msg=successfully sent enquiry, one of our consultants will get back to you soon!');
			}
		});
	});
	//locals.success_message = "success";
	//view.render('index');
};
