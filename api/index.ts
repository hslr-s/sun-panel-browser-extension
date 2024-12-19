import { postOpenApiRequest, postRequest } from '@/util/request'

export function getSunPanelVersion<T>(host?: string, token?: string) {
  if (host && token && host !== '' && token !== '') {
    return postRequest<T>({
      url: `${host}/version`,
      headers: {
        token: `${token}`,
      },
      data: {},
    })
  }
  return postOpenApiRequest<T>({
    url: '/version',
    data: {},
  })
}
