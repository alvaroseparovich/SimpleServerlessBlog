import { insertValues } from './dynamodbOneTable'
import { appSyncEvent } from './types/events'
import { getEntityManager, getBatchManager } from '@typedorm/core';
import { POST } from './types/Entities'
import { randomUUID } from 'crypto';

const entityManger = getEntityManager();
const batchManager = getBatchManager()

export async function create (event:appSyncEvent) {    
  console.log('event -> ', JSON.stringify(event, null, 2))
  const args = event.arguments.post
  args.status = args.status || 'draft'
  args.id = randomUUID()
  args.slug = args.slug || args.id
  args.creatorSub = event.identity.sub
  args.creator = event.identity.username
  const post = new POST()
  const response = await entityManger.create(insertValues(post, args))
  console.log(response)
  return response
}

export async function get (event:appSyncEvent) {
  console.log('event -> ', JSON.stringify(event, null, 2))
  const response = await entityManger.findOne(POST, { id: event.arguments.id })
  console.log(response)
  return response
}

export async function update (event:appSyncEvent) {    
  console.log('event -> ', JSON.stringify(event, null, 2))

  batchManager.read({ addGet: [POST, { id: ''}] })
  // const { id, args } = event.arguments
  // const { sub } = event.identity
  // args.status = args.status || 'draft'
  // args.slug = args.slug || id
  // const response = await entityManger.update(POST, { id }, args, { where: { creatorSub: { EQ: sub } } })
  // console.log(response)
  // return response
}
