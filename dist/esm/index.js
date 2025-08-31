import { jsx as _jsx } from "react/jsx-runtime";
import { cloneElement, createContext, isValidElement, memo, useCallback, useContext, useReducer, } from 'react';
const VisibilityContext = createContext(undefined);
function visibilityReducer(state, action) {
    switch (action.type) {
        case 'TOGGLE': {
            const newValue = !state[action.key];
            if (action.mode === 'single' && newValue) {
                return { [action.key]: true };
            }
            return {
                ...state,
                [action.key]: newValue,
            };
        }
        case 'SET': {
            if (action.mode === 'single' && action.value) {
                return { [action.key]: true };
            }
            return {
                ...state,
                [action.key]: action.value,
            };
        }
        case 'RESET':
            return action.initial;
        default:
            return state;
    }
}
const VisibilityProvider = ({ children, initialState = {}, mode = 'multiple', }) => {
    const [state, dispatch] = useReducer(visibilityReducer, initialState);
    const toggle = useCallback((key) => dispatch({ type: 'TOGGLE', key, mode }), [mode]);
    const set = useCallback((key, value) => dispatch({ type: 'SET', key, value, mode }), [mode]);
    const reset = useCallback((initial) => dispatch({ type: 'RESET', initial }), []);
    return (_jsx(VisibilityContext.Provider, { value: { state, toggle, set, reset }, children: children }));
};
const MemoizedVisibilityProvider = memo(VisibilityProvider);
function useVisibility() {
    const context = useContext(VisibilityContext);
    if (!context) {
        throw new Error('useVisibility must be used within a VisibilityProvider');
    }
    return context;
}
const VisibilityTarget = ({ children, targetKey, isOpenPropName = 'isOpen', shouldRender = true, wrapper, ...restProps }) => {
    const { isOpen } = useVisibilityTarget(targetKey);
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
const MemoizedVisibilityTarget = memo(VisibilityTarget);
const VisibilityTrigger = ({ children, triggerKey, propName = 'onClick', ...restProps }) => {
    const { toggle } = useVisibilityTarget(triggerKey);
    if (!children) {
        throw new Error('VisibilityTrigger requires a child element');
    }
    if (!isValidElement(children)) {
        throw new Error('VisibilityTrigger child must be a valid React element');
    }
    const existingOnClick = children?.props[propName];
    const handleClick = useCallback((e) => {
        existingOnClick?.(e);
        toggle();
    }, [existingOnClick, toggle]);
    const newProps = { ...children?.props, restProps, [propName]: handleClick };
    return cloneElement(children, newProps);
};
const MemoizedVisibilityTrigger = memo(VisibilityTrigger);
function useVisibilityTarget(targetKey) {
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
export { useVisibility, useVisibilityTarget, MemoizedVisibilityProvider as VisibilityProvider, MemoizedVisibilityTarget as VisibilityTarget, MemoizedVisibilityTrigger as VisibilityTrigger, };
