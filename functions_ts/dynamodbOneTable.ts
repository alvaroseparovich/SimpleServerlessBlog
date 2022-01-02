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

export function generateExpressionAttributeValuesFromList(list){
  const finalObject = {}
  list.map(value => finalObject[`:${value}`] = value)
  return finalObject
}
export function ExpressionAttributeNamesFromList(list:string[]) {
  const finalObject = {}
  list.map(value => finalObject[`#${value}`] = value)
  return finalObject
}
export function generateProjectionExpressionFromList(list:string[]){
  return list.map(value => `#${value}`).join(', ')
}