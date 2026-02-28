import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-stone-50">
          <div className="text-center max-w-sm">
            <span className="text-6xl block mb-4">💥</span>
            <h1 className="font-display font-bold text-2xl text-stone-800 mb-3">
              Something went wrong
            </h1>
            <p className="text-stone-400 text-sm mb-6">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-primary"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
