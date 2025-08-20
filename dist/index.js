import { jsx as _jsx } from "react/jsx-runtime";
import { cloneElement, createContext, isValidElement, useCallback, useContext, useReducer, } from 'react';
const VisibilityContext = createContext(undefined);
function visibilityReducer(state, action) {
    switch (action.type) {
        case 'TOGGLE':
            return { ...state, [action.key]: !state[action.key] };
        case 'SET':
            return { ...state, [action.key]: action.value };
        case 'RESET':
            return { ...action.initial };
        default:
            return state;
    }
}
export const VisibilityProvider = ({ children, initialState = {}, }) => {
    const [state, dispatch] = useReducer(visibilityReducer, initialState);
    const toggle = useCallback((key) => dispatch({ type: 'TOGGLE', key }), []);
    const set = useCallback((key, value) => dispatch({ type: 'SET', key, value }), []);
    const reset = useCallback((initial) => dispatch({ type: 'RESET', initial }), []);
    return (_jsx(VisibilityContext.Provider, { value: { state, toggle, set, reset }, children: children }));
};
export function useVisibility() {
    const context = useContext(VisibilityContext);
    if (!context) {
        throw new Error('useVisibility must be used within a VisibilityProvider');
    }
    return context;
}
export const VisibilityTarget = ({ children, targetKey, isOpenPropName = 'isOpen', shouldRender = true, wrapper, ...restProps }) => {
    const { state } = useVisibility();
    const isOpen = Boolean(state[targetKey]);
    const newProps = {
        ...children.props,
        ...restProps,
        [isOpenPropName]: isOpen,
    };
    if (!shouldRender && !isOpen) {
        return null;
    }
    const cloned = cloneElement(children, newProps);
    return wrapper ? wrapper(cloned, isOpen) : cloned;
};
export const VisibilityTrigger = ({ children, triggerKey, propName = 'onClick', ...restProps }) => {
    const { toggle } = useVisibility();
    if (!children) {
        throw new Error('VisibilityTrigger requires a child element');
    }
    if (!isValidElement(children)) {
        throw new Error('VisibilityTrigger child must be a valid React element');
    }
    const existingOnClick = children?.props[propName];
    const handleClick = (e) => {
        existingOnClick?.(e);
        toggle(triggerKey);
    };
    const newProps = { ...children?.props, restProps, [propName]: handleClick };
    return cloneElement(children, newProps);
};
export function useVisibilityTarget(targetKey) {
    const { state, toggle: globalToggle, set: globalSet } = useVisibility();
    const isOpen = Boolean(state[targetKey]);
    const toggle = useCallback(() => {
        globalToggle(targetKey);
    }, [targetKey, globalToggle]);
    const set = useCallback((value) => {
        globalSet(targetKey, value);
    }, [targetKey, globalSet]);
    return {
        isOpen,
        toggle,
        set,
    };
}
