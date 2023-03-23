import { APIGatewayProxyHandler } from "aws-lambda";
import { registerController } from "../functions/registerTalent";

export const handler: APIGatewayProxyHandler = async (event) => {
    const { body } = event
    const talentParsed = JSON.parse(body as string)
    return registerController.register(talentParsed)
};
  