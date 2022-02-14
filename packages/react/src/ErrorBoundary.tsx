import React from 'react'

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
          <div
            style={{
              flex: 1,
              flexDirection: 'column',
              borderColor: 'orange',
              borderWidth: 2,
            }}
          >
            <div>
              <div style={{ backgroundColor: 'red', alignItems: 'center' }}>
                <p style={{ fontSize: 12, padding: 2 }}>
                  {id}
                  Error:
                </p>
              </div>
              <div>
                <p style={{ fontSize: 10, padding: 2 }}> {printObj(error)}</p>
              </div>
            </div>
          </div>
        )
      }
      return (
        <div style={{ flexDirection: 'column', margin: 20, height: '100%' }}>
          <div>
            <div
              style={{
                flex: 1,
                backgroundColor: 'red',
                padding: 10,
                alignItems: 'center',
              }}
            >
              <p style={{ fontSize: 30 }}>
                Error type:
                {type}
                {id}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 20, marginTop: 30 }}>{printObj(error)}</p>
            </div>
            <div>
              <p style={{ marginTop: 20 }}>{printObj(didInfo)}</p>
            </div>
          </div>
        </div>
      )
    }
    return children
  }
}
export default ErrorBoundary
