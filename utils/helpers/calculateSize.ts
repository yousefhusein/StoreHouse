import prettyBytes from 'pretty-bytes'

export function calculateVaultSize(vaultId: string) {
  const vault = getVaultById(vaultId)

  if (!vault)
    return null

  const items = getItemList(vaultId)

  let string = ''

  for (const [key, value] of Object.entries(vault))
    string += key + value

  return calculateStringSize(string) + items.reduce((a, b) => a + (calculateItemSize(b) || 0), 0)
}

export function calculateItemSize(item: EncryptedItem) {
  if (!item)
    return null

  let string = ''

  for (const [key, value] of Object.entries(item))
    string += key + value

  return calculateStringSize(string)
}

export function calculateStringSize(string: string) {
  return new Blob([string]).size
}
