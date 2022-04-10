import { Sandpack } from "@codesandbox/sandpack-react";

const IndexCSS = `
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

`;

const IndexCode = `
import React from 'react'
import ReactDOMMini from './ReactDOMMini'
// import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

ReactDOMMini.render(
  // ReactDOM.render(
  // <React.StrictMode>
  // </React.StrictMode>,
  <App />,
  document.getElementById('root') as HTMLElement
)

`;

const AppCSSCode = `
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

`;

const AppCode = `
import React from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [showLogo, setShowLogo] = React.useState(true)
  const [color, setColor] = React.useState('red')

  React.useEffect(() => {
    let colors = ['red', 'green', 'blue']
    let i = 0
    const intervalID = setInterval(() => {
      i += 1
      const nextIndex = i % 3 // magical ✨
      setColor(colors[nextIndex])
    }, 1000)

    return function onUnmount() {
      clearInterval(intervalID)
    }
  }, [])

  return (
    <div className="App">
      <header
        className="App-header"
        onClick={() => {
          setShowLogo(!showLogo)
        }}
      >
        {showLogo ? <img src={logo} className="App-logo" alt="logo" /> : null}

        {/* @ts-ignore */}
        <p bgColor={color}>
          Edit <code>App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
`;
const ReactDOMMiniCode = `
import ReactReconciler from 'react-reconciler' // the guts of react that are shared across different platforms

export type Props = Object

/**
 * @description
 * To get a working renderer, there are a few methods you need to implenent.
 *
 * @example
 * Docs for core methods: https://github.com/facebook/react/tree/main/packages/react-reconciler#createinstancetype-props-rootcontainer-hostcontext-internalhandle
 */
//@ts-ignore
const reconciler = ReactReconciler({
  // confifuartion for how to talk with the host environment AKA 'host config'
  supportsMutation: true,

  /**
   * @description
   *
   */
  createInstance(
    type,
    props: any, // TODO: add types: https://github.com/facebook/react/blob/05c283c3c31184d68c6a54dfd6a044790b89a08a/packages/react-native-renderer/src/ReactFabricHostConfig.js#L335
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    // console.log("{type, props}", {type, props});
    let el = document.createElement(type as keyof HTMLElementTagNameMap) as any
    // if props?.className el.className = props?.className
    // if props?.src el.src = props.src

    const keys = ['alt', 'className', 'href', 'rel', 'src', 'target']
    keys.forEach((key) => {
      if (props[key]) {
        el[key] = props[key]
      }
    })
    // console.log("props.onClick", props.onClick)
    if (props.onClick) {
      el.addEventListener('click', props.onClick)
    }
    if (props.bgColor) {
      console.log('props.bgColor', props.bgColor)
      el.style.backgroundColor = props.bgColor
    }

    /*
    React is not tied to the DOM & has no notion of the DOM so you might be wondering why we return the element here.
    "react-reconciler" isnt going to call any methods or set any properties on this object(the element), but what it is going to do is
    pass the element back to us in some of the other methods below so that we can manipulate it later.

    React doesn't care what the shape of this return value is. So if we wanted to return some other shape {el, someOtherData...}
    we could do that
    */
    return el
  },

  /**
   * @description
   *
   * @example
   * When react encounters text in a node, it will create a text instance for it.
   * Example: <div>Hello</div> ..."Hello" would be the text instance.
   *
   * Note:
   * This idea of a text node is nothing novel.
   * When the browser is parsing a real webpage, in the phase of building the DOM, when it encounters
   * a piece of text, it will create a text node.
   */
  createTextInstance(text, rootContainerInstance, hostContext, internal) {
    console.log("text", text)
    const domTextNode = document.createTextNode(text)
    return domTextNode
  },

  // These 3 similar sounding methods are called in slightly different situations: https://youtu.be/CGpMlWVcHok?t=909

  /**
   * @description
   * ❌ Without this we can't render our app at all
   *
   * NOTE:
   * I added the types other wise they default to "unknown"
   */
  appendChildToContainer(container: HTMLElement, child: HTMLElement) {
    // if (!container || !child) {
    //   throw new Error("Please pass a value for 'container' & 'child' & ensure they are HTML Elements")
    // }
    container.appendChild(child)
  },

  /**
   * @description
   *
   * NOTE:
   * I added the types other wise they default to "unknown"
   */
  appendChild(parent: HTMLElement, child: HTMLElement) {
    // if (!parent || !child) {
    //   throw new Error("Please pass a value for 'parent' &  'child' & ensure they are HTML Elements")
    // }
    parent.appendChild(child)
  },

  /**
   * @description
   * ❌ Without this we can't render our app at all
   * NOTE:
   * I added the types other wise they default to "unknown"
   */
  appendInitialChild(parent: HTMLElement, child: HTMLElement) {
    // console.log("[appendInitialChild] - {parent, child}", { parent, child })
    // if (!parent || !child) {
    //   throw new Error("Please pass a value for 'parent' & 'child' & ensure they are HTML Elements")
    // }
    parent.appendChild(child)
  },

  /**
   * @description
   *
   * NOTE:
   * I added the types other wise they default to "unknown"
   */
  removeChildFromContainer(container: HTMLElement, child: HTMLElement) {
    console.log("[removeChildFromContainer] - {container, child}", { container, child })

    // if (!container || !child) {
    //   throw new Error("Please pass a value for 'container' & 'child' & ensure they are HTML Elements")
    // }
    container.removeChild(child)
  },

  /**
   * @description
   *
   * NOTE:
   * I added the types other wise they default to "unknown"
   */
  removeChild(parent: HTMLElement, child: HTMLElement) {
    // if (!parent || !child) {
    //   throw new Error("Please pass a value for 'parent' & 'child' & ensure they are HTML Elements")
    // }
    parent.removeChild(child)
  },

  /**
   * @description
   *
   * NOTE:
   * I added the types other wise they default to "unknown"
   */
  insertInContainerBefore(container: HTMLElement, child: HTMLElement, beforeChild: Node) {
    // if (!container || !child) {
    //   throw new Error("Please pass a value for 'container' & 'child' & ensure they are HTML Elements")
    // }
    container.insertBefore(child, beforeChild)
  },

  /**
   * @description
   *
   * NOTE:
   * I added the types other wise they default to "unknown"
   */
  insertBefore(parent: HTMLElement, child: HTMLElement, beforeChild: Node) {
    // if (!parent || !child) {
    //   throw new Error("Please pass a value for 'parent' & 'child' & ensure they are HTML Elements")
    // }
    parent.insertBefore(child, beforeChild)
  },

  /**
   * @description
   * This is 1 of 2 methods required to make DOM updates work.
   * Called in the "render" phase
   *
   * It supposed to return an update payload which is basically a diff between the old and new props
   *
   * Payload is passed to "commitUpdate"
   */
  prepareUpdate(instance, type, oldProps: any, newProps: any, rootContainerInstance, currentHostContext) {
    let payload
    // for simplicity's sake we are only going to compare the "bgColor" props
    if (oldProps.bgColor !== newProps.bgColor) {
      // we could return anything here & react doesn't care, this will get passed to our next function
      payload = { newBgColor: newProps.bgColor }
    }
    return payload
  },

  /**
   * @description
   * This is 1 of 2 methods required to make DOM updates work.
   * Call in the "commit" phase
   */
  commitUpdate(instance: any, updatePayload: any, type, oldProps, newProps, finishedWork) {
    // console.log('{instance, updatePayLoad, type, oldProps, newProps, finishedWork}', {
    //   instance,
    //   updatePayload,
    //   type,
    //   oldProps,
    //   newProps,
    //   finishedWork,
    // })
    if (updatePayload.newBgColor) {
      instance.style.backgroundColor = updatePayload.newBgColor
    }
  },

  commitMount(instance, type, props, internalInstanceHandle) {},

  // @ts-ignore
  finalizeInitialChildren() {},

  getChildHostContext() {},

  getPublicInstance() {},

  getRootHostContext() {},

  /**
   * @description
   * ❌ Without the page will crash after removing an element off the page
   * https://github.com/sophiebits/react-dom-mini/issues/20
   */
  prepareForCommit() {
    return null
  },

  resetAfterCommit() {},

  // @ts-ignore
  shouldSetTextContent() {},

  // Note this needs to be added or else we will get an infinite re-render during the inital part of tutorual
  clearContainer(container) {},
})

const ReactDOMMini = {
  /**
   * @description
   * When "render" is called, we are going to call into the reconciler so "whatToRender" gets passed to React.
   * @param whatToRender
   * @param div
   */
  render(whatToRender: any, div: HTMLElement) {
    const shouldHydrate = false
    const hydrationCallback = null // we are not doing server side hydration.
    const container = reconciler.createContainer(div, 0, shouldHydrate, hydrationCallback) // TODO: update @types package return

    reconciler.updateContainer(whatToRender, container, null, null)
  },
}

export default ReactDOMMini
`;

const LogoCode = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3"><g fill="#61DAFB"><path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"/><circle cx="420.9" cy="296.5" r="45.7"/><path d="M520.5 78.1z"/></g></svg>
`;

export default function HelloReactReconciler() {
  return (
    <>
      <Sandpack
        // Try out the included templates below!
        template="react-ts"
        files={{
          "/App.tsx": AppCode,
          "/ReactDOMMini.ts": ReactDOMMiniCode,
          "/logo.svg": LogoCode,
          "/App.css": AppCSSCode,
          "index.tsx": IndexCode,
          "index.css": IndexCSS,
        }}
        options={{
          autorun: true,
          showLineNumbers: true,
          recompileMode: "immediate",
        }}
        customSetup={{
          entry: "/index.tsx",
          dependencies: {
            react: "17.0.2",
            "react-dom": "17.0.2",
            "react-scripts": "5.0.0",
            "react-reconciler": "0.26.2",
          },
          // environment: "create-react-app-typescript",
        }}
      />
    </>
  );
}
