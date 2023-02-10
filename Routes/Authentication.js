const Authentication_Service = require ("../Services/Authentication");
const Response_Handler = require ("../Middleware/Response_Handler");
const Router = require ('express').Router ();

Router.post ("/login", Authentication_Service.Log_In, Response_Handler);
Router.post ("/register", Authentication_Service.Register, Response_Handler);

module.exports = Router;