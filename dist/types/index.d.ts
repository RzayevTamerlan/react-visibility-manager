import { type ReactElement, type ReactNode } from 'react';
export type VisibilityState = Record<string, boolean>;
export type VisibilityContextValue = {
    state: VisibilityState;
    toggle: (key: string) => void;
    set: (key: string, value: boolean) => void;
    reset: (initial: VisibilityState) => void;
};
export type VisibilityMode = 'single' | 'multiple';
export type VisibilityProviderProps = {
    children: ReactNode;
    initialState?: VisibilityState;
    mode?: VisibilityMode;
};
declare const MemoizedVisibilityProvider: import("react").NamedExoticComponent<VisibilityProviderProps>;
declare function useVisibility(): VisibilityContextValue;
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
export type UseVisibilityTargetResult = {
    isOpen: boolean;
    toggle: () => void;
    set: (value: boolean) => void;
};
declare function useVisibilityTarget(targetKey: string): UseVisibilityTargetResult;
export { useVisibility, useVisibilityTarget, MemoizedVisibilityProvider as VisibilityProvider, MemoizedVisibilityTarget as VisibilityTarget, MemoizedVisibilityTrigger as VisibilityTrigger, };
