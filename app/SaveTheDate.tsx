'use client';
import {OverrideFont} from "@/app/components/OverrideFont";
import KatieAndSpencersWeddingTitle from "@/app/KatieAndSpencersWeddingTitle";
import EmailModal from "@/app/EmailModal";
import useLoggedInGuest from "@/app/hooks/useLoggedInGuest";
import Image from "next/image";
import {Popover, Tooltip} from "@mantine/core";

const SaveTheDate = () => {
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Katie+and+Spencer's+Wedding&details=Spencer Kasper and Katie Riek are getting married!&dates=20251011T160000/20251011T230000&ctz=America/Chicago&location=3500 Midwest Road, Oak Brook, IL 60523 USA`
    return (
        <div className={'text-white full-w flex flex-col justify-center items-center text-center flex-wrap p-4 sm:p-8'}>
            <KatieAndSpencersWeddingTitle/>
            <div className={'py-4'}>
                <Tooltip label={'Save to Google Calendar'}>
                    <a
                        href={googleCalendarUrl}
                        target={'_blank'}
                    >
                        <Image
                            width={64}
                            height={64}
                            src={'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg'}
                            className={'text-xl sm:text-2xl underline cursor-pointer'}
                            alt={'google-calendar-logo'}
                        />
                    </a>
                </Tooltip>
            </div>
        </div>
    );
};

export default SaveTheDate;