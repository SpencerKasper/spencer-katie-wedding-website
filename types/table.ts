export interface Table {
    tableId?: string;
    tableNumber: number;
    guests: string[];
    coordinates: {
        x: number;
        y: number;
    };
    shape: string;
    color: string;
}