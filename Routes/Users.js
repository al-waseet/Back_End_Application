const Response_Handler = require ("../Middleware/Response_Handler");
const Router = require ('express').Router ();
const Users_Services = require ("../Services/Users");

Router.get ('/users/:Restaurant_ID', Users_Services.Get_Users, Response_Handler);
Router.put ('/user', Users_Services.Update_the_User, Response_Handler);

module.exports = Router;