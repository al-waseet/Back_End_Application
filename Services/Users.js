const {Get_Data, Update_Data} = require ('../Database/Functions');
const Helpers = require ('../Helpers');

const Get_Users = async (Request, Response, Next) => 
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
}

const Update_the_User = async (Request, Response, Next) => 
{
	if (Helpers.Validate_Image_URL (Request.body.Avatar) === 'Base64 Image')
	{
		Helpers.Save_Base64_Image_to_a_File (Request.body.Avatar, Request.body.Avatar_File_Path);
	}
	Request.body.Avatar = Request.body.Avatar_File_Path;
	delete Request.body.Avatar_File_Path;
	delete Request.body.Token;
	Update_Data ('Users', Request.body, {Username: Request.body.Username}).then (Data => 
	{
		Response.Result = {Status: 200};
		Next ();
	}).catch (() => 
	{
		Response.Result = {Status: 500};
		Next ();
	});
}

module.exports = {Get_Users, Update_the_User}