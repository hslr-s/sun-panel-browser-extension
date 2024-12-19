import { removeTrailingSlash } from '@/util/cmn'

interface RequestParam {
  url: string
  headers?: HeadersInit
  data: any
}

interface PostResponse<T> {
  code: number
  headers?: HeadersInit
  data: T
}

interface OpenAPIConfig {
  host: string
  token: string
}

let openApiConfig: OpenAPIConfig = {
  host: '',
  token: '',
}

// 获取openApiConfig
getOpenApiConfig()

// async function httpPost({ url, headers = {}, data }: PostRequestParam) {
//   return await fetch(url, {
//     method: 'POST',
//     headers,
//     body: JSON.stringify(data), // 确保data是json字符串
//   })
// }

export async function postRequest<T>({ url, headers = {}, data }: RequestParam): Promise<PostResponse<T>> {
  const combinedHeaders = Object.assign({ 'Content-Type': 'application/json' }, headers)

  const response = await fetch(url, {
    method: 'POST',
    headers: combinedHeaders,
    body: JSON.stringify(data), // 确保data是json字符串
  })

  if (!response.ok) {
    // 如果响应码不是200范围内的，抛出一个错误
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const jsonResponse: PostResponse<T> = await response.json()

  if (jsonResponse.code !== 0) {
    // 如果业务逻辑的code不是0，返回一个被拒绝的Promise
    return Promise.reject(jsonResponse)
  }

  return jsonResponse
}

async function getOpenApiConfig() {
  await storage.getItem<OpenAPIConfig>('local:openAPIConfig').then((cfg) => {
    if (cfg) {
      openApiConfig = cfg as OpenAPIConfig
    }
  })
}

export async function postOpenApiRequest<T>({ url, headers = {}, data }: RequestParam): Promise<PostResponse<T>> {
  // if (openApiConfig.host === '' || openApiConfig.token === '') {
  //   getOpenApiConfig()
  // }

  // console.log(openApiConfig);

  (headers as Record<string, string>).token = openApiConfig.token
  url = removeTrailingSlash(openApiConfig.host) + url
  return postRequest<T>({ url, headers, data })
}
