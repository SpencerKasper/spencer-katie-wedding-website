export interface Table {
    tableId: string;
    tableNumber: number;
    coordinates: {
        x: number;
        y: number;
    };
    shape: string;
    color: string;
}