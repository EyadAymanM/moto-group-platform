import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded bg-slate-900 border border-amber-500/30 text-center">
            <h2 className="text-lg font-bold text-amber-400">Showroom View Warning</h2>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              {this.state.error?.message || 'A render issue occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded bg-amber-500 text-slate-950 font-semibold text-xs uppercase tracking-wider hover:brightness-110"
            >
              Reload Showroom
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
