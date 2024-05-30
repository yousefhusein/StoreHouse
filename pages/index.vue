<script setup lang="ts">
import { v4 } from 'uuid'
import moment from 'moment'
import prettyBytes from 'pretty-bytes'
import { hash } from '@yousefhusain/md5'
import { vaultSchema } from '~/validators/vault'
import { calculateVaultSize } from '~/utils/helpers/calculateSize'

declare const createVaultModal: HTMLDialogElement

const passwordStore = usePasswordStore()
const vaults = ref<Vault[]>([])
const title = ref('')
const description = ref('')
const password = ref('')
const hashedPassword = ref('')
const items = ref<EncryptedItem[]>([])
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
  hashedPassword.value = ''
}

function handleClick(vaultId: string) {
  router.push(`/vaults/${vaultId}`)
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
    id: v4(),
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
        router.push(`/vaults/${value.id}`)
      })
    }
  }
  else {
    errorMessage.value = error.message
  }
}

function downloadVault(label: string, vaultId: string) {
  const data = buildVault(vaultId)
  if (data) {
    const filename = `${label}-${vaultId}.yaml`
    const blob = new Blob([data], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename

    // Programmatically click the link to start the download
    link.click()

    // Clean up the URL object after the download
    URL.revokeObjectURL(url)
  }
}

onMounted(() => {
  vaults.value = getVaultList()
})
</script>

<template>
  <UIContainer class="pb-3 h-full">
    <UICard>
      <UICardHeader class="justify-center">
        <UITypography class="text-xl font-black">
          Vaults
        </UITypography>
      </UICardHeader>
      <UICardContent>
        <div class="flex flex-wrap overflow-auto" aria-label="vaults">
          <UIItem
            v-for="item in vaults"
            :key="item?.id"
            :description="item.description"
            :label="item.title"
            :footer-text-start="`Updated At: ${moment(item.updatedAt).format('YYYY/MM/DD hh:mm A')}`"
            :footer-text-end="prettyBytes(calculateVaultSize(item.id)!)"
            class="md:w-1/2 lg:w-1/3"
          >
            <UIIconButton class="text-white" icon="heroicons:arrow-down-tray" @click="downloadVault(item.title, item.id)" />
            <UIIconButton class="text-white" icon="heroicons:pencil-square" @click="handleClick(item.id)" />
          </UIItem>
          <span v-if="!vaults.length">
            You don't have any vaults yet, <a href="#" class="text-blue-600" @click="$event.preventDefault(), handleShowModal()">Create One</a>.
          </span>
        </div>
      </UICardContent>
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
      <UITextInput id="title" v-model="title" autocomplete="name" placeholder="My Vault" />
    </FormsGroup>

    <FormsGroup id="password" label="Password" required>
      <UITextInput id="password" v-model="password" autocomplete="current-password" type="password" placeholder="Password" />
    </FormsGroup>

    <FormsGroup id="description" label="Description" required>
      <UITextInput id="description" v-model="description" placeholder="Enter a text..." />
    </FormsGroup>

    <FormsGroup id="file" label="File" required>
      <UITextInput id="file" type="file" placeholder="Password" accept=".aes,.yaml,.yml" @change="handleChange($event)" />
    </FormsGroup>

    <p class="text-red-700">
      {{ errorMessage }}
    </p>
  </AlertsModal>
</template>
