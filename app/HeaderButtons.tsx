import {Button} from "@mantine/core";
import {APP_MODE} from "@/constants/app-constants";

export const HeaderButtons = () => {
    const ArrangementsButton = <Button component={"a"} href={"/arrangements"} variant={"outline"}
                                       color={"white"}>Arrangements</Button>;
    const FAQButton = <Button component={"a"} href={"/faq"} variant={"outline"} color={"white"}>FAQ</Button>;
    const HomeButton = <Button component={"a"} href={"/home"} variant={"outline"} color={"white"}>Home</Button>;
    const EngagementPhotosButton = <Button component={"a"} href={"/engagement-photos"} variant={"outline"}
                                           color={"white"}>Engagement Photos</Button>;
    return (
        <div className={"flex flex-col text-white"}>
            <div className={"flex flex-col "}>
                <div className={"flex justify-center align-center p-8 gap-4 flex-wrap"}>
                    {APP_MODE === "FULL" ?
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
            </div>
        </div>
    );
};