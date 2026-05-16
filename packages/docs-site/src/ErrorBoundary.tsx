import * as React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  errorMessages?: {
    message?: string
    stack?: string
    componentStack?: string | null
  }
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    const maybeError = error instanceof Error ? error : undefined
    this.setState({
      errorMessages: {
        message: maybeError?.message,
        stack: maybeError?.stack,
        componentStack: info.componentStack,
      },
    })
    console.error('ErrorBoundary caught an error', {
      error,
      errorMessage: maybeError?.message,
      errorStack: maybeError?.stack,
      componentStack: info.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ whiteSpace: 'pre-line' }}>Error: {`${JSON.stringify(this.state.errorMessages)}`.split('\\n').join('\n')}</div>
    }

    return this.props.children
  }
}
export default ErrorBoundary
