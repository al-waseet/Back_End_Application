require ('dotenv').config ();

const bcrypt = require ('bcrypt');
const Body_Parser = require ('body-parser');
const CORS = require ('cors');
const crypto = require ('crypto').webcrypto;
const Express = require ('express');
const JSON_Web_Token = require ('jsonwebtoken');
const nodemailer = require ("nodemailer");
const ObjectId = require ('mongodb').ObjectId;

const Helpers = require ('./Helpers');
const Response_Handler = require ('./Middleware/Response_Handler');

const Router = Express.Router ();
const Application = Express ();
Application.use (Express.static (__dirname));
Application.use (Body_Parser.json ({limit: '50mb'}))
Application.use (Express.json ());

const { MongoClient, ServerApiVersion } = require ('mongodb');

const MongoDB = new MongoClient (`mongodb+srv://${process.env.MongoDB_Username}:${process.env.MongoDB_Password}@al-waseet-1.8mr4s.mongodb.net/?retryWrites=true&w=majority`,
{
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1
});

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

Application.use (CORS ({origin: process.env.Environment === "Production" ? [] : [process.env.Ordering_Application_Root_URL, process.env.Landing_Page_Root_URL, process.env.Dasboard_Root_URL]}));

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
	Request.body.Categories.forEach (Category => 
	{
		if (Helpers.Validate_Image_URL (Category.Banner_Image) === 'Absolute URL')
		{
			Category.Banner_Image = Category.File_Path;
		}
		else if (Helpers.Validate_Image_URL (Category.Banner_Image) === 'Base64 Image')
		{
			Helpers.Save_Base64_Image_to_a_File (Category.Banner_Image, Category.File_Path);
		}
		delete Category.File_Path;
	});
	if (Helpers.Validate_Image_URL (Restaurant.Data.Cart_Icon) === 'Absolute URL')
	{
		Request.body.Cart_Icon = Request.body.Cart_Icon_File_Path;
	}
	else if (Helpers.Validate_Image_URL (Restaurant.Data.Cart_Icon) === 'Base64 Image')
	{
		Helpers.Save_Base64_Image_to_a_File (Request.body.Cart_Icon, Request.body.Cart_Icon_File_Path);
	}
	delete Request.body.Cart_Icon_File_Path;
	Object.keys (Request.body.Icons).forEach (Key =>
	{
		if (Helpers.Validate_Image_URL (Request.body.Icons [Key]) === 'Absolute URL')
		{
			Request.body.Icons [Key] = Request.body.Icons [`${Key}_File_Path`];
		}
		else if (Helpers.Validate_Image_URL (Request.body.Icons [Key]) === 'Base64 Image')
		{
			Helpers.Save_Base64_Image_to_a_File (Request.body.Icons [Key], Request.body.Icons [`${Key}_File_Path`]);
		}
		delete Request.body.Icons [`${Key}_File_Path`];
	});
	Request.body.Menu.forEach (Menu_Item => 
	{
		if (Helpers.Validate_Image_URL (Category.Banner_Image) === 'Absolute URL')
		{
			Menu_Item.Image = Menu_Item.File_Path;
		}
		else if (Helpers.Validate_Image_URL (Category.Banner_Image) === 'Base64 Image')
		{
			Helpers.Save_Base64_Image_to_a_File (Menu_Item.Image, Menu_Item.File_Path);
		}
		delete Menu_Item.File_Path;
	});
	if (Helpers.Validate_Image_URL (Restaurant.Data.Cart_Icon) === 'Absolute URL')
	{
		Request.body.Logo = Request.body.Logo_File_Path;
	}
	else if (Helpers.Validate_Image_URL (Restaurant.Data.Cart_Icon) === 'Base64 Image')
	{
		Helpers.Save_Base64_Image_to_a_File (Request.body.Logo, Request.body.Logo_File_Path);
	}
	delete Request.body.Logo_File_Path;
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
	if (Helpers.Validate_Image_URL (Restaurant.Data.Avatar) === 'Absolute URL')
	{
		Request.body.Avatar = Request.body.Avatar_File_Path;
	}
	else if (Helpers.Validate_Image_URL (Restaurant.Data.Avatar) === 'Base64 Image')
	{
		Helpers.Save_Base64_Image_to_a_File (Request.body.Avatar, Request.body.Avatar_File_Path);
	}
	delete Request.body.Avatar_File_Path;
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
	await Database.collection ('Users').aggregate ([
		{
			$match: {Username: Request.body.Username}
		},
		{
			$project:
			{
				"Restaurant_ID_Object": {$toObjectId: "$Restaurant_ID"} 
			} 
		},
		{
			$lookup:
			{
				from: "Restaurants",
				localField: "Restaurant_ID_Object",
				foreignField: "$_id",
				as: "Restaurant"
			}
		},
		/*{
			$set: 
			{
				Restaurant: 
				{
					$arrayElemAt: ["$Restaurant", 0]
				}
			}
		},*/
		/*{
			$unwind: "$Restaurant"
		},*/
		{
			$lookup:
			{
				from: "Users",
				localField: "Restaurant_ID",
				foreignField: "Restaurant_ID",
				as: "Users"
			}
		},
		/*{
			$unwind: "$Users"
		}*/
	]).next ().then (async Authenticated_User =>
	{
		console.log (Authenticated_User)
		if (Authenticated_User && (await bcrypt.compare (Request.body.Password, Authenticated_User.Password)))
		{
			Authenticated_User.Token = JSON_Web_Token.sign ({ Username: Authenticated_User.Username }, process.env.JSON_Web_Token_Key, {expiresIn: "2h"});
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