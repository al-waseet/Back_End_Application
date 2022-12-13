require ('dotenv').config ();

const axios = require ('axios');
const bcrypt = require ('bcrypt');
const Body_Parser = require ('body-parser');
const CORS = require ('cors');
const crypto = require ('crypto').webcrypto;
const Express = require ('express');
const JSON_Web_Token = require ('jsonwebtoken');
const nodemailer = require ("nodemailer");
const ObjectId = require ('mongodb').ObjectId; 

const Router = Express.Router ();
const Response_Handler = require ('./Middleware/Response_Handler');

const Application = Express ();

Application.use (Express.static (__dirname));
Application.use (Body_Parser.json ({limit: '50mb'}))
Application.use (Express.json ());

const { MongoClient } = require ('mongodb');

const MongoDB = new MongoClient (`mongodb+srv://${process.env.MongoDB_Username}:${process.env.MongoDB_Password}@al-waseet-1.8mr4s.mongodb.net/?retryWrites=true&w=majority`);
const Database = MongoDB.db ('Beta_Version');

const Get_Data = async (Collection, Query, Number_of_Results) =>
{
	let Result = {}
	if (Number_of_Results == 'One')
	{
		Result = await Database.collection (Collection).findOne (Query);
	}
	else if (Number_of_Results === 'All')
	{
		Result = await Database.collection (Collection).find ().toArray ();
	}
	else
	{
		Result = await Database.collection (Collection).find (Query).toArray ();
	}
	return Result;
}

const Insert_Data = async (Collection, Data) =>
{
	const Result = await Database.collection (Collection).insertOne (Data);
	return Result;
}

const Update_Data = async (Collection, Data, Query) =>
{
	delete Data._id;
	const Result = await Database.collection (Collection).updateOne (Query, {$set: Data});
	return Result;
}

Application.use ((Request, Response, Next) =>
{
	Response.header ("Access-Control-Allow-Origin", "*");
	Response.header ("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	Next ();
});

Application.use (CORS ({origin: [process.env.Ordering_Application_URL, process.env.Website_URL, process.env.Dasboard_Application_URL]}));

Application.use ('/api', Router);

Router.get ('/pos', async (Request, Response, Next) => 
{
	Get_Data ('POS', {}, 'All').then (Data => 
	{
		Response.Result = {Data: Data, Status: 200};
		Next ();
	}).catch (() => 
	{
		Response.Result = {Status: 500};
		Next ();
	});
}, Response_Handler);

Router.get ('/restaurant/:Restaurant_ID', async (Request, Response, Next) => 
{
	Get_Data ('Restaurants', {_id: ObjectId (Request.params.Restaurant_ID)}, 'One').then (Data => 
	{
		Response.Result = {Data: Data, Status: 200};
		Next ();
	}).catch (() => 
	{
		Response.Result = {Status: 500};
		Next ();
	});
}, Response_Handler);

Router.get ('/users/:Restaurant_ID', async (Request, Response, Next) => 
{
	Get_Data ('Users', {Restaurant_ID: Request.params.Restaurant_ID}).then (Data => 
	{
		Response.Result = {Data: Data, Status: 200};
		Next ();
	}).catch (() => 
	{
		Response.Result = {Status: 500};
		Next ();
	});
}, Response_Handler);

Router.post ('/order', async (Request, Response, Next) => 
{
	Insert_Data ('Orders', Request.body).then (Data => 
	{
		Response.Result = {Status: 200};
		Next ();
	}).catch (() => 
	{
		Response.Result = {Status: 500};
		Next ();
	});
}, Response_Handler);

Router.put ('/restaurant', async (Request, Response, Next) => 
{
	Update_Data ('Restaurants', Request.body, {_id: ObjectId (Request.body._id)}).then (Data => 
	{
		Response.Result = {Status: 200};
		Next ();
	}).catch (() => 
	{
		Response.Result = {Status: 500};
		Next ();
	});
}, Response_Handler);

Router.put ('/user', async (Request, Response, Next) => 
{
	Update_Data ('Users', Request.body, {Username: Request.body.Username}).then (Data => 
	{
		Response.Result = {Status: 200};
		Next ();
	}).catch (() => 
	{
		Response.Result = {Status: 500};
		Next ();
	});
}, Response_Handler);

Router.post ("/login", async (Request, Response, Next) => 
{
	if (!Request.body)
	{
		Response.Result = {Status: 401};
		Next ();
	}
	if (Request.body.Username === '' || Request.body.Password === '')
	{
		Response.Result = {Status: 401};
		Next ();
	}
	Get_Data ('Users', {Username: Request.body.Username}, 'One').then (async (Authenticated_User) =>
	{
		if (Authenticated_User && (await bcrypt.compare (Request.body.Password, Authenticated_User.Password)))
		{
			Authenticated_User.Token = JSON_Web_Token.sign ({ Username: Authenticated_User.Username }, process.env.JSON_Web_Token_Key, {expiresIn: "2h"});
			Authenticated_User.Status = 200;
			delete Authenticated_User.Password;
			Response.Result = {Data: Authenticated_User, Status: 200};
			Next ();
		}
		else
		{
			Response.Result = {Status: 401};
			Next ();
		}
	}).catch (() => 
	{
		Response.Result = {Status: 401};
		Next ();
	});
}, Response_Handler);

Router.post ("/register", async (Request, Response, Next) => 
{
	if (Users.find (User => User.Username === Request.body.Username))
	{
		Response.status (409).json ({Status: 409});
	}
	const Salt_Rounds = new Uint32Array (1);
	crypto.getRandomValues (Salt_Rounds);
	const Encrypted_Password = bcrypt.hashSync (Request.body.Password, bcrypt.genSaltSync (Salt_Rounds [0] % 10));
	const New_Restaurant_ID = new ObjectId ();
	const New_User = 
	{
		Avatar: "",
		Email: Request.body.Email,
		Password: Encrypted_Password,
		Payment_Methods: [],
		Restaurant_ID: New_Restaurant_ID,
		Subscription:
		{
			Plan: "Trial",
			End_Date: "February 28, 2023",
			Next_Payment: "February 1, 2023",
			Outstanding_Amount: 99
		},
		Type: "Owner",
		Username: Request.body.Username
	};
	const New_Restaurant = 
	{
		_id: New_Restaurant_ID,
		Branch: Request.body.Branch,
		Categories: [],
		Cart_Icon: "/Images/Icons/Cart_1.svg",
		Colors:
		{
			Background: "#FFFFFF",
			Button: "#000000",
			Button_Text: "#FFFFFF",
			Text: "#000000"
		},
		Currency: "AED",
		Franchise: false,
		Icons:
		{
			"Favicon": "",
			"One_Hundred_Ninety_Two_Pixels": "",
			"Five_Hundred_Twelve_Pixels": ""
		},
		Language: "en-US",
		Location: Request.body.Address,
		Logo: "",
		Menu: [],
		Name: Request.body.Restaurant_Name,
		POS:
		{
			API_Key: "",
			API_URL: "",
			System: ""
		},
		Tables: [],
		Website: Request.body.Website
	};
	Insert_Data ('Restaurants', New_Restaurant);
	Insert_Data ('Users', New_User);
	New_User.Token = JSON_Web_Token.sign ({ Username: New_User.Username }, process.env.JSON_Web_Token_Key, {expiresIn: "2h"});
	New_User.Status = 201;
	Response.status (201).json (New_User);
}, Response_Handler);

Router.post ('/mamo-payment', async (Request, Response, Next) => 
{
	const Mamo_Payment_Request_Response = await axios ('https://business.mamopay.com/manage_api/v1/links', 
	{
		method: 'POST',
		headers: 
		{
			"Authorization": "Bearer " + process.env.Mamo_Token,
			"Content-type": "application/json"
		},
		data: JSON.stringify ({
			"name": Request.body.Subscription_Plan,
			"description": Request.body.Description,
			"capacity": 1,
			"active": true,
			"return_url": "https://alwaseet.me/success",
			"amount": Request.body.Price,
			"enable_message": true,
			"enable_tips": false,
			"enable_customer_details": true
		})
	});
	Response.status (200).json (Object.assign ({Status: 200}, Mamo_Payment_Request_Response));
}, Response_Handler);

Router.post ('/email', async (Request, Response, Next) => 
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
}, Response_Handler);

// Password: a

Application.listen (process.env.Server_Port_Number);