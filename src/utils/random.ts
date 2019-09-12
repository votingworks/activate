export function randomBase64(numBytes: number = 16): string {
  // get random values to fill an array of prescribed length, b64 encode it, and strip the '=' at the end.
  return window
    .btoa(
      String.fromCharCode.apply(undefined, (window.crypto.getRandomValues(
        new Uint8ClampedArray(numBytes)
      ) as unknown) as number[])
    )
    .replace(/=+$/, '')
}

export default { randomBase64 }
