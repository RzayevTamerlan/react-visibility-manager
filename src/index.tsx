import {
  cloneElement,
  createContext,
  type FC,
  isValidElement,
  memo,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

export type VisibilityState = Record<string, boolean>;

type VisibilityAction =
  | { type: 'TOGGLE'; key: string; mode: VisibilityMode }
  | { type: 'SET'; key: string; value: boolean; mode: VisibilityMode }
  | { type: 'RESET'; initial: VisibilityState };

export type VisibilityMode = 'single' | 'multiple';

function visibilityReducer(state: VisibilityState, action: VisibilityAction): VisibilityState {
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

type VisibilityActions = {
  toggle: (key: string) => void;
  set: (key: string, value: boolean) => void;
  reset: (initial: VisibilityState) => void;
};

const VisibilityStateContext = createContext<VisibilityState | undefined>(undefined);
const VisibilityActionsContext = createContext<VisibilityActions | undefined>(undefined);

VisibilityStateContext.displayName = 'VisibilityStateContext';
VisibilityActionsContext.displayName = 'VisibilityActionsContext';


export type VisibilityProviderProps = {
  children: ReactNode;
  initialState?: VisibilityState;
  mode?: VisibilityMode;
};

const VisibilityProvider: FC<VisibilityProviderProps> = ({
  children,
  initialState = {},
  mode = 'multiple',
}) => {
  const [state, dispatch] = useReducer(visibilityReducer, initialState);

  const toggle = useCallback((key: string) => dispatch({ type: 'TOGGLE', key, mode }), [mode]);
  const set = useCallback(
    (key: string, value: boolean) => dispatch({ type: 'SET', key, value, mode }),
    [mode],
  );
  const reset = useCallback((initial: VisibilityState) => dispatch({ type: 'RESET', initial }), []);

  const actionsValue = useMemo(() => ({ toggle, set, reset }), [toggle, set, reset]);

  return (
    <VisibilityActionsContext.Provider value={actionsValue}>
      <VisibilityStateContext.Provider value={state}>
        {children}
      </VisibilityStateContext.Provider>
    </VisibilityActionsContext.Provider>
  );
};

const MemoizedVisibilityProvider = memo(VisibilityProvider);


function useVisibilityState(): VisibilityState {
  const context = useContext(VisibilityStateContext);
  if (!context) {
    throw new Error('useVisibilityState must be used within a VisibilityProvider');
  }
  return context;
}

function useVisibilityActions(): VisibilityActions {
  const context = useContext(VisibilityActionsContext);
  if (!context) {
    throw new Error('useVisibilityActions must be used within a VisibilityProvider');
  }
  return context;
}


export type UseVisibilityTargetResult = {
  isOpen: boolean;
  toggle: () => void;
  set: (value: boolean) => void;
};

function useVisibilityTarget(targetKey: string): UseVisibilityTargetResult {
  const state = useVisibilityState();
  const { toggle: globalToggle, set: globalSet } = useVisibilityActions();

  const isOpen = Boolean(state[targetKey]);

  const toggle = useCallback(() => {
    globalToggle(targetKey);
  }, [targetKey, globalToggle]);

  const set = useCallback(
    (value: boolean) => {
      globalSet(targetKey, value);
    },
    [targetKey, globalSet],
  );

  return useMemo(() => ({ isOpen, toggle, set }), [isOpen, toggle, set]);
}


export type VisibilityTargetProps = {
  children: ReactElement;
  targetKey: string;
  isOpenPropName?: string;
  shouldRender?: boolean;
  wrapper?: (node: ReactElement, isOpen: boolean) => ReactElement;
  [key: string]: unknown;
};

const VisibilityTarget: FC<VisibilityTargetProps> = ({
  children,
  targetKey,
  isOpenPropName = 'isOpen',
  shouldRender = true,
  wrapper,
  ...restProps
}) => {
  const { isOpen } = useVisibilityTarget(targetKey);

  if (!shouldRender && !isOpen) {
    return null;
  }

  const newProps: Record<string, unknown> = {
    // @ts-expect-error Children first approach has bad TS support
    ...children.props,
    ...restProps,
    [isOpenPropName]: isOpen,
  };

  const cloned = cloneElement(children, newProps);

  return wrapper ? wrapper(cloned, isOpen) : cloned;
};

const MemoizedVisibilityTarget = memo(VisibilityTarget);


interface VisibilityTriggerProps {
  children: ReactElement;
  triggerKey: string;
  propName?: string;
  [key: string]: unknown;
}

const VisibilityTrigger: FC<VisibilityTriggerProps> = ({
  children,
  triggerKey,
  propName = 'onClick',
  ...restProps
}) => {
  const { toggle } = useVisibilityActions();

  if (!isValidElement(children)) {
    throw new Error('VisibilityTrigger child must be a valid React element');
  }

  // @ts-expect-error Children first approach has bad TS support
  const existingOnClick = children.props[propName] as ((e: MouseEvent) => void) | undefined;

  const handleClick = useCallback(
    (e: MouseEvent) => {
      existingOnClick?.(e);
      toggle(triggerKey);
    },
    // `toggle` и `triggerKey` стабильны, `existingOnClick` зависит от `children`
    [existingOnClick, toggle, triggerKey],
  );

  // @ts-expect-error Children first approach has bad TS support
  const newProps = { ...children.props, ...restProps, [propName]: handleClick };

  return cloneElement(children, newProps);
};

const MemoizedVisibilityTrigger = memo(VisibilityTrigger);

export {
  useVisibilityState,
  useVisibilityActions,
  useVisibilityTarget,
  MemoizedVisibilityProvider as VisibilityProvider,
  MemoizedVisibilityTarget as VisibilityTarget,
  MemoizedVisibilityTrigger as VisibilityTrigger,
};
