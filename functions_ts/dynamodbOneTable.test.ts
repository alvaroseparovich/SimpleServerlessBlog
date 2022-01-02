import { ExpressionAttributeNamesFromList, generateExpressionAttributeValuesFromList, generateProjectionExpressionFromList } from './dynamodbOneTable'

describe('generateExpressionAttributeValuesFromList',()=>{
  it('generateExpressionAttributeValuesFromList', ()=>{
    const result = generateExpressionAttributeValuesFromList(['asd','qwert'])
    expect(result[':asd']).toBe('asd')
    expect(result[':qwert']).toBe('qwert')
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
    expect(result).toBe(':asd,:qwert')
  })
})

