import React from 'react'
import { JsonUI } from '@jsonui/react'

// Example of async functions usage in JsonUI

const AsyncExample = () => {
  // Custom async function examples
  const customAsyncFunctions = {
    // API fetch function
    fetchUserData: async (attr: any) => {
      const { userId } = attr
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      return response.json()
    },

    // Async validation
    validateEmail: async (attr: any, props: any, callerArgs: any) => {
      const email = callerArgs[0] || attr.email
      if (!email) return { isValid: false, error: 'Email is required' }

      // Simulate API validation
      await new Promise((resolve) => setTimeout(resolve, 500))
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      return { isValid, error: isValid ? null : 'Invalid email format' }
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
  const uiDefinition = [
    {
      $comp: 'Paper',
      style: { padding: '20px', margin: '10px' },
      $children: [
        {
          $comp: 'Text',
          variant: 'h4',
          $children: 'Async JsonUI Example',
        },

        // User data section with async loading
        {
          $comp: 'View',
          style: { marginTop: '20px' },
          $children: [
            {
              $comp: 'Text',
              variant: 'h6',
              $children: 'User Information',
            },
            {
              $comp: 'Text',
              $children: {
                $modifier: 'fetchUserData',
                userId: 123,
              },
            },
          ],
        },

        // Email validation form
        {
          $comp: 'View',
          style: { marginTop: '20px' },
          $children: [
            {
              $comp: 'TextField',
              $childLabel: 'Email Address',
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
              fieldErrors: {
                $modifier: 'validateEmail',
                email: {
                  $modifier: 'get',
                  store: 'form',
                  path: '/email',
                },
              },
            },
            {
              $comp: 'Button',
              $children: 'Validate Email',
              onClick: {
                $action: 'validateEmail',
                email: {
                  $modifier: 'get',
                  store: 'form',
                  path: '/email',
                },
              },
            },
          ],
        },

        // File upload section
        {
          $comp: 'View',
          style: { marginTop: '20px' },
          $children: [
            {
              $comp: 'Button',
              $children: 'Upload File',
              onClick: {
                $action: 'uploadFile',
              },
            },
          ],
        },

        // HTTP requests examples
        {
          $comp: 'View',
          style: { marginTop: '20px' },
          $children: [
            {
              $comp: 'Button',
              $children: 'Fetch Data (GET)',
              onClick: {
                $action: 'httpGet',
                url: 'https://jsonplaceholder.typicode.com/posts/1',
              },
            },
            {
              $comp: 'Button',
              $children: 'Submit Data (POST)',
              style: { marginLeft: '10px' },
              onClick: {
                $action: 'httpPost',
                url: 'https://jsonplaceholder.typicode.com/posts',
                data: {
                  title: 'foo',
                  body: 'bar',
                  userId: 1,
                },
              },
            },
          ],
        },

        // Async delay example
        {
          $comp: 'View',
          style: { marginTop: '20px' },
          $children: [
            {
              $comp: 'Button',
              $children: 'Delayed Action (2s)',
              onClick: [
                {
                  $action: 'delay',
                  ms: 2000,
                },
                {
                  $action: 'set',
                  store: 'ui',
                  path: '/message',
                  value: 'Delayed action completed!',
                },
              ],
            },
            {
              $comp: 'Text',
              style: { marginTop: '10px' },
              $children: {
                $modifier: 'get',
                store: 'ui',
                path: '/message',
              },
            },
          ],
        },
      ],
    },
  ]

  const defaultValues = {
    form: {
      email: '',
    },
    ui: {
      message: '',
    },
  }

  return <JsonUI model={uiDefinition} defaultValues={defaultValues} functions={customAsyncFunctions} />
}

export default AsyncExample
