// import { itemSchema } from '~/validators/item'
import { vaultSchemaHashedPassword } from '~/validators/vault'

// function checkItem(item: any): false | Item {
//   const { error, value } = itemSchema.validate(item)
//   if (error) {
//     console.warn(`Skipping ${value.label}, ${error.message}`)
//     return false
//   }
//   else { return value }
// }

function checkVault(vault: any): false | Vault {
  const { error, value } = vaultSchemaHashedPassword.validate(vault)
  if (error) {
    console.warn(`Skipping ${value.title}, ${error.message}`)
    return false
  }
  else {
    return {
      password: vault.password,
      ...value,
    }
  }
}

export function getVaultList(): Vault[] {
  try {
    const stringVaults = localStorage.getItem('storehouse-vaults') || '[]'
    const vaults = JSON.parse(stringVaults) as Vault[]
    const output: Vault[] = []

    for (const vault of vaults) {
      const checkedVault = checkVault(vault)
      checkedVault && output.push(checkedVault)
    }

    return output
  }
  catch (error) {
    saveVaults([])
    return []
  }
}

export function getItemList(vaultId: string) {
  const stringItems = localStorage.getItem('storehouse-items') || '[]'

  if (typeof stringItems !== 'string')
    throw new Error('syntax error')

  let items = JSON.parse(stringItems) as EncryptedItem[]
  items = items.filter(x => x.vaultId === vaultId)
  const output: EncryptedItem[] = []

  for (const item of items)
    output.push(item)

  return output
}

export function getItems() {
  const stringItems = localStorage.getItem('storehouse-items') || '[]'

  if (typeof stringItems !== 'string')
    throw new Error('syntax error')

  const items = JSON.parse(stringItems) as EncryptedItem[]
  const output: EncryptedItem[] = []

  for (const item of items)
    output.push(item)

  return output
}

export function createNewVaultItem(item: EncryptedItem): void {
  const items = getItems()

  if (!Array.isArray(items))
    throw new Error('something error')
  items.push(item)
  saveVaultItems(items)
}

export function createNewVault(details: Vault, callbackfn: (vault: Vault[]) => void) {
  const checkedVaultDetails = checkVault(details)

  if (checkedVaultDetails) {
    const vaults = getVaultList()
    vaults.push(checkedVaultDetails)
    saveVaults(vaults)
    callbackfn(vaults)
  }
}

export function getVaultById(id: string): Vault | null {
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

export function getItemById(id: string): EncryptedItem | null {
  try {
    const items = JSON.parse(localStorage.getItem(id) || '[]') as EncryptedItem[]
    return items.filter(x => x.id === id)[0]
  }
  catch {
    return null
  }
}
