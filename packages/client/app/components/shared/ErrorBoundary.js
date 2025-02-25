/* eslint-disable class-methods-use-this */
/* eslint-disable handle-callback-err */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */

import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  /* eslint-disable-next-line node/handle-callback-err */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

/* eslint-disable import/prefer-default-export */
export { ErrorBoundary }
