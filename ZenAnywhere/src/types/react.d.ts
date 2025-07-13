// Type definitions for React
declare namespace React {
  type ReactNode = any;
  type ComponentType<P = any> = any;
  type FC<P = {}> = any;
  type ReactElement = any;
  type ComponentState = any;
  type Component = any;
  type ReactInstance = any;
  type ReactNodeArray = any;
  type ReactPortal = any;
  type Key = string | number;
  type Ref<T> = any;
  type ComponentClass<P = any> = any;
  type FunctionComponent<P = {}> = any;
  type ForwardedRef<T> = any;
  type MutableRefObject<T> = any;
  type RefObject<T> = any;
  type ReactChild = ReactElement | string | number;
  type ReactText = string | number;
  type ReactFragment = {} | ReactNodeArray;
  type ReactElement = any;
  
  interface Attributes {
    key?: Key | null;
  }
  
  interface ClassAttributes<T> extends Attributes {
    ref?: Ref<T>;
  }
  
  interface FunctionComponentElement<T> extends ReactElement {
    ref?: Ref<T>;
  }
  
  interface ComponentClass<P = {}, S = ComponentState> {
    new(props: P, context?: any): Component<P, S>;
  }
  
  interface Component<P = {}, S = any> {
    props: P;
    state: S;
    context: any;
    refs: {
      [key: string]: Component<any> | Element;
    };
  }
}

declare module 'react' {
  export = React;
  export as namespace React;
}
