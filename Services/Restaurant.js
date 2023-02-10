const {Get_Data, Insert_Data, Update_Data} = require ('../Database/Functions');
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
	Object.keys (Request.body.Icons).forEach (Key =>
	{
		if (Helpers.Validate_Image_URL (Request.body.Icons [Key]) === 'Base64 Image')
		{
			Helpers.Save_Base64_Image_to_a_File (Request.body.Icons [Key], Request.body.Icons [`${Key}_File_Path`]);
		}
		Request.body.Icons [Key] = Request.body.Icons [`${Key}_File_Path`];
		delete Request.body.Icons [`${Key}_File_Path`];
	});
	Request.body.Menu.forEach (Menu_Item => 
	{
		if (Helpers.Validate_Image_URL (Menu_Item.Image) === 'Base64 Image')
		{
			console.log (Menu_Item.File_Path);
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