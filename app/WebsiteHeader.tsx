'use client';
import {Button, Select} from "@mantine/core";
import {useLocalStorage} from "@mantine/hooks";
import {useEffect} from "react";
import {OverrideFont} from "@/app/components/OverrideFont";
import {APP_MODE} from "@/constants/app-constants";
import useLoggedInGuest from "@/app/hooks/useLoggedInGuest";
import EmailModal from "@/app/EmailModal";

export const IS_CURSIVE_KEY = 'WEDDING_WEBSITE_IS_CURSIVE';

export function WebsiteHeader() {
    const {loggedInGuest} = useLoggedInGuest();
    const ArrangementsButton = <Button component={"a"} href={"/arrangements"} variant={"outline"}
                                       color={"white"}>Arrangements</Button>;
    const FAQButton = <Button component={"a"} href={"/faq"} variant={"outline"} color={"white"}>FAQ</Button>;
    const HomeButton = <Button component={"a"} href={"/home"} variant={"outline"} color={"white"}>Home</Button>;
    const EngagementPhotosButton = <Button component={"a"} href={"/engagement-photos"} variant={"outline"} color={"white"}>Engagement Photos</Button>;
    return (
        <OverrideFont>
            <EmailModal loggedInGuest={loggedInGuest}/>
            <div className={'flex flex-col text-white'}>
                <div className={'flex flex-col sm:flex-row sm:justify-between sm:align-center'}>
                    <div className={'sm:w-1/4'}></div>
                    <div className={"flex justify-center align-center p-8 gap-4 flex-wrap sm:w-1/2"}>
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
                    <div className={'sm:w-1/4 flex justify-center pt-8'}>{loggedInGuest ? `Welcome, ${loggedInGuest.firstName} ${loggedInGuest.lastName}!` : ''}</div>
                </div>
            </div>
        </OverrideFont>
    );
}