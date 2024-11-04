'use client';
import {Button, Select} from "@mantine/core";
import {useLocalStorage} from "@mantine/hooks";
import {useEffect} from "react";
import {OverrideFont} from "@/app/components/OverrideFont";

export const IS_CURSIVE_KEY = 'WEDDING_WEBSITE_IS_CURSIVE';

export function WebsiteHeader() {
    return (
        <OverrideFont>
            <div className={'flex flex-col '}>
                <div className={'flex justify-between align-center'}>
                    <div></div>
                    <div className={"flex justify-center align-center p-8 gap-4 flex-wrap"}>
                        <Button component={"a"} href={"/home"} variant={"outline"} color={"white"}>Home</Button>
                        <Button component={"a"} href={"/rsvp"} variant={"outline"} color={"white"}>RSVP&nbsp; </Button>
                        {/*<Button component={"a"} href={"/itinerary"} variant={"outline"} color={"white"}>Itinerary</Button>*/}
                        <Button component={"a"} href={"/arrangements"} variant={"outline"}
                                color={"white"}>Arrangements</Button>
                        <Button component={"a"} href={"/faq"} variant={"outline"} color={"white"}>FAQ</Button>
                        <Button component={"a"} href={"/registry"} variant={"outline"} color={"white"}>Registry</Button>
                        <Button component={"a"} href={"/engagement-photos"} variant={"outline"} color={"white"}>Engagement
                            Photos</Button>
                    </div>
                    <div></div>
                </div>
            </div>
        </OverrideFont>
    );
}