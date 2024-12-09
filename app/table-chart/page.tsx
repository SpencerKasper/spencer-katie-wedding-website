'use client';
import {applyNodeChanges, Background, Controls, ReactFlow} from "@xyflow/react";
import {Card, Button} from '@mantine/core';
import '@xyflow/react/dist/style.css';
import {useCallback, useEffect, useMemo, useState} from "react";
import TableNode from "@/app/table-chart/TableNode";
import useGuestList from "@/app/hooks/useGuestList";
import EditTableModal from "@/app/table-chart/EditTableModal";
import useTables from "@/app/hooks/useTables";

export default function TableChartPage() {
    const {guests} = useGuestList({getGuestsOnInstantiation: true});
    const {tables, setOrUpdateTable} = useTables({fetchTablesOnInit: true});
    const [originalNodes, setOriginalNodes] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [tableNumberToEdit, setTableNumberToEdit] = useState(-1);
    const hasChanges = nodes.filter(nwt =>
        !nwt.table || (nwt.table.coordinates.x !== nwt.position.x || nwt.table.coordinates.y !== nwt.position.y)
    ).length > 0;

    useEffect(() => {
        if(tables && guests) {
            const groupedByTable = Object.groupBy(guests.filter(g => g.tableNumber), ({tableNumber}) => tableNumber);
            const updatedNodes = Object.keys(groupedByTable).map((tableNumber, index) => {
                const DEFAULT_X = 150 + (200 * index);
                const DEFAULT_Y = 100;
                const table = tables.find(t => Number(t.tableNumber) === Number(tableNumber));
                return ({
                    id: `table-${tableNumber}`,
                    type: 'table',
                    position: {
                        x: table ? table.coordinates.x : DEFAULT_X,
                        y: table ? table.coordinates.y : DEFAULT_Y
                    },
                    data: {tableNumber: Number(tableNumber), setTableNumberToEdit, shape: 'circle'},
                    table
                });
            });
            setNodes(updatedNodes);
            setOriginalNodes(updatedNodes);
        }
    }, [guests, tables]);

    const onNodesChange = useCallback((changes) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    }, []);
    const nodeTypes = useMemo(() => ({table: TableNode}), []);

    return (
        <div className={'sm:p-4 md:p-8'}>
            <Card className={'h-96'}>
                <EditTableModal
                    tableNumber={tableNumberToEdit}
                    setTableNumber={setTableNumberToEdit}
                    isOpen={tableNumberToEdit > 0}
                    setIsOpen={(value) => setTableNumberToEdit(value ? tableNumberToEdit : -1)}
                />
                <ReactFlow
                    nodeTypes={nodeTypes}
                    nodes={nodes}
                    onNodesChange={onNodesChange}
                    panOnScroll
                >
                    {hasChanges ?
                        <div className={'flex gap-2 w-full justify-end'}>
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
                                            await setOrUpdateTable({
                                                ...(node.table ? node.table : {tableNumber: node.data.tableNumber, shape: node.data.shape}),
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
                        <></>
                    }
                    <Background/>
                    <Controls/>
                </ReactFlow>
            </Card>
        </div>
    )
}