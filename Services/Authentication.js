const bcrypt = require ('bcrypt');
const crypto = require ('crypto').webcrypto;
const Database = require ('../Database/Configuration');
const Insert_Data = require ('../Database/Functions');
const JSON_Web_Token = require ('jsonwebtoken');
const ObjectId = require ('mongodb').ObjectId;

const Log_In = async (Request, Response, Next) => 
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
			$addFields:
			{
				"Restaurant_ID_Object": {$toObjectId: "$Restaurant_ID"} 
			} 
		},
		{
			$lookup:
			{
				from: "Restaurants",
				localField: "Restaurant_ID_Object",
				foreignField: "_id",
				as: "Restaurant"
			}
		},
		{
			$set: 
			{
				Restaurant: 
				{
					$arrayElemAt: ["$Restaurant", 0]
				}
			}
		},
		{
			$lookup:
			{
				from: "Users",
				localField: "Restaurant_ID",
				foreignField: "Restaurant_ID",
				as: "Users"
			}
		}
	]).next ().then (async Authenticated_User =>
	{
		if (Authenticated_User && (await bcrypt.compare (Request.body.Password, Authenticated_User.Password)))
		{
			Authenticated_User.Token = JSON_Web_Token.sign ({ Username: Authenticated_User.Username }, process.env.JSON_Web_Token_Key, {expiresIn: "2h"});
			delete Authenticated_User.Restaurant_ID_Object;
			delete Authenticated_User.Password;
			Authenticated_User.Users.forEach (User => delete User.Password);
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
}

const Register = async (Request, Response, Next) => 
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
}

module.exports = {Log_In, Register};