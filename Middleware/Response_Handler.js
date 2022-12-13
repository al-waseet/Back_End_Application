module.exports = (Request, Response, Next) => 
{
	if (Response)
	{
		Response.status (Response.Result.Status).json (Response.Result);
	}
	else
	{
		Next ();
	}
};