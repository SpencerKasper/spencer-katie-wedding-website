'use client';
import {useLocalStorage} from "@mantine/hooks";
import {IS_CURSIVE_KEY} from "@/app/WebsiteHeader";
import {useEffect, useState} from "react";

export const OverrideFont = ({fontFamily = '"Playwrite DK Uloopet", cursive', children}) => {
    const [isCursive, setIsCursive] = useState(false);
    return !isCursive ?
        <div style={{fontFamily}}>
            {children}
        </div> :
        children;
}