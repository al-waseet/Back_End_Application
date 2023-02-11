const {Get_Data, Insert_Data, Update_Data} = require ('../Database/Functions');
const Helpers = require ('../Helpers');
const ObjectId = require ('mongodb').ObjectId;

const Get_POS = async (Request, Response, Next) => 
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
}

const Get_the_Restaurant = async (Request, Response, Next) => 
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
}

const Order = async (Request, Response, Next) => 
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
}

const Update_the_Restaurant = async (Request, Response, Next) => 
{
	Request.body.Categories.forEach (Category => 
	{
		if (Helpers.Validate_Image_URL (Category.Banner_Image) === 'Base64 Image')
		{
			Helpers.Save_Base64_Image_to_a_File (Category.Banner_Image, Category.File_Path);
		}
		Category.Banner_Image = Category.File_Path;
		delete Category.File_Path;
	});
	if (Helpers.Validate_Image_URL (Request.body.Cart_Icon) === 'Base64 Image')
	{
		Helpers.Save_Base64_Image_to_a_File (Request.body.Cart_Icon, Request.body.Cart_Icon_File_Path);
	}
	Request.body.Cart_Icon = Request.body.Cart_Icon_File_Path;
	delete Request.body.Cart_Icon_File_Path;
	if (Helpers.Validate_Image_URL (Request.body.Icons.Five_Hundred_Twelve_Pixels) === 'Base64 Image')
	{
		Helpers.Save_Base64_Image_to_a_File (Request.body.Icons.Five_Hundred_Twelve_Pixels, Request.body.Icons.Five_Hundred_Twelve_Pixels_File_Path);
	}
	Request.body.Icons.Five_Hundred_Twelve_Pixels = Request.body.Icons.Five_Hundred_Twelve_Pixels_File_Path;
	delete Request.body.Icons.Five_Hundred_Twelve_Pixels_File_Path;

	/*if (Helpers.Validate_Image_URL (Request.body.Icons.One_Hundred_Ninety_Two_Pixels) === 'Base64 Image')
	{
		Helpers.Save_Base64_Image_to_a_File (Request.body.Icons.One_Hundred_Ninety_Two_Pixels, Request.body.Icons.One_Hundred_Ninety_Two_Pixels_File_Path);
	}
	Request.body.Icons.One_Hundred_Ninety_Two_Pixels = Request.body.Icons.One_Hundred_Ninety_Two_Pixels_File_Path;
	delete Request.body.Icons.One_Hundred_Ninety_Two_Pixels_File_Path;

	if (Helpers.Validate_Image_URL (Request.body.Icons.Favicon) === 'Base64 Image')
	{
		Helpers.Save_Base64_Image_to_a_File (Request.body.Icons.Favicon, Request.body.Icons.Favicon_File_Path);
	}
	Request.body.Icons.Favicon = Request.body.Icons.Favicon_File_Path;
	delete Request.body.Icons.Favicon_File_Path;*/

	Request.body.Menu.forEach (Menu_Item => 
	{
		if (Helpers.Validate_Image_URL (Menu_Item.Image) === 'Base64 Image')
		{
			Helpers.Save_Base64_Image_to_a_File (Menu_Item.Image, Menu_Item.File_Path);
		}
		Menu_Item.Image = Menu_Item.File_Path;
		delete Menu_Item.File_Path;
	});
	if (Helpers.Validate_Image_URL (Request.body.Cart_Icon) === 'Base64 Image')
	{
		Helpers.Save_Base64_Image_to_a_File (Request.body.Logo, Request.body.Logo_File_Path);
	}
	Request.body.Logo = Request.body.Logo_File_Path;
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
}

module.exports = {Get_POS, Get_the_Restaurant, Order, Update_the_Restaurant};