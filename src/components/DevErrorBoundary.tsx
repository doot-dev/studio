
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class DevErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to the console
    console.error("DevErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo }); // Store errorInfo for display
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div style={{
          padding: '2rem',
          margin: '1rem',
          border: '2px dashed hsl(var(--destructive))',
          backgroundColor: 'hsl(var(--destructive) / 0.05)',
          color: 'hsl(var(--foreground))',
          borderRadius: 'var(--radius)',
          fontFamily: 'sans-serif',
          boxShadow: '0 4px 6px hsl(var(--background) / 0.1)',
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'hsl(var(--destructive))', marginBottom: '1rem' }}>
            Development Error Boundary
          </h1>
          <p style={{ marginTop: '0.5rem', marginBottom: '1rem', color: 'hsl(var(--muted-foreground))' }}>
            An error occurred in a client component. Check the browser console for the original error message and more details. This boundary helps prevent a full app crash during development.
          </p>
          {this.state.error && (
            <details open style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', backgroundColor: 'hsl(var(--card))', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: 'hsl(var(--destructive))', display: 'block', paddingBottom: '0.5rem' }}>
                Error: {this.state.error.message}
              </summary>
              <div style={{maxHeight: '300px', overflowY: 'auto', borderTop: '1px solid hsl(var(--border))', paddingTop: '0.5rem'}}>
                {this.state.error.stack && (
                  <p style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', lineHeight: '1.6' }}>
                    <strong>Stack Trace:</strong><br />
                    {this.state.error.stack}
                  </p>
                )}
                {this.state.errorInfo && this.state.errorInfo.componentStack && (
                  <p style={{ marginTop: '1rem', fontFamily: 'monospace', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', lineHeight: '1.6' }}>
                    <strong>Component Stack:</strong><br />
                    {this.state.errorInfo.componentStack}
                  </p>
                )}
              </div>
            </details>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              border: 'none',
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.2s ease-in-out',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--primary) / 0.9)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--primary))'}
          >
            Attempt to Recover
          </button>
          <p style={{marginTop: '1rem', fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))'}}>
            <i>Note: For hydration errors, recovery might clear this message, but the underlying issue (mismatch between server and client render) may persist. A page refresh or code fix is often needed.</i>
          </p>
        </div>
      );
    }

    // Normally, render children
    return this.props.children;
  }
}

export default DevErrorBoundary;
