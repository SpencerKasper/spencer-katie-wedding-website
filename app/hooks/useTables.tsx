import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import axios from "axios";
import {getTablesEndpointUrl} from "@/app/util/api-util";
import {Table} from "@/types/table";
import {useEffect} from "react";
import {setTables} from "@/lib/reducers/appReducer";
import {getUsedTableNumbers} from "@/app/util/table-util";

const useTables = ({fetchTablesOnInit = false} = {fetchTablesOnInit: false}) => {
    const tables = useAppSelector(state => state.app.tables);
    const dispatch = useAppDispatch();

    const extractTablesFromResponseAndSetInRedux = (response: axios.AxiosResponse<{ tables: Table[] }>) => {
        const extractedTables = response.data.tables;
        dispatch(setTables({tables: extractedTables}));
        return extractedTables;
    };

    const getTables = async () => {
        const response = await axios.get(getTablesEndpointUrl());
        return extractTablesFromResponseAndSetInRedux(response);
    };

    const createOrUpdateTable = async (table: Table) => {
        const response = await axios.post(getTablesEndpointUrl(), table);
        return extractTablesFromResponseAndSetInRedux(response);
    }

    const tableNumberExists = (tableNumber: number) => getUsedTableNumbers(tables).includes(tableNumber);

    useEffect(() => {
        if (fetchTablesOnInit) {
            getTables().then();
        }
    }, [fetchTablesOnInit]);

    return {
        tables,
        getTables,
        createOrUpdateTable,
        tableNumberExists
    };
}

export default useTables;