const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

module.exports.create = async (event) => {    
  console.log('event -> ', event)
  const { id, name, description } = event.arguments

  const params = {
    Item: { id, name, description },
    ReturnConsumedCapacity: "TOTAL",
    TableName: process.env.TODO_TABLE_NAME
  }

  return dynamodb.putItem(params).promise()
    .then(data => {            
        return {
            id,
            name,
            description
        }
    })
    .catch(err => {
        console.log(err)
    })
};
module.exports.delete = async (event) => {
  console.log('event -> ', event)

  const id = event.arguments.id

  const params = {
    Key: {
        "id": {
            S: id
        }
    },
    TableName: process.env.TODO_TABLE_NAME
  }


  return dynamodb.deleteItem(params).promise()
      .then(data => {   
          console.log('deleteItem -> ', data)         
          return {
              data
          }
      })
      .catch(err => {
        console.log(err)
      })
};
module.exports.get = async (event) => {
console.log('event -> ', event)

const params = {        
    TableName: process.env.TODO_TABLE_NAME
}

return dynamodb.scan(params).promise()
    .then(data => {            
        const todoList = [];
        for (let i = 0; i < data.Items.length; i++) {
            todoList.push({
                id: data.Items[i].id.S,
                name: data.Items[i].name.S,
                description: data.Items[i].description.S
            });        
        }
        return todoList;            
    })
    .catch(err => {
        console.log(err)
    })
};
module.exports.update = async (event) => {
console.log('event -> ', event)

const id = event.arguments.id
const name = event.arguments.name
const description = event.arguments.description

const params = {
  ExpressionAttributeNames: {
      "#n": "name",
      "#d": "description"          
  },
  ExpressionAttributeValues: {
      ":n": {
          S: name
      },
      ":d": {
          S: description
      }
  },
  Key: {
      "id": {
          S: id
      }
  },
  ReturnValues: "ALL_NEW",
  TableName: process.env.TODO_TABLE_NAME,
  UpdateExpression: "SET #n = :n, #d = :d"
}

return dynamodb.updateItem(params).promise()
  .then(data => {
      const body = data.Attributes
      return {
        id: body.id.S,
        name: body.name.S,
        description: body.description.S
      }
  })
  .catch(err => {
    console.log(err)
  })
};