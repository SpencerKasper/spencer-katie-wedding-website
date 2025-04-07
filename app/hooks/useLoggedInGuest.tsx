'use client';
import {Guest} from "@/types/guest";
import {useEffect, useState} from "react";
import {
    FIRST_NAME_LOCAL_STORAGE_KEY,
    LAST_NAME_LOCAL_STORAGE_KEY,
    PASSWORD_LOCAL_STORAGE_KEY,
    WEDDING_GUEST_LOCAL_STORAGE_KEY
} from "@/app/loginPageClient";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {setLoggedInGuest, setPossibleGuests} from "@/lib/reducers/appReducer";
import {RootState} from "@/lib/store";


interface AuthorizationResponse {isAuthorized: boolean; guest: Guest; possibleGuests?: Guest[];}

interface UseLoggedInGuestOutput {
    loggedInGuest: Guest;
    isLoading: boolean;
    validateLoginInfo: (loginInfo, guestId) => Promise<AuthorizationResponse>;
}

export default (): UseLoggedInGuestOutput => {
    const loggedInGuest = useAppSelector((state) => state.app.loggedInGuest);
    const possibleGuests = useAppSelector((state) => state.app.possibleGuests);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const firstName = localStorage.getItem(FIRST_NAME_LOCAL_STORAGE_KEY);
        const lastName = localStorage.getItem(LAST_NAME_LOCAL_STORAGE_KEY);
        const password = localStorage.getItem(PASSWORD_LOCAL_STORAGE_KEY);
        if (firstName && lastName && password && firstName !== '' && lastName !== '' && password !== '') {
            validateLoginInfo({firstName, lastName, password})
                .then(response => {
                    if (response.isAuthorized) {
                        const guest = response.guest as Guest;
                        dispatch(setLoggedInGuest({loggedInGuest: guest}));
                        setIsLoading(false);
                        router.push('/home');
                    } else if(response.possibleGuests && response.possibleGuests.length) {
                        dispatch(setPossibleGuests({possibleGuests: response.possibleGuests}));
                        setIsLoading(false);
                    } else {
                        setIsLoading(false);
                        router.push('/');
                    }
                });
        } else {
            setIsLoading(false);
            router.push('/');
        }
    }, []);

    const validateLoginInfo = async (loginInfo, guestId = ''): Promise<AuthorizationResponse> => {
        const queryParams = guestId && guestId !== '' ? `?guestId=${guestId}` : '';
        const response = await axios.post(`${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/authorize${queryParams}`, loginInfo);
        if (response.data.isAuthorized && response.data.guest) {
            const guest = response.data.guest;
            localStorage.setItem(FIRST_NAME_LOCAL_STORAGE_KEY, loginInfo.firstName);
            localStorage.setItem(LAST_NAME_LOCAL_STORAGE_KEY, loginInfo.lastName);
            localStorage.setItem(PASSWORD_LOCAL_STORAGE_KEY, loginInfo.password);
            localStorage.setItem(WEDDING_GUEST_LOCAL_STORAGE_KEY, JSON.stringify(guest));
        }
        return response.data as AuthorizationResponse;
    };

    return {
        loggedInGuest,
        possibleGuests,
        isLoading,
        validateLoginInfo,
    };
}