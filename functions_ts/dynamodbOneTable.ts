export function insertValues(Instancia, atributesObject) {
  Object.entries(atributesObject).map(([key, value]) =>{
    Instancia[key] = value
  })
  return Instancia
}
