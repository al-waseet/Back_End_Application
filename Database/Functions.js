const Database = require ('./Configuration');

const Get_Data = async (Collection, Query, Number_of_Results) =>
{
	let Result = {}
	if (Number_of_Results == 'One')
	{
		Result = await Database.collection (Collection).findOne (Query);
	}
	else if (Number_of_Results === 'All')
	{
		Result = await Database.collection (Collection).find ().toArray ();
	}
	else
	{
		Result = await Database.collection (Collection).find (Query).toArray ();
	}
	return Result;
}

const Insert_Data = async (Collection, Data) =>
{
	const Result = await Database.collection (Collection).insertOne (Data);
	return Result;
}

const Update_Data = async (Collection, Data, Query) =>
{
	delete Data._id;
	const Result = await Database.collection (Collection).updateOne (Query, {$set: Data});
	return Result;
}

module.exports = {Get_Data, Update_Data, Insert_Data};