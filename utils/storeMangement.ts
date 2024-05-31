import yaml from 'js-yaml'
import { vaultSchemaHashedPassword } from '~/validators/vault'

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

export function getVaultItemsCount(vaultId: string) {
  const items = getItemList(vaultId)
  return items?.length || 0
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

export function addItems(items: EncryptedItem[]) {
  const itemList = getItems()
  items && itemList.push(...items)
  saveVaultItems(itemList)
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

export function buildVault(vaultId: string) {
  const vault = getVaultById(vaultId)

  if (vault) {
    const items = getItemList(vaultId) as EncryptedItem[]
    const data = {
      ...vault,
      items: items.map(e => removeProp(removeProp(e, 'vaultId'), 'id')),
    }

    return yaml.dump(removeProp(data, 'id'))
  }

  return null
}

export function unbuildVault(data: string): { vault: Vault, items: EncryptedItem[] } | null {
  try {
    const parsedData: BuildData = yaml.load(data) as BuildData
    const vault: Vault = {
      ...parsedData,
      id: generateId(),
    }
    const items = parsedData.items

    return {
      vault,
      items: items.filter(e => e).map(i => ({
        ...i,
        vaultId: vault.id,
        id: generateId(),
      })),
    }
  }
  catch {
    return null
  }
}
