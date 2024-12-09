import {NextResponse} from "next/server";
import getDynamoDbClient from "@/app/api/aws-clients/dynamodb-client";
import {PutItemCommand} from "@aws-sdk/client-dynamodb";
import {QueryCommand, ScanCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";

const WEDDING_TABLES_TABLE = 'wedding_tables';

interface Table {
    tableNumber: number;
    coordinates: {
        x: number;
        y: number;
    };
    shape: string;
}

export async function GET(request) {
    const dynamo = await getDynamoDbClient();
    const response = await dynamo.send(new ScanCommand({
        TableName: WEDDING_TABLES_TABLE
    }));
    const tables = response.Items as Table[];
    return NextResponse.json({
        statusCode: 200,
        tables
    });
}

export async function POST(request) {
    try {
        const body = await request.json();
        const dynamo = await getDynamoDbClient();
        const response = await dynamo.send(new ScanCommand({
            TableName: WEDDING_TABLES_TABLE
        }));
        const tables = response.Items as Table[];
        const foundTable = tables.find(t => t.tableNumber === body.tableNumber);
        if (foundTable) {
            await dynamo.send(new UpdateCommand({
                TableName: WEDDING_TABLES_TABLE,
                Key: {
                    tableNumber: body.tableNumber
                },
                UpdateExpression: "SET #coordinates = :coordinates, #shape = :shape",
                ExpressionAttributeNames: {
                    "#coordinates": "coordinates",
                    "#shape": "shape"
                },
                ExpressionAttributeValues: {
                    ":coordinates": body.coordinates,
                    ":shape": body.shape
                }
            }));
        } else {
            console.error('adding new item')
            await dynamo.send(new PutItemCommand({
                TableName: WEDDING_TABLES_TABLE,
                Item: {
                    tableNumber: body.tableNumber,
                    coordinates: {
                        M: {
                            x: {N: body.coordinates.x.toString()},
                            y: {N: body.coordinates.y.toString()}
                        }
                    },
                    shape: {S: body.shape}
                }
            }));
        }
        const updatedResponse = await dynamo.send(new ScanCommand({
            TableName: WEDDING_TABLES_TABLE
        }));
        return NextResponse.json({
            statusCode: 200,
            tables: updatedResponse.Items
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({
            statusCode: 500,
            message: e
        });
    }
}