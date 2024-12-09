import {NextResponse} from "next/server";
import getDynamoDbClient from "@/app/api/aws-clients/dynamodb-client";
import {PutItemCommand} from "@aws-sdk/client-dynamodb";
import {ScanCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {Table} from "@/types/table";

const WEDDING_TABLES_TABLE = 'wedding_tables';

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
                UpdateExpression: "SET #coordinates = :coordinates, #shape = :shape, #color = :color",
                ExpressionAttributeNames: {
                    "#coordinates": "coordinates",
                    "#shape": "shape",
                    "#color": "color"
                },
                ExpressionAttributeValues: {
                    ":coordinates": body.coordinates,
                    ":shape": body.shape,
                    ":color": body.color
                }
            }));
        } else {
            await dynamo.send(new PutItemCommand({
                TableName: WEDDING_TABLES_TABLE,
                Item: {
                    tableNumber: {N: body.tableNumber.toString()},
                    coordinates: {
                        M: {
                            x: {N: body.coordinates.x.toString()},
                            y: {N: body.coordinates.y.toString()}
                        }
                    },
                    shape: {S: body.shape ? body.shape : 'circle'},
                    color: {S: body.color ? body.color : ''},
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