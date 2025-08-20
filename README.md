# React Visibility Manager

A simple, headless, and unopinionated React utility to manage visibility state for components like dropdowns, modals, tooltips, and accordions using React's Context API.

[](https://www.google.com/search?q=https://www.npmjs.com/package/%40tamerlanrzayev/react-visibility-manager)
[](https://opensource.org/licenses/MIT)

## Features

  - 💡 **Decoupled Logic**: Keep your UI components clean by separating visibility logic.
  - 💪 **Flexible**: Works with any component library or your custom components.
  - ⚙️ **Headless**: Provides the logic, not the UI. You have 100% control over the rendering and styling.
  - 🚀 **Easy to Use**: Get started in minutes with an intuitive component-based or hook-based API.
  - 🔵 **Typed**: Written in TypeScript for a great developer experience.

-----

## Installation

```bash
npm install react-visibility-manager
```

or with Yarn:

```bash
yarn add react-visibility-manager
```

-----

## Quick Start

Wrap your application (or just a part of it — that’s usually recommended to avoid unnecessary re-renders) with `VisibilityProvider`. Then, use `VisibilityTrigger` to control a `VisibilityTarget`. The `triggerKey` and `targetKey` props link them together.

```jsx
import {
  VisibilityProvider,
  VisibilityTrigger,
  VisibilityTarget,
} from 'react-visibility-manager';

// Your custom components
const Button = (props) => <button {...props} />;
const DropdownMenu = ({ isOpen, ...props }) =>
  isOpen ? <div {...props} /> : null;

function App() {
  return (
    <VisibilityProvider>
      <div>
        <VisibilityTrigger triggerKey="profile-dropdown">
          <Button>My Profile</Button>
        </VisibilityTrigger>

        <VisibilityTarget targetKey="profile-dropdown">
          <DropdownMenu>
            <ul>
              <li>Settings</li>
              <li>Log Out</li>
            </ul>
          </DropdownMenu>
        </VisibilityTarget>
      </div>
    </VisibilityProvider>
  );
}
```

-----

## API Reference

### `<VisibilityProvider>`

This is the context provider that holds the global visibility state. It should wrap any components that use `VisibilityTrigger`, `VisibilityTarget`, or the hooks.

| Prop           | Type                     | Default | Description                                              |
| -------------- | ------------------------ | ------- | -------------------------------------------------------- |
| `children`     | `ReactNode`              |         | Your React application or a part of it.                  |
| `initialState` | `Record<string, boolean>` | `{}`    | An initial state for your visibility keys, e.g., `{ 'my-modal': true }`. |

### `<VisibilityTrigger>`

A wrapper component that makes its child element a toggle for a specific visibility key.

| Prop         | Type          | Default   | Description                                                                 |
| ------------ | ------------- | --------- | --------------------------------------------------------------------------- |
| `children`   | `ReactElement`|           | A single valid React element that will receive the toggle handler.          |
| `triggerKey` | `string`      |           | A unique key to identify which state to toggle.                             |
| `propName`   | `string`      | `'onClick'` | The name of the prop to which the toggle function will be passed. Use `'onMouseEnter'` for hover effects. |

### `<VisibilityTarget>`

A wrapper component that injects the visibility state into its child element.

| Prop             | Type                                       | Default   | Description                                                              |
| ---------------- | ------------------------------------------ | --------- | ------------------------------------------------------------------------ |
| `children`       | `ReactElement`                             |           | A single valid React element that will receive the visibility state.     |
| `targetKey`      | `string`                                   |           | A unique key that links this target to a trigger.                        |
| `isOpenPropName` | `string`                                   | `'isOpen'`| The name of the prop that will be passed to the child with the boolean visibility state. |
| `shouldRender`   | `boolean`                                  | `true`    | If `false`, the component will unmount (return `null`) when not visible. |
| `wrapper`        | `(node, isOpen) => ReactElement`           |           | An optional render prop function to wrap the child, useful for animations. |

### `useVisibilityTarget(targetKey)`

A hook that returns the state and controls for a specific visibility key. This is a great alternative to the `<VisibilityTarget>` component for more complex logic.

It returns an object with the following properties:

  - `isOpen`: `boolean` - The current visibility state.
  - `toggle`: `() => void` - A function to toggle the state.
  - `set`: `(value: boolean) => void` - A function to explicitly set the state to `true` or `false`.

### `useVisibility()`

A hook for advanced use cases that returns the entire context value, including the global state and dispatcher functions (`toggle`, `set`, `reset`).

-----

## Examples

### Using the `useVisibilityTarget` Hook

The hook is perfect when you need more control over rendering, such as for creating a modal component.

```jsx
import {
  VisibilityProvider,
  VisibilityTrigger,
  useVisibilityTarget,
} from 'react-visibility-manager';

const Modal = ({ title, children, modalKey }) => {
  const { isOpen, set } = useVisibilityTarget(modalKey);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{title}</h2>
        {children}
        <button onClick={() => set(false)}>Close</button>
      </div>
    </div>
  );
};

function App() {
  return (
    <VisibilityProvider>
      <VisibilityTrigger triggerKey="terms-modal">
        <button>Open Terms of Service</button>
      </VisibilityTrigger>

      <Modal modalKey="terms-modal" title="Terms of Service">
        <p>Here are the terms and conditions...</p>
      </Modal>
    </VisibilityProvider>
  );
}
```

### Managing Multiple Components

You can manage any number of components by giving them unique keys.

```jsx
import {
  VisibilityProvider,
  VisibilityTrigger,
  VisibilityTarget,
} from 'react-visibility-manager';

// Assume AccordionItem is a styled component
const AccordionItem = ({ title, isOpen, children, ...props }) => (
  <div {...props}>
    <h3>{title}</h3>
    {isOpen && <p>{children}</p>}
  </div>
);

function Faq() {
  return (
    <VisibilityProvider>
      <h2>Frequently Asked Questions</h2>

      <VisibilityTrigger triggerKey="faq-1">
        <button>What is this library for?</button>
      </VisibilityTrigger>
      <VisibilityTarget targetKey="faq-1">
        <AccordionItem>
          It helps manage visibility state in React applications.
        </AccordionItem>
      </VisibilityTarget>

      <hr />

      <VisibilityTrigger triggerKey="faq-2">
        <button>Is it hard to use?</button>
      </VisibilityTrigger>
      <VisibilityTarget targetKey="faq-2">
        <AccordionItem>
          No, it's designed to be simple and intuitive!
        </AccordionItem>
      </VisibilityTarget>
    </VisibilityProvider>
  );
}
```

-----

## License

MIT