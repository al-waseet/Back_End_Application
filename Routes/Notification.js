const Response_Handler = require ("../Middleware/Response_Handler");
const Router = require ('express').Router ();
const Notification_Services = require ("../Services/Notification");

Router.post ('/email', Notification_Services.Send_the_Contact_Form_Email, Response_Handler);

module.exports = Router; 