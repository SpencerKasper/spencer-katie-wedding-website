import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {useCallback, useEffect} from "react";
import axios from "axios";
import {Guest} from "@/types/guest";
import {setGuests as setGuestsAction} from "@/lib/reducers/appReducer";
import {getGuestListEndpointUrl} from "@/app/util/api-util";

interface UseGuestListProps {
    guests: Guest[];
    getGuests: () => Promise<Guest[]>;
    setGuests: (guests: Guest[]) => void;
}

const defaultProps = {getGuestsOnInstantiation: false};
const useGuestList = ({getGuestsOnInstantiation = false} = defaultProps): UseGuestListProps => {
    const guests: Guest[] = useAppSelector(state => state.app.guests);
    const dispatch = useAppDispatch();

    const getGuests = useCallback(async () => {
        const guestListResponse = await axios.get(getGuestListEndpointUrl());
        const updatedGuests = guestListResponse.data.guests as Guest[];
        await dispatch(setGuestsAction({guests: updatedGuests}));
        return updatedGuests;
    }, [dispatch]);

    const setGuests = useCallback(async (guests: Guest[]) => {
        dispatch(setGuestsAction({guests}));
    }, [dispatch]);

    useEffect(() => {
        if (getGuestsOnInstantiation) {
            getGuests().then();
        }
    }, [getGuests, getGuestsOnInstantiation]);

    return {
        guests,
        getGuests,
        setGuests,
    };
}

export default useGuestList;