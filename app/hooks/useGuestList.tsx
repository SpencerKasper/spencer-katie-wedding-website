import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {Guest} from "@/types/guest";
import {setGuests as setGuestsAction} from "@/lib/reducers/appReducer";
import {getGuestListEndpointUrl} from "@/app/util/api-util";
import {Table} from "@/types/table";

interface UseGuestListProps {
    guests: Guest[];
    getGuests: () => Promise<Guest[]>;
    setGuests: (guests: Guest[]) => void;
    getGuestsAtTable: (table: Table) => Guest[];
    getGuestsAtTableNumber: (tableNumber: number, tables: Table[]) => Guest[];
    isLoadingGuests: boolean;
}

const defaultProps = {getGuestsOnInstantiation: false};
const useGuestList = ({getGuestsOnInstantiation = false} = defaultProps): UseGuestListProps => {
    const [isLoadingGuests, setIsLoadingGuests] = useState(false);
    const guests: Guest[] = useAppSelector(state => state.app.guests);
    const dispatch = useAppDispatch();

    const getGuests = useCallback(async () => {
        setIsLoadingGuests(true);
        const guestListResponse = await axios.get(getGuestListEndpointUrl());
        const updatedGuests = guestListResponse.data.guests as Guest[];
        await dispatch(setGuestsAction({guests: updatedGuests}));
        setIsLoadingGuests(false);
        return updatedGuests;
    }, [dispatch]);

    const setGuests = useCallback(async (guests: Guest[]) => {
        dispatch(setGuestsAction({guests}));
    }, [dispatch]);

    const getGuestsAtTable = (table: Table) => table ?
        guests.filter(guest => table.guests.find(guestId => guestId === guest.guestId)) :
        [];

    const getGuestsAtTableNumber = (tableNumber: number, tables: Table[]) => getGuestsAtTable(tables.find(t => t.tableNumber === tableNumber))

    useEffect(() => {
        if (getGuestsOnInstantiation) {
            getGuests().then();
        }
    }, [getGuests, getGuestsOnInstantiation]);

    return {
        guests,
        getGuests,
        setGuests,
        getGuestsAtTable,
        getGuestsAtTableNumber,
        isLoadingGuests
    };
}

export default useGuestList;