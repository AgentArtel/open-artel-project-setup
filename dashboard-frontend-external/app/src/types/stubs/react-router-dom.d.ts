// Stub type definitions for react-router-dom
declare module 'react-router-dom' {
  import * as React from 'react';
  
  export interface BrowserRouterProps {
    children?: React.ReactNode;
  }
  export function BrowserRouter(props: BrowserRouterProps): JSX.Element;
  
  export interface RoutesProps {
    children?: React.ReactNode;
  }
  export function Routes(props: RoutesProps): JSX.Element;
  
  export interface RouteProps {
    path?: string;
    element?: React.ReactNode;
    children?: React.ReactNode;
    index?: boolean;
  }
  export function Route(props: RouteProps): JSX.Element;
  
  export interface LinkProps {
    to: string;
    children?: React.ReactNode;
    className?: string;
  }
  export function Link(props: LinkProps): JSX.Element;
  
  export interface NavigateProps {
    to: string;
    replace?: boolean;
  }
  export function Navigate(props: NavigateProps): JSX.Element;
  
  export interface OutletProps {}
  export function Outlet(props: OutletProps): JSX.Element;
  
  export function useParams<T = Record<string, string>>(): T;
  export function useLocation(): { pathname: string; search: string; hash: string };
  export function useNavigate(): (to: string) => void;
}
