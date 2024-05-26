export function isValidVault(vault: Record<string, any>): boolean {
  if (typeof vault.id !== 'string' || !vault.id)
    return false

  if (typeof vault.title !== 'string' || !vault.title)
    return false

  if (typeof vault.description !== 'string' || !vault.description)
    return false

  if (typeof vault.algorithm !== 'string' || !['aes'].includes(vault.algorithm))
    return false

  return true
}

export function isValidDecryptedItem(item: Record<string, any>): boolean {
  if (typeof item.label !== 'string' || !item.label)
    return false

  if (typeof item.vaultId !== 'string' || !item.label)
    return false

  if (typeof item.type !== 'string' || !['text', 'password'].includes(item.type))
    return false

  if (typeof item.value !== 'string')
    return false

  return true
}

export function isValidItem(item: Record<string, any>): boolean {
  const vault = getVaultById(item.vaultId)
  return vault ? typeof item.data === 'string' : false
}

export function getVaultList(): Vault[] {
  const stringVaults = localStorage.getItem('storehouse-vaults') || '[]'

  if (typeof stringVaults !== 'string')
    throw new Error('syntax error')

  const vaults = JSON.parse(stringVaults) as Vault[]
  const output: Vault[] = []

  for (const vault of vaults) {
    if (isValidVault(vault))
      output.push(vault)
    else
      throw new Error('syntax error')
  }

  return output
}

export function getItemList(vaultId: string) {
  const stringItems = localStorage.getItem('storehouse-items') || '[]'

  if (typeof stringItems !== 'string')
    throw new Error('syntax error')

  let items = JSON.parse(stringItems) as EncryptedItem[]
  items = items.filter(x => x.vaultId === vaultId)
  const output: EncryptedItem[] = []

  for (const item of items) {
    if (isValidItem(item))
      output.push(item)
    else
      throw new Error('syntax error')
  }

  return output
}

export function getItems() {
  const stringItems = localStorage.getItem('storehouse-items') || '[]'

  if (typeof stringItems !== 'string')
    throw new Error('syntax error')

  const items = JSON.parse(stringItems) as EncryptedItem[]
  const output: EncryptedItem[] = []

  for (const item of items) {
    if (isValidItem(item))
      output.push(item)
    else
      throw new Error('syntax error')
  }

  return output
}

export function createNewVaultItem(vaultId: string, item: EncryptedItem): void {
  if (isValidItem(item)) {
    const items = getItems()

    if (!Array.isArray(items))
      throw new Error('something error')

    items.push(item)
    saveVaultItems(items)
  }
}

export function createNewVault(details: Vault, callbackfn: (vault: Vault[]) => void) {
  if (isValidVault(details)) {
    const vaults = getVaultList()
    vaults.push(details)
    saveVaults(vaults)
    callbackfn(vaults)
  }
}

export function getVaultById(id: string) {
  const vaults = getVaultList()
  return vaults.filter(x => x.id === id)[0] || null
}

export function saveVaults(vaults: Vault[]) {
  const stringify = JSON.stringify(vaults)
  localStorage.setItem('storehouse-vaults', stringify)
}

export function saveVaultItems(items: EncryptedItem[]) {
  const stringify = JSON.stringify(items)
  localStorage.setItem(`storehouse-items`, stringify)
}
