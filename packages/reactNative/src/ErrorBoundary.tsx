import React from 'react'
import { Text, View } from 'react-native'

const printObj = (obj: any) => (typeof obj === 'string' ? obj : JSON.stringify(obj))

export interface ErrorBoundaryProps extends React.Props<any> {
  type?: string
  id?: string
}

type errorType = any

export interface ErrorBoundaryState {
  hasError: boolean
  error?: errorType
  didInfo?: any
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: errorType) {
    return {
      hasError: true,
      error: error && error.message ? error.message : error,
    }
  }

  componentDidCatch(error: errorType, info: any) {
    this.setState({ didInfo: info.componentStack })
  }

  render() {
    const { hasError, error, didInfo } = this.state
    const { type, id, children } = this.props
    if (hasError) {
      if (type === 'component') {
        return (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              borderColor: 'orange',
              borderWidth: 2,
            }}
          >
            <View>
              <View style={{ backgroundColor: 'red', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, padding: 2 }}>
                  {id}
                  Error:
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 10, padding: 2 }}> {printObj(error)}</Text>
              </View>
            </View>
          </View>
        )
      }
      return (
        <View style={{ flexDirection: 'column', margin: 20, height: '100%' }}>
          <View>
            <View
              style={{
                flex: 1,
                backgroundColor: 'red',
                padding: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 30 }}>
                Error type:
                {type}
                {id}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 20, marginTop: 30 }}>{printObj(error)}</Text>
            </View>
            <View>
              <Text style={{ marginTop: 20 }}>{printObj(didInfo)}</Text>
            </View>
          </View>
        </View>
      )
    }
    return children
  }
}
export default ErrorBoundary
