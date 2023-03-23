import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from 'uuid'
import { ITalentsRepository } from "./talents.interface"
import { Talents } from "./talentes.model"

export class TalentsRepository implements ITalentsRepository<Talents> {
    TALENTS_TABLE: string

    constructor(){
        this.TALENTS_TABLE = process.env.TALENTS_TABLE as string
    }

    save({ email, name, tags, resumeKey }: Talents): Promise<object> {
        const dynamoDbClient = this.getDynamoDbClient()
        const talentId = `TALENT#${uuid()}`

        const talentBuilded = tags.map((tag) => {
            const techId = `TECH#${uuid()}`

            return {
                PutRequest: {
                    Item: {
                        talentId,
                        techId,
                        name,
                        email,
                        tech: tag,
                        resumeKey: resumeKey ? resumeKey : null
                    }
                }
            }
        })

        const params = {
            RequestItems: {
                [this.TALENTS_TABLE as string]:  talentBuilded
            }            
        };

        return dynamoDbClient.send(new BatchWriteCommand(params));
    }
    async query(queryInput: Omit<QueryCommandInput, "TableName">): Promise<Talents[]>{
        const dynamoDbClient = this.getDynamoDbClient()
        
        const params = {
            TableName: this.TALENTS_TABLE,
            ...queryInput
        };

        const { Items } = await dynamoDbClient.send(new QueryCommand(params));
        return Items as Talents[]
    }
    private getDynamoDbClient(){
        const client = new DynamoDBClient({ region: process.env.REGION });
        return DynamoDBDocumentClient.from(client);
    }
}