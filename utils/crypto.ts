import CryptoJS from 'crypto-js'

export function encryptItem(item: Item, password: string) {
  const data = CryptoJS.AES.encrypt(JSON.stringify(item), password)
  return data.toString()
}

export function decryptItem(item: EncryptedItem, password: string): Item | null {
  const data = CryptoJS.AES.decrypt(item.data, password)
  try {
    return JSON.parse(data.toString(CryptoJS.enc.Utf8))
  }
  catch {
    return null
  }
}
