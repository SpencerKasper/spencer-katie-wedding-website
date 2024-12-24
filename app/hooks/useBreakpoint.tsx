import {useMediaQuery} from 'react-responsive';
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);

const breakpoints = fullConfig.theme.screens;

type BreakpointKey = keyof typeof breakpoints;

export function useBreakpoint<K extends BreakpointKey>(breakpointKey: K) {
    return useMediaQuery({
        query: `(max-width: ${breakpoints[breakpointKey]})`,
    });
}