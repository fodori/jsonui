import { useState, useEffect, useRef } from 'react'
import { Stock } from '@jsonui/core'

interface AsyncActionState {
  isLoading: boolean
  error: Error | null
  data: any
}

interface AsyncActionOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function useAsyncAction(stock: InstanceType<typeof Stock>, functionName: string, defaultParams: any = {}, options: AsyncActionOptions = {}) {
  const [state, setState] = useState<AsyncActionState>({
    isLoading: false,
    error: null,
    data: null,
  })

  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const execute = async (params: any = {}, props: any = {}, callerArgs: any[] = []) => {
    if (!stock || !stock.isAsyncFunction(functionName)) {
      throw new Error(`Function ${functionName} is not registered as async`)
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await stock.callFunctionAsync(functionName, { ...defaultParams, ...params }, props, callerArgs)

      if (isMountedRef.current) {
        setState({
          isLoading: false,
          error: null,
          data: result,
        })

        options.onSuccess?.(result)
      }

      return result
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))

      if (isMountedRef.current) {
        setState({
          isLoading: false,
          error: errorObj,
          data: null,
        })

        options.onError?.(errorObj)
      }

      throw errorObj
    }
  }

  // Auto-execute on mount if immediate is true
  useEffect(() => {
    if (options.immediate) {
      execute()
    }
  }, [])

  return {
    ...state,
    execute,
    reset: () => setState({ isLoading: false, error: null, data: null }),
  }
}

export function useAsyncModifier(stock: InstanceType<typeof Stock>, functionName: string, params: any, dependencies: any[] = []) {
  const [state, setState] = useState<AsyncActionState>({
    isLoading: true,
    error: null,
    data: null,
  })

  useEffect(() => {
    let cancelled = false

    const executeModifier = async () => {
      if (!stock) return

      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }))

        let result
        if (stock.isAsyncFunction(functionName)) {
          result = await stock.callFunctionAsync(functionName, params, {}, [])
        } else {
          result = stock.callFunction(functionName, params, {}, [])
        }

        if (!cancelled) {
          setState({
            isLoading: false,
            error: null,
            data: result,
          })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            isLoading: false,
            error: error instanceof Error ? error : new Error(String(error)),
            data: null,
          })
        }
      }
    }

    executeModifier()

    return () => {
      cancelled = true
    }
  }, [stock, functionName, ...dependencies])

  return state
}
