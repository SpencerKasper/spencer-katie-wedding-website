import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import axios, {AxiosResponse} from "axios";
import {getTablesEndpointUrl} from "@/app/util/api-util";
import {Table} from "@/types/table";
import {useEffect, useState} from "react";
import {setTables as setTablesAction} from "@/lib/reducers/appReducer";
import {getUsedTableNumbers} from "@/app/util/table-util";
import {Guest} from "@/types/guest";

interface UseTableProps {
    fetchTablesOnInit: boolean;
}

const useTables = ({fetchTablesOnInit = false}: UseTableProps = {fetchTablesOnInit: false}) => {
    const [isLoadingTables, setIsLoadingTables] = useState(false);
    const tables = useAppSelector(state => state.app.tables);
    const dispatch = useAppDispatch();

    const extractTablesFromResponseAndSetInRedux = (response: AxiosResponse<{ tables: Table[] }>) => {
        const extractedTables = response.data.tables;
        setTables(extractedTables)
        return extractedTables;
    };

    const setTables = (tables: Table[]) => {
        dispatch(setTablesAction({tables}));
    }

    const getTables = async () => {
        setIsLoadingTables(true);
        const response = await axios.get(getTablesEndpointUrl());
        const updatedTables = extractTablesFromResponseAndSetInRedux(response);
        setIsLoadingTables(false);
        return updatedTables;
    };

    const createOrUpdateTable = async (table: Table) => {
        const response = await axios.post(getTablesEndpointUrl(), table);
        return extractTablesFromResponseAndSetInRedux(response);
    }

    const tableNumberExists = (tableNumber: number) => getUsedTableNumbers(tables).includes(tableNumber);
    const getGuestsTable = (guest: Guest) => guest ? tables.find(t => t.guests.find(guestId => guestId === guest.guestId)) : null;

    useEffect(() => {
        if (fetchTablesOnInit) {
            getTables().then();
        }
    }, [fetchTablesOnInit]);

    return {
        tables,
        getTables,
        setTables,
        createOrUpdateTable,
        tableNumberExists,
        getGuestsTable,
        isLoadingTables
    };
}

export default useTables;