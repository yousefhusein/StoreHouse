<script setup lang="ts">
import moment from 'moment'
import prettyBytes from 'pretty-bytes'
import { hash } from '@yousefhusain/md5'
import { vaultSchema } from '~/validators/vault'

declare const createVaultModal: HTMLDialogElement

const passwordStore = usePasswordStore()
const vaults = ref<Vault[]>([])
const title = ref('')
const description = ref('')
const password = ref('')
const hashedPassword = ref('')
const filePath = ref('')
const items = ref<EncryptedItem[]>([])
const errorMessage = ref('')

function handleCloseModal() {
  resetInputs()
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
  items.value = []
  hashedPassword.value = ''
  filePath.value = ''
}

function handleClick(vaultId: string) {
  navigateTo(`/vaults/${vaultId}`)
}

function handleChange(event: Event) {
  const element = event.target as HTMLInputElement
  if (element.files?.[0]) {
    readFileContent(element.files[0], (error, data) => {
      if (error)
        throw error
      const unbuild = unbuildVault(data!)!
      title.value = unbuild.vault.title
      description.value = unbuild.vault.description
      hashedPassword.value = unbuild.vault.password
      items.value = unbuild.items
    })
  }
}

function handleCreateVault() {
  const { error, value } = vaultSchema.validate({
    id: generateId(),
    title: title.value,
    password: password.value,
    description: description.value,
    updatedAt: new Date(),
  })

  if (!error) {
    if (hashedPassword.value && hashedPassword.value !== hash(value.password)) {
      errorMessage.value = 'Invalid password'
    }
    else {
      errorMessage.value = ''

      createNewVault({
        title: value.title,
        description: description.value,
        algorithm: 'aes',
        id: value.id,
        updatedAt: value.updatedAt,
        password: hash(password.value!),
      }, (vaultList) => {
        if (items.value) {
          addItems(items.value.map(item => ({
            data: item.data,
            id: item.id,
            vaultId: value.id,
          })))
        }

        vaults.value = vaultList
        passwordStore.setPassword(password.value, value.id)
        handleCloseModal()
        resetInputs()
        navigateTo(`/vaults/${value.id}`)
      })
    }
  }
  else {
    errorMessage.value = error.message
  }
}

function downloadVault(label: string, vaultId: string) {
  const data = buildVault(vaultId)
  download(`${label}-${vaultId}`, 'yaml', data!)
}

onMounted(async () => {
  const vaultList = getVaultList()
  vaults.value = vaultList
})
</script>

<template>
  <LayoutContainer class="pb-3 h-full">
    <CardContainer>
      <CardHeader class="justify-center">
        <UITypography class="text-xl font-black">
          Vaults
        </UITypography>
      </CardHeader>
      <CardContent>
        <div class="flex flex-wrap overflow-auto" aria-label="vaults">
          <UIItem
            v-for="item in vaults.sort((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf())"
            :key="item?.id"
            :description="item.description"
            :label="item.title"
            :footer-text-start="`Updated At: ${moment(item.updatedAt).format('YYYY/MM/DD hh:mm A')}`"
            :footer-text-end="`Items (${getVaultItemsCount(item.id)})`"
            class="md:w-1/2 lg:w-1/3"
          >
            <UIIconButton class="text-white" icon="heroicons:arrow-down-tray" @click="downloadVault(item.title, item.id)" />
            <UIIconButton class="text-white" icon="heroicons:pencil-square" @click="handleClick(item.id)" />
          </UIItem>
          <span v-if="!vaults.length">
            You don't have any vaults yet, <a href="#" class="text-blue-600" @click="$event.preventDefault(), handleShowModal()">Create One</a>.
          </span>
        </div>
      </CardContent>
    </CardContainer>
  </LayoutContainer>
  <AlertModal
    id="createVaultModal"
    :handle-close-modal="handleCloseModal"
    :handle-submit="handleCreateVault"
    header-title="Create A Vault"
    submit-button-text="Create"
  >
    <FormGroup label="Title">
      <FormInput v-model="title" autocomplete="off" placeholder="My Vault" />
    </FormGroup>

    <FormGroup label="Password">
      <FormInput v-model="password" autocomplete="off" type="password" placeholder="Password" />
    </FormGroup>

    <FormGroup label="Description">
      <FormInput v-model="description" placeholder="Enter a text..." />
    </FormGroup>

    <FormGroup label="File">
      <FormInput
        v-model="filePath"
        type="file"
        accept=".aes,.yaml,.yml"
        @change="handleChange($event)"
      />
    </FormGroup>

    <UITypography class="text-red-700">
      {{ errorMessage }}
    </UITypography>
  </AlertModal>
</template>
