<script setup lang="ts">
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
      createNewVaultItem(vault.value.id, {
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
    if (pass && compareHash(pass, vault.value?.password as string)) {
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
  const storedPassword = passwordStore.getPassword(vault.value.id)
  if (storedPassword && compareHash(storedPassword, vault.value.password)) {
    password.value = storedPassword
    updateItems()
  }
  else { requestPassword() }

  if (!vault.value)
    return navigateTo('/')
})
</script>

<template>
  <UIContainer class="mt-0">
    <UICard v-if="vault && password" :header-title="vault.title">
      <div class="flex flex-wrap max-h-[500px] overflow-auto" aria-label="vaults">
        <h1 v-if="!items || items.length < 1">
          Your vault currently empty
        </h1>
        <div v-for="item in items" v-else :key="item.id" class="p-2 w-full md:w-1/2 lg:w-1/3">
          <div class="border rounded-lg flex flex-row items-center justify-between p-4 dark:border-gray-600">
            <div class="w-full me-2">
              <p class="font-semibold">
                {{ item.label }}
              </p>
              <small>{{ item.value }}</small>
            </div>
            <div class="flex gap-2">
              <UIIconButton class="text-white bg-red-700" icon="heroicons:trash" @click="handleDeleteItem(item.id)" />
              <!-- <UIIconButton class="text-white" icon="heroicons:pencil-square" @click="handleClick(item.id)" /> -->
            </div>
          </div>
        </div>
      </div>
    </UICard>
  </UIContainer>
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
</template>
