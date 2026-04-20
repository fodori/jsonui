import type { FunctionHandler } from '@jsonui/core'
import axiosHttp from 'axios'
import type { AxiosRequestConfig } from 'axios'

/** Axios HTTP client exposed as a JsonUI `$action` handler (`$action: "axios"`). */
const axios: FunctionHandler = (params) => axiosHttp(params as AxiosRequestConfig)

export default axios
