export default function removeProp(obj: Record<string, any>, prop: string) {
  if (Object.prototype.hasOwnProperty.call(obj, prop))
    delete obj[prop]

  return obj
}
