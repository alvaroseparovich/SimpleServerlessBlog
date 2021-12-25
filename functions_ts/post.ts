declare global { interface Blob {}  interface File {}} // https://github.com/aws/aws-sdk-js-v3/issues/2125
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { appSyncEvent } from './types/events'

const DB = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const PK = 'POST'

function rand (min: number, max: number):number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
function createSK (prepend:string = PK):string {
  return `${prepend}#${(new Date).toISOString()}${rand(10000,99999)}`
}

export async function create (event:appSyncEvent) {    
  console.log('event -> ', event)
  const { arguments: args } = event
  
  const SK = createSK()
  const command = new PutCommand({ 
    TableName: process.env.DYNAMO_TABLE_NAME,
    Item: { PK, SK, ...args }
  })
  const response = await DB.send(command)
  return {...args, id: SK}
}

export async function get (event:appSyncEvent) {
  console.log('event -> ', event)

  const params = {        
      TableName: process.env.DYNAMO_TABLE_NAME
  }
  return {}
}