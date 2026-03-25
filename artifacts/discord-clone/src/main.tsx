import { createRoot } from "react-dom/client";
import { Component, type ReactNode } from "react";
import App from "./App";
import "./index.css";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#060000",
            color: "#949ba4",
            fontFamily: "sans-serif",
            gap: "12px",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "32px" }}>⚠</div>
          <p style={{ fontSize: "15px", color: "#dbdee1" }}>Something went wrong</p>
          <p style={{ fontSize: "13px", maxWidth: "400px" }}>
            {(this.state.error as Error).message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "8px",
              padding: "8px 20px",
              borderRadius: "8px",
              background: "#cc0000",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
