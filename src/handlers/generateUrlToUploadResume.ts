import { APIGatewayProxyHandler } from "aws-lambda";
import { generateUrlToUpload } from "../functions/generateUrl";

export const handler: APIGatewayProxyHandler = async (event) => {
  return generateUrlToUpload.signedUploadURL()
};