const Get_the_File_Extension = Image_File_Path => 
{
    let Result = '';
    ['png', 'jpeg', 'jpg', 'svg'].forEach (File_Extension => 
    {
        if (Image_File_Path.includes (File_Extension))
        {
            Result = Result + File_Extension;
        }
    });
    return Result;
}

const Save_Base64_Image_to_a_File = async (Base64_Image, Image_File_Path) => await require ("fs").writeFile (`${process.env.Environment === "Production" ? require ('path').join (__dirname, '..', 'public_html') : __dirname}${Image_File_Path}`, Base64_Image.replace (`data:image/${Get_the_File_Extension (Image_File_Path)};base64,`, ""), {encoding: 'base64'}, Error_Instance => console.error (Error_Instance));

const Turn_Absolute_URL_to_Abstract_URL = Uniform_Resource_Locator =>
{
	[process.env.Ordering_Application_Root_URL, process.env.Landing_Page_Root_URL, process.env.Dasboard_Root_URL, process.env.Production_Root_URL].forEach (Root_URL =>
	{
		if (Uniform_Resource_Locator.includes (Root_URL))
		{
			return Uniform_Resource_Locator.slice (Root_URL.length, Uniform_Resource_Locator.length);
		}
	});
	return Uniform_Resource_Locator;
}

const Validate_Image_URL = Image_URL =>
{
	if (Image_URL === '' || Image_URL === undefined)
	{
		return 'Invalid';
	}
	else if (new RegExp (/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig).test (Image_URL))
	{
		return 'Absolute URL';
	}
	else if (Image_URL.slice (0, 11) === 'data:image/')
	{
		return 'Base64 Image';
	}
	else
	{
		return 'Invalid';
	}
}

module.exports = 
{
    Save_Base64_Image_to_a_File,
    Turn_Absolute_URL_to_Abstract_URL,
    Validate_Image_URL,
}