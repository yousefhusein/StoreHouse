export function readFileContent(file: File, callbackfn: (error: any, data: string | null) => void) {
  const fileReader = new FileReader()

  fileReader.onload = (event) => {
    callbackfn(null, event.target?.result?.toString() || null)
  }

  fileReader.onerror = err => callbackfn(err, null)

  fileReader.readAsText(file)
}
