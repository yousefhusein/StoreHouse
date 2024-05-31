<script setup lang="ts">
import { compare } from '@yousefhusain/md5'
import { itemSchema } from '~/validators/item'

declare const createVaultModal: HTMLDialogElement

const passwordStore = usePasswordStore()
const route = useRoute()
const vault = ref<Vault | null>(null)
const label = ref('')
const value = ref('')
const items = ref<Item[] | null>(null)
const mounted = ref<boolean>(false)
const password = ref<string | null>(null)
const errorMessage = ref('')

function handleCloseModal() {
  createVaultModal.close()
}

function resetInputs() {
  label.value = ''
  value.value = ''
}

function updateItems() {
  if (vault.value && password.value) {
    items.value = getItemList(vault.value.id)
      .map(encryptedItem => decryptItem(encryptedItem, password.value!))
      .filter(x => x) as Item[]
  }
}

function handleCreateItem() {
  if (vault.value && password.value) {
    const { error, value: _value } = itemSchema.validate({
      id: generateId(),
      vaultId: vault.value.id,
      type: 'text',
      label: label.value,
      value: value.value,
    })

    if (!error) {
      createNewVaultItem({
        vaultId: _value.vaultId,
        id: _value.id,
        data: encryptItem({
          id: _value.id,
          vaultId: _value.vaultId,
          label: _value.label,
          type: _value.type,
          value: _value.value,
        } as Item, password.value),
      })

      resetInputs()
      updateItems()
      handleCloseModal()
    }
    else {
      errorMessage.value = error.message
    }
  }
}

// function handleShowModal() {
//   createVaultModal.showModal()
// }

function requestPassword() {
  // eslint-disable-next-line no-alert
  const pass = prompt('Enter your password:')

  if (pass && pass.trim()) {
    if (pass && compare(pass, vault.value?.password as string)) {
      password.value = pass
      updateItems()
    }
    else {
      // eslint-disable-next-line no-alert
      alert('Password you entered is incorrect')
      requestPassword()
    }
  }
  else {
    navigateTo('/')
  }
}

function handleDelete() {
  // eslint-disable-next-line no-alert
  if (vault.value && confirm('Are you sure you want to delete this vault? it\'s can\'t be undone.')) {
    const vaults = getVaultList()
    saveVaults(vaults.filter(e => e.id !== vault.value!.id))
    navigateTo('/')
  }
}

function handleDeleteItem(itemId: string) {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete this item? You will not be able to return it later.')) {
    const filter = (x: EncryptedItem | Item) => x.id !== itemId
    if (vault.value && items.value) {
      items.value = items.value.filter(filter)
      saveVaultItems(getItemList(vault.value.id).filter(filter))
    }
  }
}

onMounted(() => {
  vault.value = getVaultById(route.params.id as string)
  mounted.value = true

  if (!vault.value)
    return navigateTo('/')

  const storedPassword = passwordStore.getPassword(vault.value.id)
  if (storedPassword && compare(storedPassword, vault.value.password)) {
    password.value = storedPassword
    updateItems()
  }
  else { requestPassword() }
})

onUnmounted(() => {
  passwordStore.clean()
})
</script>

<template>
  <LayoutContainer class="pb-3 h-full overflow-hidden">
    <CardContainer v-if="vault && password" class="h-full">
      <CardHeader class="justify-between">
        <UITypography class="text-xl font-black">
          {{ vault.title }}
        </UITypography>
        <UIIconButton icon="heroicons:trash" class="bg-red-700 text-white" @click="handleDelete" />
      </CardHeader>
      <CardContent>
        <div class="flex flex-wrap h-full overflow-auto" aria-label="vaults">
          <h1 v-if="!items || items.length < 1">
            Your vault currently empty
          </h1>
          <UIItem
            v-for="item in items"
            v-else
            :key="item.id"
            class="md:w-1/2 lg:w-1/3"
            :label="item.label"
            :description="item.value"
          >
            <UIIconButton class="bg-red-700" icon="heroicons:trash" @click="handleDeleteItem(item.id)" />
            <UIIconButton icon="heroicons:pencil-square" @click="handleDeleteItem(item.id)" />
          </UIItem>
        </div>
      </CardContent>
    </CardContainer>
    <AlertModal
      v-if="password"
      id="createVaultModal"
      :handle-close-modal="handleCloseModal"
      :handle-submit="handleCreateItem"
      header-title="Create An Item"
      submit-button-text="Create"
    >
      <FormGroup label="Label">
        <FormInput v-model="label" autocomplete="off" />
      </FormGroup>

      <FormGroup label="Value">
        <FormInput v-model="value" autocomplete="off" />
      </FormGroup>

      <p class="text-red-700">
        {{ errorMessage }}
      </p>
    </AlertModal>
  </LayoutContainer>
</template>
