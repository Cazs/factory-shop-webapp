var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true,
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	enquiryType: { type: Types.Select, options: [
		{ value: 'message', label: 'Just leaving a message' },
		{ value: 'question', label: 'I\'ve got a question' },
		{ value: 'other', label: 'Something else...' },
	] },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now },
});

Enquiry.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Enquiry.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function (callback)
{
	var enquiry = this;
	var mailjet = require('node-mailjet').connect('f8d3d1d74c95250bb2119063b3697082','8304b30da4245632c878bf48f1d65d92');
	//send email notification to stakeholders
	var request = mailjet.post("send").request(
	{
		"FromName": enquiry.name.first+" "+enquiry.name.last,
		"FromEmail": "enquiries@factoryshopza.co.za",
		"Subject": "New Enquiry From " + enquiry.name.first + " " + enquiry.name.last,
		//"Text-part": enquiry.name.first + " " + enquiry.name.last +" says,\n" + enquiry.message.html,
		"Html-part": "<p style='font-size:22px;'>"+enquiry.name.first+" "+enquiry.name.last+" left a message of type <strong>"+enquiry.enquiryType +"</strong>,<br/><br/></p>"
					+ (enquiry.phone?"<h4>Phone:<i>" + enquiry.phone + "</i></h4><br/>":"")
					+ "<h4>e-Mail Address:<i>" + enquiry.email + "</i></h4><br/>"
					+ "<h2>Message:</h2><br/><p>" + enquiry.message.html + "</p><br/><br/>"+"Kindest Regards,<br/>Factoryshop Mailing System.",
		"Recipients":
		[
			{
				"Email": "enquiries@factoryshopza.co.za"
			}
		]
		}, function(err, res)
		{
			if(err)
			{
				console.log('email send error: %s', err);
				if(callback)
					callback(err);
				return;
			}
			console.log('email sent to system email.');
			//send email to user/client as well.
			var msg = "<p>Hi " + enquiry.name.first+",<br/>We've received your enquiry about " + enquiry.enquiryType
						" and one of our consultants will get back to you soon.</p><br/><br/>";
				msg += "<h3>Your message was:</h3><br/><i>" + enquiry.message.html + "</i><br/><br/>";
				msg += "<h3>Thank you!</h3><br/><br/>Kindest Regards,<br/>Factoryshop Team.";
			request = mailjet.post("send").request(
			{
				"FromName": "Factoryshop",
				"FromEmail": "enquiries@factoryshopza.co.za",
				"Subject": "Enquiry Receipt",
				//"Text-part": msg,
				"Html-part": msg,
				"Recipients":
				[
					{
						"Email": enquiry.email
					}
				]
			}, function(err, res)
			{
				if(err)
				{
					console.log('could not send email to [%s]: %s', enquiry.email, err);
					if(callback)
						callback(err);
				}else
				{
					console.log('email successfully sent to [%s] ', enquiry.email);
				}
			});
		}
	);
	/*if (typeof callback !== 'function') {
		callback = function (err) {
			if (err) {
				console.error('There was an error sending the notification email:', err);
			}
		};
	}

	if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
		console.log('Unable to send email - no mailgun credentials provided');
		return callback(new Error('could not find mailgun credentials'));
	}

	var enquiry = this;
	var brand = keystone.get('brand');

	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
		if (err) return callback(err);
		new keystone.Email({
			templateName: 'enquiry-notification',
			transport: 'mailgun',
		}).send({
			to: admins,
			from: {
				name: 'My Site',
				email: 'contact@my-site.com',
			},
			subject: 'New Enquiry for My Site',
			enquiry: enquiry,
			brand: brand,
		}, callback);
	});*/
};

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
