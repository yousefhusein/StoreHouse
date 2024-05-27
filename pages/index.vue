<script setup lang="ts">
import { v4 } from 'uuid'
import moment from 'moment'
import { vaultSchema } from '~/validators/vault'
import { calculateVaultSize, prettySize } from '~/utils/helpers/calculateSize'

declare const createVaultModal: HTMLDialogElement

const passwordStore = usePasswordStore()
const vaults = ref<Vault[]>([])
const title = ref('')
const description = ref('')
const password = ref()
const errorMessage = ref('')
const router = useRouter()

function handleCloseModal() {
  createVaultModal.close()
}

function handleShowModal() {
  resetInputs()
  createVaultModal.showModal()
}

function resetInputs() {
  errorMessage.value = ''
  title.value = ''
  description.value = ''
  password.value = ''
}

function handleClick(vaultId: string) {
  router.push(`/vaults/${vaultId}`)
}

function handleCreateVault() {
  const { error, value } = vaultSchema.validate({
    id: v4(),
    title: title.value,
    password: password.value,
    description: description.value,
    updatedAt: new Date(),
  })

  if (!error) {
    errorMessage.value = ''

    createNewVault({
      title: value.title,
      description: description.value,
      algorithm: 'aes',
      id: value.id,
      updatedAt: value.updatedAt,
      password: hash(password.value!),
    }, (vaultList) => {
      vaults.value = vaultList
      passwordStore.setPassword(password.value, value.id)
      handleCloseModal()
      resetInputs()
      router.push(`/vaults/${value.id}`)
    })
  }
  else {
    errorMessage.value = error.message
  }
}

onMounted(() => {
  vaults.value = getVaultList()
})
</script>

<template>
  <UIContainer class="pb-3 h-full">
    <UICard header-title="Vaults">
      <div class="flex flex-wrap max-h-[500px] overflow-auto" aria-label="vaults">
        <UIItem
          v-for="item in vaults"
          :key="item?.id"
          :description="item.description"
          :label="item.title"
          :footer-text-start="`Updated At: ${moment(item.updatedAt).format('YYYY/MM/DD hh:mm A')}`"
          :footer-text-end="prettySize(calculateVaultSize(item.id)!)"
          class="md:w-1/2 lg:w-1/3"
        >
          <UIIconButton class="text-white" icon="heroicons:arrow-down-tray" />
          <UIIconButton class="text-white" icon="heroicons:pencil-square" @click="handleClick(item.id)" />
        </UIItem>
        <span v-if="!vaults.length">
          You don't have any vaults yet, <a href="#" class="text-blue-600" @click="$event.preventDefault(), handleShowModal()">Create One</a>.
        </span>
      </div>
    </UICard>
  </UIContainer>
  <AlertsModal
    id="createVaultModal"
    :handle-close-modal="handleCloseModal"
    :handle-submit="handleCreateVault"
    header-title="Create A Vault"
    submit-button-text="Create"
  >
    <FormsGroup id="title" label="Title" required>
      <UITextInput id="title" v-model="title" placeholder="My Vault" />
    </FormsGroup>

    <FormsGroup id="password" label="Password" required>
      <UITextInput id="password" v-model="password" type="password" placeholder="Password" />
    </FormsGroup>

    <FormsGroup id="description" label="Description" required>
      <UITextInput id="description" v-model="description" placeholder="Enter a text..." />
    </FormsGroup>

    <FormsGroup id="file" label="File" required>
      <UITextInput id="file" type="file" placeholder="Password" accept=".aes" />
    </FormsGroup>

    <p class="text-red-700">
      {{ errorMessage }}
    </p>
  </AlertsModal>
</template>
