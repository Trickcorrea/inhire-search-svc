import { QueryCommandInput } from "@aws-sdk/lib-dynamodb"

export interface ITalentsRepository<T> {
    save: (model: T) => Promise<object>
    query: (queryInput: Omit<QueryCommandInput, "TableName">) => Promise<T[]>
}