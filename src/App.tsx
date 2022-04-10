import React from "react";
import logo from "./logo.svg";
import "./App.css";
import HelloReactReconciler from "./Glossary/examples/HelloReactReconciler";
import "@codesandbox/sandpack-react/dist/index.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <HelloReactReconciler />
    </div>
  );
}

export default App;
