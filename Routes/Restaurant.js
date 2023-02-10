const Response_Handler = require ("../Middleware/Response_Handler");
const Restaurant_Services = require ("../Services/Restaurant");
const Router = require ('express').Router ();

Router.get ('/pos', Restaurant_Services.Get_POS, Response_Handler);
Router.get ('/restaurant/:Restaurant_ID', Restaurant_Services.Get_the_Restaurant, Response_Handler);
Router.post ('/order', Restaurant_Services.Order, Response_Handler);
Router.put ('/restaurant', Restaurant_Services.Get_the_Restaurant, Response_Handler);

module.exports = Router; 