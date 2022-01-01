declare global { interface Blob {}  interface File {}} // https://github.com/aws/aws-sdk-js-v3/issues/2125
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { atributeToGetFromEvent, removeCompositeKeys } from './dynamodbOneTable'
import { appSyncEvent } from './types/events'

const DB = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const SK = 'POST'

function rand (min: number, max: number):number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
function createPK ():string {
  return `${(new Date).toISOString()}#${rand(10000,99999)}`
}

export async function create (event:appSyncEvent) {    
  console.log('event -> ', JSON.stringify(event, null, 2))
  const { id, ...args } = event.arguments
  const PK = createPK()
  const command = new PutCommand({ 
    TableName: process.env.DYNAMO_TABLE_NAME,
    Item: { PK, SK, ...args }
  })
  const response = await DB.send(command)
  return {...args, id: PK}
}

export async function get (event:appSyncEvent) {
  console.log('event -> ', JSON.stringify(event, null, 2))

  const command = new GetCommand({        
    TableName: process.env.DYNAMO_TABLE_NAME,
    Key: {
      PK: event.arguments.id,
      SK
    },
    AttributesToGet: atributeToGetFromEvent(event.info.selectionSetList)
  })

  return removeCompositeKeys((await DB.send(command)).Item)
}