export function download(fileName: string, extension: string, content: string) {
  const blob = new Blob([content], { type: 'text/yaml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${fileName}.${extension}`
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}
