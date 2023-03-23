import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import { sendEmailToRecruiters } from "../functions/sendEmailToRecruiters";

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  await sendEmailToRecruiters.sendEmail(event)
};