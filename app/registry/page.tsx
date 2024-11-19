import EmailModal from "@/app/EmailModal";
import useLoggedInGuest from "@/app/hooks/useLoggedInGuest";

export default function RegistryPage() {
    const {loggedInGuest} = useLoggedInGuest();
    return (
        <div className={'flex justify-center align-center'}>
            <EmailModal loggedInGuest={loggedInGuest}/>
            <iframe
                className={'w-full md:w-9/12 h-dvh'}
                src={'https://www.honeyfund.com/site/kasper-riek-10-11-2025?no_gdpr=1'}
            />
        </div>
    )
}