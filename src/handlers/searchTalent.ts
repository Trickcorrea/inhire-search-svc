import { APIGatewayProxyHandler } from "aws-lambda";
import { searchTalent } from "../functions/searchTalent";

export const handler: APIGatewayProxyHandler = async (event) => {
  const queryparams: any = event.queryStringParameters
  return searchTalent.search(queryparams)
};
