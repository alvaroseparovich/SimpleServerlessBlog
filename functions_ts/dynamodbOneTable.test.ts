import { UpdateExpressionGenerator, parseObjectToPrependedKey, ExpressionAttributeNamesFromList, ExpressionAttributeValuesFromObject, generateProjectionExpressionFromList } from './dynamodbOneTable'

describe('ExpressionAttributeValuesFromObject',()=>{
  it('ExpressionAttributeValuesFromObject', ()=>{
    const result = ExpressionAttributeValuesFromObject({asd:123,qwert:987})
    expect(result[':asd']).toBe(123)
    expect(result[':qwert']).toBe(987)
  })
})
describe('ExpressionAttributeNamesFromList',()=>{
  it('ExpressionAttributeNamesFromList', ()=>{
    const result = ExpressionAttributeNamesFromList(['asd','qwert'])
    expect(result['#asd']).toBe('asd')
    expect(result['#qwert']).toBe('qwert')
  })
})

describe('generateProjectionExpressionFromList',()=>{
  it('generateProjectionExpressionFromList', ()=>{
    const result = generateProjectionExpressionFromList(['asd','qwert'])
    expect(result).toBe('#asd, #qwert')
  })
})
describe('parseObjectToPrependedKey',()=>{
  it('parseObjectToPrependedKey', ()=>{
    const result = parseObjectToPrependedKey({asd:123, qwert:987})
    expect(result[':asd']).toBe(123)
  })
})
describe('UpdateExpressionGenerator',()=>{
  it('UpdateExpressionGenerator', ()=>{
    const result = UpdateExpressionGenerator(['asd','qwert'])
    expect(result).toBe('SET #asd = :asd, #qwert = :qwert')
  })
})

