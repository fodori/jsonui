import { ActionHandler } from '@jsonui/react'
import axiosHttp from 'axios'
import type { AxiosRequestConfig } from 'axios'

/** Axios HTTP client exposed as a JsonUI `$action` handler (`$action: "axios"`). */
const axios: ActionHandler = (params) => axiosHttp(params as AxiosRequestConfig)

export default axios
