<script setup lang="ts">
import { compare } from '@yousefhusain/md5'
import { v4 } from 'uuid'
import { itemSchema } from '~/validators/item'

declare const createVaultModal: HTMLDialogElement

const passwordStore = usePasswordStore()
const route = useRoute()
const router = useRouter()
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
      id: v4(),
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
    router.push('/')
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
</script>

<template>
  <UIContainer class="pb-3 h-full overflow-hidden">
    <UICard v-if="vault && password" class="h-full">
      <UICardHeader class="justify-between">
        <UITypography class="text-xl font-black">
          {{ vault.title }}
        </UITypography>
        <UIIconButton icon="heroicons:trash" class="bg-red-700 text-white" />
      </UICardHeader>
      <UICardContent>
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
            <UIIconButton class="text-white bg-red-700" icon="heroicons:trash" @click="handleDeleteItem(item.id)" />
          </UIItem>
        </div>
      </UICardContent>
    </UICard>
    <AlertsModal
      v-if="password"
      id="createVaultModal"
      :handle-close-modal="handleCloseModal"
      :handle-submit="handleCreateItem"
      header-title="Create An Item"
      submit-button-text="Create"
    >
      <FormsGroup id="label" label="Label" required>
        <UITextInput id="label" v-model="label" placeholder="Username, Email, Label" />
      </FormsGroup>

      <!-- <FormsGroup id="password" label="Password" required>
        <UITextInput id="password" v-model="password" type="password" placeholder="Password" />
      </FormsGroup> -->

      <FormsGroup id="value" label="Value" required>
        <UITextInput id="value" v-model="value" placeholder="Enter a value" />
      </FormsGroup>

      <p class="text-red-700">
        {{ errorMessage }}
      </p>
    </AlertsModal>
  </UIContainer>
</template>
