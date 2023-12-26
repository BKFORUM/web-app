const base64StringToBlob = (base64String: string): Blob | null => {
    const byteString = atob(base64String.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: 'image/png' })
}

export { base64StringToBlob }