import { type ReactElement, type ReactNode } from 'react';
export type VisibilityState = Record<string, boolean>;
export type VisibilityMode = 'single' | 'multiple';
type VisibilityActions = {
    toggle: (key: string) => void;
    set: (key: string, value: boolean) => void;
    reset: (initial: VisibilityState) => void;
};
export type VisibilityProviderProps = {
    children: ReactNode;
    initialState?: VisibilityState;
    mode?: VisibilityMode;
};
declare const MemoizedVisibilityProvider: import("react").NamedExoticComponent<VisibilityProviderProps>;
declare function useVisibilityState(): VisibilityState;
declare function useVisibilityActions(): VisibilityActions;
export type UseVisibilityTargetResult = {
    isOpen: boolean;
    toggle: () => void;
    set: (value: boolean) => void;
};
declare function useVisibilityTarget(targetKey: string): UseVisibilityTargetResult;
export type VisibilityTargetProps = {
    children: ReactElement;
    targetKey: string;
    isOpenPropName?: string;
    shouldRender?: boolean;
    wrapper?: (node: ReactElement, isOpen: boolean) => ReactElement;
    [key: string]: unknown;
};
declare const MemoizedVisibilityTarget: import("react").NamedExoticComponent<VisibilityTargetProps>;
interface VisibilityTriggerProps {
    children: ReactElement;
    triggerKey: string;
    propName?: string;
    [key: string]: unknown;
}
declare const MemoizedVisibilityTrigger: import("react").NamedExoticComponent<VisibilityTriggerProps>;
export { useVisibilityState, useVisibilityActions, useVisibilityTarget, MemoizedVisibilityProvider as VisibilityProvider, MemoizedVisibilityTarget as VisibilityTarget, MemoizedVisibilityTrigger as VisibilityTrigger, };
