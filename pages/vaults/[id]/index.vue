<script setup lang="ts">
import { compare } from '@yousefhusain/md5'
import { itemSchema } from '~/validators/item'

declare const createVaultModal: HTMLDialogElement
declare const editItemModal: HTMLDialogElement

const passwordStore = usePasswordStore()
const route = useRoute()
const vault = ref<Vault | null>(null)
const label = ref('')
const value = ref('')
const items = ref<Item[] | null>(null)
const mounted = ref<boolean>(false)
const password = ref<string | null>(null)
const currentItem = ref<Item | null>(null)
const errorMessage = ref('')
const editorLabel = ref('')
const editorValue = ref('')

function handleCloseModal() {
  createVaultModal.close()
}

function handleEditItem() {
  if (currentItem.value && password.value) {
    editItem(currentItem.value.id, password.value, {
      label: editorLabel.value,
      value: editorValue.value,
    }, (error) => {
      if (error) {
        errorMessage.value = error.message
      }
      else {
        resetInputs()
        updateItems()
        handleCloseEditItemModal()
      }
    })
  }
}

function handleOpenEditItem(itemId: string) {
  if (items.value) {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      currentItem.value = item
      editorLabel.value = currentItem.value.label
      editorValue.value = currentItem.value.value
      editItemModal.showModal()
    }
  }
}

function handleCloseEditItemModal() {
  editItemModal.close()
  editorLabel.value = ''
  editorValue.value = ''
}

function resetInputs() {
  label.value = ''
  value.value = ''
  editorLabel.value = ''
  editorValue.value = ''
  errorMessage.value = ''
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

function requestPassword() {
  // eslint-disable-next-line no-alert
  const pass = prompt('Enter your password:')

  if (typeof pass === 'string') {
    if (pass && compare(pass.trim(), vault.value?.password as string)) {
      password.value = pass.trim()
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
  <CardContainer v-if="vault && password">
    <CardHeader class="justify-between">
      <Typography class="text-xl font-black">
        {{ vault.title }}
      </Typography>
      <IconButton icon="heroicons:trash" class="bg-red-700 text-white" @click="handleDelete" />
    </CardHeader>
    <CardContent>
      <div class="flex flex-col md:flex-row md:flex-wrap">
        <Typography v-if="!items || items.length < 1" h5>
          Your vault currently empty
        </Typography>
        <Item
          v-for="item in items"
          v-else
          :key="item.id"
        >
          <template #content>
            <p>{{ item.label }}</p>
            <small>{{ item.value }}</small>
          </template>
          <template #actions>
            <IconButton class="bg-red-700 text-white" icon="heroicons:trash" @click="handleDeleteItem(item.id)" />
            <IconButton class="text-white" icon="heroicons:pencil-square" @click="handleOpenEditItem(item.id)" />
          </template>
          <template #footer>
            <small>Item</small>
          </template>
        </Item>
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

    <Typography class="text-red-700">
      {{ errorMessage }}
    </Typography>
  </AlertModal>

  <AlertModal
    id="editItemModal"
    header-title="Editor"
    :handle-close-modal="handleCloseEditItemModal"
    :handle-submit="handleEditItem"
    submit-button-text="Save"
  >
    <FormGroup label="Label">
      <FormInput v-model="editorLabel" type="text" placeholder="Enter a label" autocomplete="off" />
    </FormGroup>

    <FormGroup label="Value">
      <FormInput v-model="editorValue" type="text" placeholder="Enter a value" autocomplete="off" />
    </FormGroup>

    <Typography class="text-red-700">
      {{ errorMessage }}
    </Typography>
  </AlertModal>
</template>
