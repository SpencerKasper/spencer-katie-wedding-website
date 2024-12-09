'use client';
import {applyNodeChanges, Background, Controls, ReactFlow} from "@xyflow/react";
import {Card} from '@mantine/core';
import '@xyflow/react/dist/style.css';
import {useCallback, useEffect, useMemo, useState} from "react";
import TableNode from "@/app/table-chart/TableNode";
import useGuestList from "@/app/hooks/useGuestList";
import EditTableModal from "@/app/table-chart/EditTableModal";

export default function TableChartPage() {
    const {guests} = useGuestList({getGuestsOnInstantiation: true});
    const [nodes, setNodes] = useState([]);
    const [tableNumberToEdit, setTableNumberToEdit] = useState(-1);

    useEffect(() => {
        const groupedByTable = Object.groupBy(guests.filter(g => g.tableNumber), ({tableNumber}) => tableNumber);
        const updatedNodes = Object.keys(groupedByTable).map((tableNumber, index) => ({
            id: `table-${tableNumber}`,
            type: 'table',
            position: {x: 300 * index, y: 300},
            data: {tableNumber: Number(tableNumber), setTableNumberToEdit, shape: 'circle'}
        }));
        setNodes(updatedNodes);
    }, [guests]);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );
    const nodeTypes = useMemo(() => ({ table: TableNode }), []);

    return (
        <div className={'sm:p-4 md:p-8'}>
            <Card className={'h-96'}>
                <EditTableModal
                    tableNumber={tableNumberToEdit}
                    setTableNumber={setTableNumberToEdit}
                    isOpen={tableNumberToEdit > 0}
                    setIsOpen={(value) => setTableNumberToEdit(value ? tableNumberToEdit : -1)}
                />
                <ReactFlow nodeTypes={nodeTypes} nodes={nodes} onNodesChange={onNodesChange}>
                    <Background/>
                    <Controls/>
                </ReactFlow>
            </Card>
        </div>
    )
}