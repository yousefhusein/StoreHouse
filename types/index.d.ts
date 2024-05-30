declare module '*.{png,jpg,jpeg,webp,avif}';

declare type ItemType = 'text' | 'password' | 'image'

declare interface EncryptedItem {
  id: string
  vaultId: string
  data: string
}

declare interface Item {
  id: string
  vaultId: string
  label: string
  type: ItemType
  value: string
}

declare interface Vault {
  id: string
  title: string
  description: string
  algorithm: 'aes'
  password: string
  updatedAt: Date
}

declare type theme = 'light' | 'dark' | 'system'

declare interface BuildData extends Vault {
  items: EncryptedItem[]
}
