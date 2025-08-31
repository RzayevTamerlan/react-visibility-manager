"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisibilityTrigger = exports.VisibilityTarget = exports.VisibilityProvider = void 0;
exports.useVisibility = useVisibility;
exports.useVisibilityTarget = useVisibilityTarget;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const VisibilityContext = (0, react_1.createContext)(undefined);
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
    const [state, dispatch] = (0, react_1.useReducer)(visibilityReducer, initialState);
    const toggle = (0, react_1.useCallback)((key) => dispatch({ type: 'TOGGLE', key, mode }), [mode]);
    const set = (0, react_1.useCallback)((key, value) => dispatch({ type: 'SET', key, value, mode }), [mode]);
    const reset = (0, react_1.useCallback)((initial) => dispatch({ type: 'RESET', initial }), []);
    return ((0, jsx_runtime_1.jsx)(VisibilityContext.Provider, { value: { state, toggle, set, reset }, children: children }));
};
const MemoizedVisibilityProvider = (0, react_1.memo)(VisibilityProvider);
exports.VisibilityProvider = MemoizedVisibilityProvider;
function useVisibility() {
    const context = (0, react_1.useContext)(VisibilityContext);
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
    const cloned = (0, react_1.cloneElement)(children, newProps);
    return wrapper ? wrapper(cloned, isOpen) : cloned;
};
const MemoizedVisibilityTarget = (0, react_1.memo)(VisibilityTarget);
exports.VisibilityTarget = MemoizedVisibilityTarget;
const VisibilityTrigger = ({ children, triggerKey, propName = 'onClick', ...restProps }) => {
    const { toggle } = useVisibilityTarget(triggerKey);
    if (!children) {
        throw new Error('VisibilityTrigger requires a child element');
    }
    if (!(0, react_1.isValidElement)(children)) {
        throw new Error('VisibilityTrigger child must be a valid React element');
    }
    const existingOnClick = children?.props[propName];
    const handleClick = (0, react_1.useCallback)((e) => {
        existingOnClick?.(e);
        toggle();
    }, [existingOnClick, toggle]);
    const newProps = { ...children?.props, restProps, [propName]: handleClick };
    return (0, react_1.cloneElement)(children, newProps);
};
const MemoizedVisibilityTrigger = (0, react_1.memo)(VisibilityTrigger);
exports.VisibilityTrigger = MemoizedVisibilityTrigger;
function useVisibilityTarget(targetKey) {
    const { state, toggle: globalToggle, set: globalSet } = useVisibility();
    const isOpen = Boolean(state[targetKey]);
    const toggle = (0, react_1.useCallback)(() => {
        globalToggle(targetKey);
    }, [targetKey, globalToggle]);
    const set = (0, react_1.useCallback)((value) => {
        globalSet(targetKey, value);
    }, [targetKey, globalSet]);
    return {
        isOpen,
        toggle,
        set,
    };
}
