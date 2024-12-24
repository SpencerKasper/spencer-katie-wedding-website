'use client';
import {Burger, Button, Select} from "@mantine/core";
import {useDisclosure, useLocalStorage} from "@mantine/hooks";
import {useEffect} from "react";
import {OverrideFont} from "@/app/components/OverrideFont";
import {APP_MODE} from "@/constants/app-constants";
import useLoggedInGuest from "@/app/hooks/useLoggedInGuest";
import EmailModal from "@/app/EmailModal";
import {useBreakpoint} from "@/app/hooks/useBreakpoint";

export const IS_CURSIVE_KEY = 'WEDDING_WEBSITE_IS_CURSIVE';

export function WebsiteHeader() {
    const isAtMostMd = useBreakpoint('md');
    const [isOpen, {toggle}] = useDisclosure();
    const {loggedInGuest} = useLoggedInGuest();
    const ArrangementsButton = <Button component={"a"} href={"/arrangements"} variant={"outline"}
                                       color={"white"}>Arrangements</Button>;
    const FAQButton = <Button component={"a"} href={"/faq"} variant={"outline"} color={"white"}>FAQ</Button>;
    const HomeButton = <Button component={"a"} href={"/home"} variant={"outline"} color={"white"}>Home</Button>;
    const EngagementPhotosButton = <Button component={"a"} href={"/engagement-photos"} variant={"outline"}
                                           color={"white"}>Engagement Photos</Button>;
    return (
        <OverrideFont>
            <div className={'flex justify-between w-full p-4 md:p-8'}>
                {isAtMostMd ? <Burger opened={isOpen} onClick={toggle} color={'white'}></Burger> : <div></div>}
                <p className={'text-white'}>{loggedInGuest ? `Welcome, ${loggedInGuest.firstName} ${loggedInGuest.lastName}` : ''}</p>
            </div>
            <EmailModal loggedInGuest={loggedInGuest}/>
            <div className={'flex flex-col text-white'}>
                {(isAtMostMd && isOpen) || !isAtMostMd ?
                    <div className={'flex flex-col '}>
                        <div className={"flex justify-center align-center p-8 gap-4 flex-wrap"}>
                            {APP_MODE === 'FULL' ?
                                <>
                                    {HomeButton}
                                    <Button component={"a"} href={"/rsvp"} variant={"outline"}
                                            color={"white"}>RSVP&nbsp; </Button>
                                    {/*<Button component={"a"} href={"/itinerary"} variant={"outline"} color={"white"}>Itinerary</Button>*/}
                                    {ArrangementsButton}
                                    {FAQButton}
                                    <Button component={"a"} href={"/registry"} variant={"outline"}
                                            color={"white"}>Registry</Button>
                                    {EngagementPhotosButton}
                                </> :
                                <>
                                    {HomeButton}
                                    {ArrangementsButton}
                                    {FAQButton}
                                    {EngagementPhotosButton}
                                </>
                            }
                        </div>
                    </div> :
                    <></>
                }
            </div>
        </OverrideFont>
    );
}