import { type FC, type ReactElement, type ReactNode } from 'react';
type VisibilityState = Record<string, boolean>;
type VisibilityContextValue = {
    state: VisibilityState;
    toggle: (key: string) => void;
    set: (key: string, value: boolean) => void;
    reset: (initial: VisibilityState) => void;
};
type VisibilityProviderProps = {
    children: ReactNode;
    initialState?: VisibilityState;
};
export declare const VisibilityProvider: FC<VisibilityProviderProps>;
export declare function useVisibility(): VisibilityContextValue;
type VisibilityTargetProps = {
    children: ReactElement;
    targetKey: string;
    isOpenPropName?: string;
    shouldRender?: boolean;
    wrapper?: (node: ReactElement, isOpen: boolean) => ReactElement;
    [key: string]: unknown;
};
export declare const VisibilityTarget: FC<VisibilityTargetProps>;
interface VisibilityTriggerProps {
    children: ReactElement;
    triggerKey: string;
    propName?: string;
    [key: string]: unknown;
}
export declare const VisibilityTrigger: FC<VisibilityTriggerProps>;
type UseVisibilityTargetResult = {
    isOpen: boolean;
    toggle: () => void;
    set: (value: boolean) => void;
};
export declare function useVisibilityTarget(targetKey: string): UseVisibilityTargetResult;
export {};
