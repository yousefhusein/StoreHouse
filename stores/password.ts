import { defineStore } from 'pinia'

export const usePasswordStore = defineStore('counter', {
  state: () => {
    return {
      plainTextPassword: {},
    } as {
      plainTextPassword: Record<string, string | null>
    }
  },
  actions: {
    setPassword(plainTextPassword: string, vaultId: string) {
      this.plainTextPassword[vaultId] = plainTextPassword
    },
    getPassword(vaultId: string): string | null {
      return this.plainTextPassword[vaultId] ?? null
    },
    hasPassword(vaultId: string): boolean {
      return Boolean(this.plainTextPassword[vaultId])
    },
  },
})
