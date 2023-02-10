require ('dotenv').config ();

const Body_Parser = require ('body-parser');
const CORS = require ('cors');
const Express = require ('express');

const Application = Express ();

Application.use (Express.static (__dirname));
Application.use (Body_Parser.json ({limit: '150mb'}))
Application.use (Express.json ());
Application.use ((Request, Response, Next) =>
{
	Response.header ("Access-Control-Allow-Origin", "*");
	Response.header ("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	Next ();
});
Application.use (CORS ({origin: process.env.Environment === "Production" ? [] : [process.env.Ordering_Application_Root_URL, process.env.Landing_Page_Root_URL, process.env.Dasboard_Root_URL]}));

require ('./Routes/Routes') (Application);
require ('./Socket');

Application.listen (process.env.Server_Port_Number);