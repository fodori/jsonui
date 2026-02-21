import React from 'react'
import { JsonUI } from '../index'
import { uniqueId } from 'lodash'

// Example of async functions usage in JsonUI

const AsyncExample = () => {
  // Custom async function examples
  const customAsyncFunctions = {
    // API fetch function
    fetchUserData: async (attr: any) => {
      const { userId } = attr
      console.log('Fetching user data for user ID00000:', userId)
      await new Promise((resolve) => setTimeout(resolve, 400))

      console.log(`Fetched user data for user ID11111: ${userId}`)
      return `Fetched user data for user ID: ${userId}`
    },

    // Async validation
    validateEmail: async (attr: any, props: any, callerArgs: any) => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      // console.log('validateEmail', attr, props, callerArgs)
      const email = attr.email
      if (!email) return { isValid: false, error: 'Email is required' }

      // Simulate API validation
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      return isValid ? null : `Invalid email format ${uniqueId()}`
    },

    // File upload
    uploadFile: async (attr: any, props: any, callerArgs: any) => {
      const file = callerArgs[0]
      if (!file) throw new Error('No file provided')

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      return response.json()
    },
  }

  // Mark functions as async for JsonUI system
  customAsyncFunctions.fetchUserData.isAsync = true
  customAsyncFunctions.validateEmail.isAsync = true
  customAsyncFunctions.uploadFile.isAsync = true

  // JsonUI definition with async operations
  const uiDefinition = {
    $comp: 'Edit',
    value: {
      $modifier: 'get',
      store: 'form',
      path: '/email',
    },
    onChange: {
      $action: 'set',
      store: 'form',
      path: '/email',
    },
    fieldTouched: true,
    fieldErrors: {
      $modifier: 'validateEmail',
      email: {
        $modifier: 'get',
        store: 'form',
        path: '/email',
      },
    },
  }

  const defaultValues = {
    form: {
      email: 'fodori@',
    },
    ui: {
      message: '',
    },
  }

  return <JsonUI model={uiDefinition} defaultValues={defaultValues} functions={customAsyncFunctions} />
}

export default AsyncExample
