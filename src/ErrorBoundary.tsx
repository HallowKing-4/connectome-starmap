import React from "react";

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Star-map crashed", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="crash">
          <div className="crash-card">
            <p className="kicker">Star-map fault</p>
            <h1>The constellation failed to ignite</h1>
            <p className="crash-msg">{this.state.error.message}</p>
            <button type="button" onClick={() => this.setState({ error: null })}>
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
