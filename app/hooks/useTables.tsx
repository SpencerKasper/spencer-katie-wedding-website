import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import axios from "axios";
import {getTablesEndpointUrl} from "@/app/util/api-util";
import {Table} from "@/types/table";
import {useEffect} from "react";
import {setTables} from "@/lib/reducers/appReducer";

const useTables = ({fetchTablesOnInit = false} = {fetchTablesOnInit: false}) => {
    const tables = useAppSelector(state => state.app.tables);
    const dispatch = useAppDispatch();

    const getTables = async () => {
        const response = await axios.get(getTablesEndpointUrl());
        return extractTablesFromResponseAndSetInRedux(response);
    };

    const setOrUpdateTable = async (table: Table) => {
        const response = await axios.post(getTablesEndpointUrl(), table);
        return extractTablesFromResponseAndSetInRedux(response);
    }

    function extractTablesFromResponseAndSetInRedux(response: axios.AxiosResponse<{ tables: Table[] }>) {
        const extractedTables = response.data.tables;
        dispatch(setTables({tables: extractedTables}));
        return extractedTables;
    }

    useEffect(() => {
        if (fetchTablesOnInit) {
            getTables().then();
        }
    }, [fetchTablesOnInit]);

    return {
        tables,
        getTables,
        setOrUpdateTable,
    };
}

export default useTables;