'use client';
import {OverrideFont} from "@/app/components/OverrideFont";
import KatieAndSpencersWeddingTitle from "@/app/KatieAndSpencersWeddingTitle";
import EmailModal from "@/app/EmailModal";
import useLoggedInGuest from "@/app/hooks/useLoggedInGuest";

const SaveTheDate = () => {
    const {loggedInGuest} = useLoggedInGuest();
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Katie+and+Spencer's+Wedding&details=Spencer Kasper and Katie Riek are getting married!&dates=20251011T160000/20251011T230000&ctz=America/Chicago&location=3500 Midwest Road, Oak Brook, IL 60523 USA`
    return (
        <div className={'text-white full-w flex flex-col justify-center items-center text-center flex-wrap p-4 sm:p-8'}>
            <KatieAndSpencersWeddingTitle />
            <EmailModal loggedInGuest={loggedInGuest}/>
            <div className={'py-4'}>
                <a
                    className={'text-xl sm:text-2xl underline cursor-pointer'}
                    href={googleCalendarUrl}
                    target={'_blank'}
                >Save the Date and Add to Your Google Calendar</a>
            </div>
        </div>
    );
};

export default SaveTheDate;