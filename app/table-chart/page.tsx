'use client';
import {applyNodeChanges, Background, Controls, ReactFlow} from "@xyflow/react";
import {Card, Button} from '@mantine/core';
import '@xyflow/react/dist/style.css';
import {useCallback, useEffect, useMemo, useState} from "react";
import TableNode from "@/app/table-chart/TableNode";
import EditTableModal from "@/app/table-chart/EditTableModal";
import useTables from "@/app/hooks/useTables";
import {Table} from "@/types/table";
import {DEFAULT_TABLE_COLOR} from "@/constants/app-constants";
import {getFirstMissingInteger, getFirstMissingTableNumber, getUsedTableNumbers} from "@/app/util/table-util";

const getDefaultTable = (tableNumber: number): Table => ({
    tableNumber,
    guests: [] as string[],
    coordinates: {
        x: 10,
        y: 10
    },
    shape: 'circle',
    color: DEFAULT_TABLE_COLOR
});

export default function TableChartPage() {
    const {tables, createOrUpdateTable} = useTables({fetchTablesOnInit: true});
    const [originalNodes, setOriginalNodes] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [tableToEdit, setTableToEdit] = useState(null as Table);
    const hasChanges = nodes.filter(nwt =>
        !nwt.table || (nwt.table.coordinates.x !== nwt.position.x || nwt.table.coordinates.y !== nwt.position.y)
    ).length > 0;

    useEffect(() => {
        if (tables) {
            const updatedNodes = tables.map((table, index) => {
                const DEFAULT_X = 150 + (200 * index);
                const DEFAULT_Y = 100;
                return ({
                    id: `table-${table.tableId}`,
                    type: 'table',
                    position: {
                        x: table ? table.coordinates.x : DEFAULT_X,
                        y: table ? table.coordinates.y : DEFAULT_Y
                    },
                    data: {table, setTableToEdit, shape: 'circle'}
                });
            });
            setNodes(updatedNodes);
            setOriginalNodes(updatedNodes);
        }
    }, [tables]);

    const onNodesChange = useCallback((changes) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    }, []);
    const nodeTypes = useMemo(() => ({table: TableNode}), []);

    const CreateTableButton = () => {
        const createTable = async () => {
            const tableNumber = getFirstMissingTableNumber(tables);
            await createOrUpdateTable(getDefaultTable(tableNumber));
        };
        return (
            <Button
                variant={'outline'}
                className={'z-50'}
                onClick={createTable}
            >
                Create Table
            </Button>
        )
    };

    return (
        <div className={'sm:p-4 md:p-8'}>
            <Card className={'h-96'}>
                <EditTableModal
                    table={tableToEdit}
                    setTableToEdit={setTableToEdit}
                    isOpen={Boolean(tableToEdit)}
                    setIsOpen={(value) => setTableToEdit(value ? tableToEdit : null)}
                />
                <ReactFlow
                    nodeTypes={nodeTypes}
                    nodes={nodes}
                    onNodesChange={onNodesChange}
                    panOnScroll
                >
                    {hasChanges ?
                        <div className={'flex gap-2 w-full justify-end'}>
                            <CreateTableButton/>
                            <Button
                                color={'green'}
                                variant={'outline'}
                                className={'z-50'}
                                onClick={async () => {
                                    for (let node of nodes) {
                                        if (
                                            !node.table ||
                                            (node.table &&
                                                (
                                                    node.table.coordinates.x !== node.position.x ||
                                                    node.table.coordinates.y !== node.position.y
                                                )
                                            )
                                        ) {
                                            await createOrUpdateTable({
                                                ...(node.table ? node.table : {
                                                    tableNumber: node.data.tableNumber,
                                                    shape: node.data.shape
                                                }),
                                                coordinates: {
                                                    x: node.position.x,
                                                    y: node.position.y
                                                }
                                            });
                                        }
                                    }
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                color={'red'}
                                variant={'outline'}
                                className={'z-50'}
                                onClick={() => {
                                    setNodes(originalNodes);
                                }}
                            >
                                Reset
                            </Button>
                        </div> :
                        <div className={'flex gap-2 w-full justify-end'}>
                            <CreateTableButton/>
                        </div>
                    }
                    <Background/>
                    <Controls/>
                </ReactFlow>
            </Card>
        </div>
    )
}