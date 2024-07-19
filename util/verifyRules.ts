export function isValidHttpUrl(url: string): boolean {
  let httpUrl: URL

  try {
    httpUrl = new URL(url)
  }
  catch (e) {
    console.error(e)
    return false
  }

  return httpUrl.protocol === 'http:' || httpUrl.protocol === 'https:'
}
