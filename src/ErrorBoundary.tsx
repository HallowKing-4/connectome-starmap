import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error): State { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Citation star-map failed", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="fatal">
          <div className="fatal-card">
            <p className="kicker">Star-map runtime</p>
            <h1>The sky did not collapse.</h1>
            <p>A renderer exception was caught by the root ErrorBoundary.</p>
            <pre>{this.state.error.message}</pre>
            <button type="button" onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
