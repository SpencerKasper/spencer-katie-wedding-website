'use client';
import {Burger} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {OverrideFont} from "@/app/components/OverrideFont";
import useLoggedInGuest from "@/app/hooks/useLoggedInGuest";
import EmailModal from "@/app/EmailModal";
import {useBreakpoint} from "@/app/hooks/useBreakpoint";
import {usePathname} from "next/navigation";
import {HeaderButtons} from "@/app/HeaderButtons";
import MobileNavigationModal from "@/app/MobileNavigationModal";

export const IS_CURSIVE_KEY = 'WEDDING_WEBSITE_IS_CURSIVE';

const HIDE_NAVBAR_PATHS = ['/', '/login'];

export const WebsiteHeader = () => {
    const isAtMostMd = useBreakpoint('md');
    const pathname = usePathname();
    const [isOpen, {toggle}] = useDisclosure();
    const {loggedInGuest} = useLoggedInGuest();
    return !HIDE_NAVBAR_PATHS.includes(pathname) ?
        <OverrideFont>
            <div className={'flex justify-between w-full p-4 md:p-8'}>
                {isAtMostMd ? <Burger opened={isOpen} onClick={toggle} color={'white'}></Burger> : <div></div>}
                <p className={'text-white'}>{loggedInGuest ? `Welcome, ${loggedInGuest.firstName} ${loggedInGuest.lastName}` : ''}</p>
            </div>
            <EmailModal loggedInGuest={loggedInGuest}/>
            {!isAtMostMd || (isAtMostMd && isOpen) ?
                <HeaderButtons /> :
                <></>
            }
        </OverrideFont> :
        <div className={'p-8'}></div>;
};