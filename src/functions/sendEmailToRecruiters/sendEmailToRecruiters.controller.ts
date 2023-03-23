import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import { ResponseBuilder } from "../../shared/utils/responseBuilder.utils";
import { SendEmailToRecruitersService } from "./sendEmailToRecruiters.service";

export class SendEmailToRecruitersController {
    constructor(private readonly sendEmailToRecruitersService: SendEmailToRecruitersService){}

    async sendEmail({ Records }: DynamoDBStreamEvent) {
        try {
          if(!Records || !Records.length ) {
            const error = new ResponseBuilder()
              .setStatusCode(400)
              .setBody({ message: 'Records is impty'})
              .build();
            
            console.log(error)
          }
  
          await this.sendEmailToRecruitersService.receiveDynamodbSendEmail(Records)
        } catch (error: unknown) {
          console.log('[ERROR-SEND-EMAIL]', error)      
        }
      }
}