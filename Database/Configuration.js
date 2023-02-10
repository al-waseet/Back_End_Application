const { MongoClient, ServerApiVersion } = require ('mongodb');

const MongoDB = new MongoClient (`mongodb+srv://${process.env.MongoDB_Username}:${process.env.MongoDB_Password}@al-waseet-1.8mr4s.mongodb.net/?retryWrites=true&w=majority`,
{
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1
});

const Database = MongoDB.db ('Beta_Version');

module.exports = Database;