declare global { interface Blob {}  interface File {}} // https://github.com/aws/aws-sdk-js-v3/issues/2125
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand, 
  QueryCommand,
  UpdateCommand
 } from '@aws-sdk/lib-dynamodb'
import { atributeToGetFromEvent, ExpressionAttributeNamesFromList, ExpressionAttributeValuesFromObject, generateProjectionExpressionFromList, insertValues, removeCompositeKeys, UpdateExpressionGenerator } from './dynamodbOneTable'
import { appSyncEvent } from './types/events'
import { getEntityManager } from '@typedorm/core';
import { POST } from './types/Entities'
const entityManger = getEntityManager();
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
  const { id, ...args } = event.arguments.post
  args.creator = event.identity.sub
  const post = new POST()
  const a = await entityManger.create(insertValues(post, args))
  console.log(a)
  return {...args}
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

export async function getLastPosts (event:appSyncEvent) {
  console.log('event -> ', JSON.stringify(event, null, 2))
  const status = event.arguments.status || 'PUBLIC'

  const selectionSetList = atributeToGetFromEvent(event.info.selectionSetList)
  const ExpressionAttributeNames = ExpressionAttributeNamesFromList(selectionSetList)
  const ProjectionExpression = generateProjectionExpressionFromList(selectionSetList)
  const command = new QueryCommand({        
    TableName: process.env.DYNAMO_TABLE_NAME,
    IndexName: process.env.FirstSecondaryIndex,
    KeyConditionExpression: 'SK = :SK and PK < :PK',
    ExpressionAttributeValues: {
      ':SK': SK,
      ':PK': `${(new Date()).getFullYear() + 1}`,
    },
    ExpressionAttributeNames,
    ProjectionExpression
  })
  const { Items } = await DB.send(command)
  return Items.map(removeCompositeKeys)
}

export async function getLastPostVersions (event:appSyncEvent) {
  console.log('event -> ', JSON.stringify(event, null, 2))

  const selectionSetList = atributeToGetFromEvent(event.info.selectionSetList)
  selectionSetList.push('SK')
  const ExpressionAttributeNames = ExpressionAttributeNamesFromList(selectionSetList)
  const ProjectionExpression = generateProjectionExpressionFromList(selectionSetList)
  const command = new QueryCommand({        
    TableName: process.env.DYNAMO_TABLE_NAME,
    KeyConditionExpression: 'PK = :PK and begins_with(SK, :SK)',
    ExpressionAttributeValues: {
      ':PK': event.arguments.id,
      ':SK': 'VERSION',
    },
    ExpressionAttributeNames,
    ProjectionExpression
  })
  const { Items } = await DB.send(command)
  console.log(Items)
  return Items.map(item => {
    item.id = item.PK
    item.version = item.SK
    delete item.PK
    delete item.SK
    return item
  })
}

export async function update (event:appSyncEvent) {    
  console.log('event -> ', JSON.stringify(event, null, 2))
  const { id, post } = event.arguments
  const { sub } = event.identity
  const PK = id
  const version = `VERSION#${new Date().getTime()}`

  const command = new PutCommand({ 
    TableName: process.env.DYNAMO_TABLE_NAME,
    Item: { PK, SK, ...post, currentVersion: version, sub },
    ConditionExpression: '#sub = :sub',
    ExpressionAttributeNames: ExpressionAttributeNamesFromList(['sub']),
    ExpressionAttributeValues: ExpressionAttributeValuesFromObject({ sub })
  })
  const commandVersion = new PutCommand({ 
    TableName: process.env.DYNAMO_TABLE_NAME,
    Item: { PK, SK: version, ...post }
  })
  await DB.send(command)
  await DB.send(commandVersion)
  return {...post, id: PK}
}

export async function minimalUpdate (event:appSyncEvent) {    
  console.log('event -> ', JSON.stringify(event, null, 2))
  const { id, post } = event.arguments
  const { sub } = event.identity
  const version = `VERSION#${new Date().getTime()}`
  post.currentVersion = version
  post.sub = sub
  const keyList = Object.keys(post)
  const ExpressionAttributeNames = ExpressionAttributeNamesFromList(keyList)
  const ExpressionAttributeValues = ExpressionAttributeValuesFromObject(post)
  const UpdateExpression = UpdateExpressionGenerator(keyList)
  const command = new UpdateCommand({ 
    TableName: process.env.DYNAMO_TABLE_NAME,
    Key: { PK:id, SK },
    ConditionExpression: '#sub = :sub',
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    UpdateExpression,
    ReturnValues: 'ALL_NEW'
  })
  const { Attributes } = await DB.send(command)
  const { currentVersion, ...versionBody} = Attributes
  const commandVersion = new PutCommand({ 
    TableName: process.env.DYNAMO_TABLE_NAME,
    Item: {...versionBody, SK: currentVersion }
  })
  console.log(await DB.send(commandVersion))
  return removeCompositeKeys(Attributes)
}