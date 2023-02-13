module.exports = (Application) =>
{
    Application.use ('/api', require ('./Authentication'));
    Application.use ('/api', require ('./Notification'));
    Application.use ('/api', require ('./Restaurant'));
    Application.use ('/api', require ('./Users'));
}