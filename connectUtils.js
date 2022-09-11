const { MongoClient } = require('mongodb');
const { model } = require('mongoose');

const uri = "mongodb+srv://dbuser:1234@cluster0.4wf2dow.mongodb.net/test";
const client = new MongoClient(uri);


async function save(name,price,time_) {
  
    try {
        await client.connect();
        let  userCollection = client.db('TokenInfo').collection('TokenData');
        const newdata = { token_name:name, price: price ,time:time_};
        const result = await userCollection.insertOne(newdata);
        console.log("adding new user", result); 
    } 
    finally {
        setTimeout(() => {client.close()}, 1500)
    }


}



async function findByName(name) {

    return new Promise (async (resolve, reject) => {
    try {  
        await client.connect();
        let  userCollection = client.db('TokenInfo').collection('TokenData');
        await userCollection.find({token_name:name},{ projection: { _id: 0 }}).toArray(function(err, result) {
            if (err) throw err;
            resolve(result);
          });
    } 
    finally {
        setTimeout(() => {client.close()}, 1500)
    }

    });
}




async function findByNameList(name_,time_) {

    return new Promise (async (resolve, reject) => {
    try {  

        await client.connect();
        let  userCollection = client.db('TokenInfo').collection('TokenData');
        await userCollection.find({token_name:{ $in: name_},time:new Date(time_)},{ projection: { _id: 0 }}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            resolve(result);
          });
    } 
    finally {
        setTimeout(() => {client.close()}, 1500)
    }

    });
}


module.exports=  {
    save:save,
    findByNameList:findByNameList,
    findByName:findByName

}

