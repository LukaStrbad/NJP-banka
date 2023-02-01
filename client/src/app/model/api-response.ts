export interface ApiResponse {
  success: boolean,
  status: number | string,
  token?: string,
  userInfo?: UserTokenInfo,
  value?: any,
  description: string
}

export interface UserTokenInfo {
  id: number,
  email: string,
  firstName: string,
  lastName: string,
  isAdmin: boolean
}
