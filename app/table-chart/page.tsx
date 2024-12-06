'use client';
import {applyNodeChanges, Background, Controls, ReactFlow} from "@xyflow/react";
import {Card} from '@mantine/core';
import '@xyflow/react/dist/style.css';
import {useCallback, useEffect, useMemo, useState} from "react";
import TableNode from "@/app/table-chart/TableNode";
import {Guest} from "@/types/guest";
import axios from "axios";

export default function TableChartPage() {
    const [guests, setGuests] = useState([] as Guest[]);
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        const refreshGuests = () => {
            const url = `${process.env.NEXT_PUBLIC_WEDDING_API_URL}/api/guestlist`;
            axios.get(url)
                .then(guestListResponse => setGuests(guestListResponse.data.guests));
        };
        refreshGuests();
    }, []);

    useEffect(() => {
        const groupedByTable = Object.groupBy(guests.filter(g => g.tableNumber), ({tableNumber}) => tableNumber);
        const updatedNodes = Object.keys(groupedByTable).map(tableNumber => ({
            id: tableNumber,
            type: 'table',
            position: {x: 300 * tableNumber, y: 300},
            data: {tableNumber, allGuests: guests,  guestsAtTable: groupedByTable[tableNumber], shape: 'rectangle'}
        }));
        setNodes(updatedNodes)
    }, [guests]);
    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );
    const nodeTypes = useMemo(() => ({ table: TableNode }), []);

    return (
        <div className={'sm:p-4 md:p-8'}>
            <Card className={'h-96'}>
                <ReactFlow nodeTypes={nodeTypes} nodes={nodes} onNodesChange={onNodesChange}>
                    <Background/>
                    <Controls/>
                </ReactFlow>
            </Card>
        </div>
    )
}