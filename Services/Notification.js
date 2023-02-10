const nodemailer = require ("nodemailer");

const Send_the_Contact_Form_Email = async (Request, Response, Next) => 
{
	const Transporter = nodemailer.createTransport (
	{
		host: process.env.Email_Server,
		port: 465, //465, 587
		secure: true,
		auth: 
		{
			user: process.env.Email_Username,
			pass: process.env.Email_Password
		},
	});
	
	const Email_Object = await Transporter.sendMail ({
		from: `'${Request.body.Name}' <${process.env.Email_Username}>`,
		to: process.env.Email_Username,
		subject: `al waseet: Inquiry from ${Request.body.Restaurant}`,
		html: `<div>
			<p>Dear al waseet,</p>
			<p>${Request.body.Message}</p>
			<p>Kind Regards,</p>
			<p>${Request.body.Name}</p>
			<p>${Request.body.Email}</p>
			<p>${Request.body.Phone_Number}</p>
			<p>${Request.body.Restaurant}, ${Request.body.City}, ${Request.body.Emirate}</p>
		</div>`
	}).catch (Response.status (500).json (Object.assign ({Status: 500})));

	Response.status (200).json (Object.assign ({Status: 200}));
}

module.exports = {Send_the_Contact_Form_Email}