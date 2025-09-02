import { jsx as _jsx } from "react/jsx-runtime";
import { cloneElement, createContext, isValidElement, memo, useCallback, useContext, useMemo, useReducer, } from 'react';
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
const VisibilityStateContext = createContext(undefined);
const VisibilityActionsContext = createContext(undefined);
VisibilityStateContext.displayName = 'VisibilityStateContext';
VisibilityActionsContext.displayName = 'VisibilityActionsContext';
const VisibilityProvider = ({ children, initialState = {}, mode = 'multiple', }) => {
    const [state, dispatch] = useReducer(visibilityReducer, initialState);
    const toggle = useCallback((key) => dispatch({ type: 'TOGGLE', key, mode }), [mode]);
    const set = useCallback((key, value) => dispatch({ type: 'SET', key, value, mode }), [mode]);
    const reset = useCallback((initial) => dispatch({ type: 'RESET', initial }), []);
    const actionsValue = useMemo(() => ({ toggle, set, reset }), [toggle, set, reset]);
    return (_jsx(VisibilityActionsContext.Provider, { value: actionsValue, children: _jsx(VisibilityStateContext.Provider, { value: state, children: children }) }));
};
const MemoizedVisibilityProvider = memo(VisibilityProvider);
function useVisibilityState() {
    const context = useContext(VisibilityStateContext);
    if (!context) {
        throw new Error('useVisibilityState must be used within a VisibilityProvider');
    }
    return context;
}
function useVisibilityActions() {
    const context = useContext(VisibilityActionsContext);
    if (!context) {
        throw new Error('useVisibilityActions must be used within a VisibilityProvider');
    }
    return context;
}
function useVisibilityTarget(targetKey) {
    const state = useVisibilityState();
    const { toggle: globalToggle, set: globalSet } = useVisibilityActions();
    const isOpen = Boolean(state[targetKey]);
    const toggle = useCallback(() => {
        globalToggle(targetKey);
    }, [targetKey, globalToggle]);
    const set = useCallback((value) => {
        globalSet(targetKey, value);
    }, [targetKey, globalSet]);
    return useMemo(() => ({ isOpen, toggle, set }), [isOpen, toggle, set]);
}
const VisibilityTarget = ({ children, targetKey, isOpenPropName = 'isOpen', shouldRender = true, wrapper, ...restProps }) => {
    const { isOpen } = useVisibilityTarget(targetKey);
    if (!shouldRender && !isOpen) {
        return null;
    }
    const newProps = {
        ...children.props,
        ...restProps,
        [isOpenPropName]: isOpen,
    };
    const cloned = cloneElement(children, newProps);
    return wrapper ? wrapper(cloned, isOpen) : cloned;
};
const MemoizedVisibilityTarget = memo(VisibilityTarget);
const VisibilityTrigger = ({ children, triggerKey, propName = 'onClick', ...restProps }) => {
    const { toggle } = useVisibilityActions();
    if (!isValidElement(children)) {
        throw new Error('VisibilityTrigger child must be a valid React element');
    }
    const existingOnClick = children.props[propName];
    const handleClick = useCallback((e) => {
        existingOnClick?.(e);
        toggle(triggerKey);
    }, [existingOnClick, toggle, triggerKey]);
    const newProps = { ...children.props, ...restProps, [propName]: handleClick };
    return cloneElement(children, newProps);
};
const MemoizedVisibilityTrigger = memo(VisibilityTrigger);
export { useVisibilityState, useVisibilityActions, useVisibilityTarget, MemoizedVisibilityProvider as VisibilityProvider, MemoizedVisibilityTarget as VisibilityTarget, MemoizedVisibilityTrigger as VisibilityTrigger, };
