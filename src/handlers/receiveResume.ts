import { S3Handler } from "aws-lambda";
import { receiveResume } from "../functions/receiveResume";

export const handler: S3Handler = async (event) => {
    await receiveResume.receive(event)
}