# React Visibility Manager

A simple, headless, and unopinionated React utility to manage visibility state for components like dropdowns, modals, tooltips, and accordions using React's Context API.

[![npm version](https://badge.fury.io/js/react-visibility-manager.svg)](https://www.npmjs.com/package/react-visibility-manager)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 💡 **Decoupled Logic**: Keep your UI components clean by separating visibility logic.
- 💪 **Flexible**: Works with any component library or your custom components.
- ⚙️ **Headless**: Provides the logic, not the UI. You have 100% control over the rendering and styling.
- 🚀 **Easy to Use**: Get started in minutes with an intuitive component-based or hook-based API.
- 🔵 **Typed**: Written in TypeScript for a great developer experience.
- 🎯 **Single/Multiple Mode**: Choose between accordion-style single visibility or multiple simultaneous visibility.
- ⚡ **Optimized**: Memoized components and hooks for better performance.

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

Wrap your application (or just a part of it — that's usually recommended to avoid unnecessary re-renders) with `VisibilityProvider`. Then, use `VisibilityTrigger` to control a `VisibilityTarget`. The `triggerKey` and `targetKey` props link them together.

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

| Prop           | Type                     | Default      | Description                                              |
| -------------- | ------------------------ | ------------ | -------------------------------------------------------- |
| `children`     | `ReactNode`              |              | Your React application or a part of it.                  |
| `initialState` | `Record<string, boolean>` | `{}`         | An initial state for your visibility keys, e.g., `{ 'my-modal': true }`. |
| `mode`         | `'single' \| 'multiple'`  | `'multiple'` | Controls whether only one item can be visible at a time (`'single'`) or multiple items can be visible simultaneously (`'multiple'`). |

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

### `useVisibilityState()`

A hook that returns the entire visibility state object. Useful for reading multiple visibility states at once or for debugging purposes.

Returns `Record<string, boolean>` - the complete visibility state.

### `useVisibilityActions()`

A hook that returns all the action functions for managing visibility state.

Returns an object with:
- `toggle`: `(key: string) => void` - Toggle visibility for any key
- `set`: `(key: string, value: boolean) => void` - Set visibility for any key
- `reset`: `(initial: VisibilityState) => void` - Reset to initial state

-----

## Visibility Modes

The library supports two visibility modes that can be set on the `VisibilityProvider`:

### Multiple Mode (Default)

In `multiple` mode, any number of visibility targets can be open simultaneously. This is the default behavior and works great for independent dropdowns, tooltips, or modals.

```jsx
<VisibilityProvider mode="multiple">
  {/* Multiple items can be visible at the same time */}
</VisibilityProvider>
```

### Single Mode

In `single` mode, only one visibility target can be open at a time. When you open a new target, all others automatically close. This is perfect for accordion-style components, tab panels, or exclusive dropdowns.

```jsx
<VisibilityProvider mode="single">
  {/* Only one item can be visible at a time */}
</VisibilityProvider>
```

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

### Using Low-Level Hooks for Complex Logic

For advanced use cases, you can use the low-level hooks directly:

```jsx
import {
  VisibilityProvider,
  useVisibilityState,
  useVisibilityActions,
} from 'react-visibility-manager';

const ComplexComponent = () => {
  const state = useVisibilityState();
  const { toggle, set, reset } = useVisibilityActions();

  // Check if multiple items are open
  const openItems = Object.entries(state).filter(([_, isOpen]) => isOpen);
  const hasMultipleOpen = openItems.length > 1;

  return (
    <div>
      <p>Currently open: {openItems.map(([key]) => key).join(', ')}</p>
      {hasMultipleOpen && (
        <button onClick={() => reset({})}>Close All</button>
      )}
      
      <button onClick={() => toggle('item-1')}>Toggle Item 1</button>
      <button onClick={() => toggle('item-2')}>Toggle Item 2</button>
      <button onClick={() => set('item-3', true)}>Open Item 3</button>
    </div>
  );
};
```

### Creating an Accordion with Single Mode

Perfect use case for `single` mode - only one accordion item should be open at a time.

```jsx
import {
  VisibilityProvider,
  VisibilityTrigger,
  VisibilityTarget,
} from 'react-visibility-manager';

const AccordionItem = ({ title, isOpen, children, ...props }) => (
  <div className="accordion-item" {...props}>
    <h3 className={`accordion-header ${isOpen ? 'active' : ''}`}>{title}</h3>
    {isOpen && <div className="accordion-content">{children}</div>}
  </div>
);

function Accordion() {
  return (
    <VisibilityProvider mode="single">
      <div className="accordion">
        <VisibilityTrigger triggerKey="section-1">
          <button>Section 1</button>
        </VisibilityTrigger>
        <VisibilityTarget targetKey="section-1">
          <AccordionItem title="Section 1">
            Content for section 1...
          </AccordionItem>
        </VisibilityTarget>

        <VisibilityTrigger triggerKey="section-2">
          <button>Section 2</button>
        </VisibilityTrigger>
        <VisibilityTarget targetKey="section-2">
          <AccordionItem title="Section 2">
            Content for section 2...
          </AccordionItem>
        </VisibilityTarget>

        <VisibilityTrigger triggerKey="section-3">
          <button>Section 3</button>
        </VisibilityTrigger>
        <VisibilityTarget targetKey="section-3">
          <AccordionItem title="Section 3">
            Content for section 3...
          </AccordionItem>
        </VisibilityTarget>
      </div>
    </VisibilityProvider>
  );
}
```

### Managing Multiple Independent Components

Using `multiple` mode (default) for independent dropdowns that can be open simultaneously.

```jsx
import {
  VisibilityProvider,
  VisibilityTrigger,
  VisibilityTarget,
} from 'react-visibility-manager';

const Dropdown = ({ isOpen, children, ...props }) => (
  <div className={`dropdown ${isOpen ? 'open' : ''}`} {...props}>
    {children}
  </div>
);

function NavigationBar() {
  return (
    <VisibilityProvider mode="multiple">
      <nav className="navbar">
        <VisibilityTrigger triggerKey="user-menu">
          <button>User Menu</button>
        </VisibilityTrigger>
        <VisibilityTarget targetKey="user-menu">
          <Dropdown>
            <ul>
              <li>Profile</li>
              <li>Settings</li>
              <li>Logout</li>
            </ul>
          </Dropdown>
        </VisibilityTarget>

        <VisibilityTrigger triggerKey="notifications">
          <button>Notifications</button>
        </VisibilityTrigger>
        <VisibilityTarget targetKey="notifications">
          <Dropdown>
            <ul>
              <li>New message from John</li>
              <li>System update available</li>
            </ul>
          </Dropdown>
        </VisibilityTarget>
      </nav>
    </VisibilityProvider>
  );
}
```

### FAQ Component with Single Mode

```jsx
import {
  VisibilityProvider,
  VisibilityTrigger,
  VisibilityTarget,
} from 'react-visibility-manager';

const FaqItem = ({ question, isOpen, children }) => (
  <div className="faq-item">
    <h3 className={`faq-question ${isOpen ? 'open' : ''}`}>
      {question}
      <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
    </h3>
    {isOpen && <div className="faq-answer">{children}</div>}
  </div>
);

function Faq() {
  return (
    <VisibilityProvider mode="single">
      <div className="faq-container">
        <h2>Frequently Asked Questions</h2>

        <VisibilityTrigger triggerKey="faq-1">
          <button className="faq-trigger">What is this library for?</button>
        </VisibilityTrigger>
        <VisibilityTarget targetKey="faq-1">
          <FaqItem question="What is this library for?">
            It helps manage visibility state in React applications with a clean, 
            headless approach that works with any UI library or custom components.
          </FaqItem>
        </VisibilityTarget>

        <VisibilityTrigger triggerKey="faq-2">
          <button className="faq-trigger">Is it hard to use?</button>
        </VisibilityTrigger>
        <VisibilityTarget targetKey="faq-2">
          <FaqItem question="Is it hard to use?">
            No, it's designed to be simple and intuitive! You can get started 
            in just a few minutes with either components or hooks.
          </FaqItem>
        </VisibilityTarget>

        <VisibilityTrigger triggerKey="faq-3">
          <button className="faq-trigger">Does it support TypeScript?</button>
        </VisibilityTrigger>
        <VisibilityTarget targetKey="faq-3">
          <FaqItem question="Does it support TypeScript?">
            Yes! The library is written in TypeScript and provides full type safety 
            and great developer experience with IntelliSense support.
          </FaqItem>
        </VisibilityTarget>
      </div>
    </VisibilityProvider>
  );
}
```

-----

## Performance Optimizations

The library is optimized for performance with several built-in optimizations:

- **Memoized Components**: All components (`VisibilityProvider`, `VisibilityTarget`, `VisibilityTrigger`) are memoized to prevent unnecessary re-renders.
- **Stable Callbacks**: Hook callbacks are memoized and only recreate when dependencies change.
- **Split Context**: State and actions are provided through separate contexts to minimize re-renders.
- **Efficient Updates**: The reducer pattern ensures state updates are predictable and efficient.

### Best Practices

1. **Scope Your Providers**: Don't wrap your entire app unless necessary. Use multiple smaller providers for different sections.

```jsx
// ✅ Good - scoped provider
function Dashboard() {
  return (
    <VisibilityProvider>
      {/* Dashboard-specific visibility logic */}
    </VisibilityProvider>
  );
}

// ❌ Avoid - unnecessarily broad scope
function App() {
  return (
    <VisibilityProvider>
      <Router>
        <Routes>
          {/* Entire app */}
        </Routes>
      </Router>
    </VisibilityProvider>
  );
}
```

2. **Use Meaningful Keys**: Choose descriptive keys for better debugging and maintainability.

```jsx
// ✅ Good
<VisibilityTrigger triggerKey="user-profile-dropdown">

// ❌ Avoid
<VisibilityTrigger triggerKey="dropdown1">
```

-----

## TypeScript Support

The library is fully typed and provides excellent TypeScript support:

```typescript
import type { 
  VisibilityState, 
  VisibilityMode, 
  UseVisibilityTargetResult,
  VisibilityProviderProps,
  VisibilityTargetProps,
  VisibilityTriggerProps 
} from 'react-visibility-manager';

// Custom hook with full type safety
const useCustomVisibility = (key: string): UseVisibilityTargetResult => {
  return useVisibilityTarget(key);
};

// Typed component props
interface CustomModalProps {
  modalKey: string;
  title: string;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ modalKey, title, children }) => {
  const { isOpen, set } = useVisibilityTarget(modalKey);
  
  // TypeScript knows isOpen is boolean, set accepts boolean
  return isOpen ? (
    <div>
      <h2>{title}</h2>
      {children}
      <button onClick={() => set(false)}>Close</button>
    </div>
  ) : null;
};
```

-----

## Contributing

If you encounter any bugs or have suggestions for improvements, please feel free to open an issue or submit a pull request on [GitHub](https://github.com/RzayevTamerlan/react-visibility-manager). We welcome contributions from the community!

## License

MIT
