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