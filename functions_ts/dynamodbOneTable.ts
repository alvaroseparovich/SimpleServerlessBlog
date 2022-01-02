interface objWithId {
  id: string
}
interface NoCompositeKeys {
  [key: string]: objWithId
}

export function removeCompositeKeys(payload):NoCompositeKeys {
  const { PK, SK, ...noKeyPayload } = payload

  return { id: PK, ...noKeyPayload }
}

export function atributeToGetFromEvent(selectionSetList) {
  console.log(selectionSetList, typeof selectionSetList)
  if (selectionSetList.includes('id')){
    console.log(Array.isArray(selectionSetList))
    const newSelectionSetList = selectionSetList.filter((value) => (value !== 'id'))
    newSelectionSetList.push('PK')
    return newSelectionSetList
  }
  return selectionSetList
}

export function ExpressionAttributeValuesFromObject(original:Object){
  return parseObjectToPrependedKey(original)
}
export function ExpressionAttributeNamesFromList(list:string[]) {
  return parseListToPrependedKeyMap(list,'#')
}
export function generateProjectionExpressionFromList(list:string[]){
  return list.map(value => `#${value}`).join(', ')
}

export function parseListToPrependedKeyMap(list:string[], prepend:string) {
  const finalObject = {}
  list.map(value => finalObject[`${prepend}${value}`] = value)
  return finalObject
}

export function parseObjectToPrependedKey(original:Object, prepend:string = ':') {
  const arrayOfKeyValues = Object.entries(original)
  const prependedKeys = arrayOfKeyValues.map(([ key, value ]) => [`${prepend}${key}`, value])
  return Object.fromEntries(prependedKeys)
}

export function UpdateExpressionGenerator(list:string[]) {
  return list.reduce((acc, curr, index) => {
    return `${acc}${index === 0 ? ' ' : ', ' }#${curr} = :${curr}`
  }, 'SET')
}