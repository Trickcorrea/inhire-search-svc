import { S3Event } from "aws-lambda";
import { ResponseBuilder } from "../../shared/utils/responseBuilder.utils";
import { ReceiveResumeService } from "./receiveRsume.service";

export class ReceiveResumeController {
    constructor(private readonly receiveResumeService: ReceiveResumeService) {}

    async receive({ Records }: S3Event) {
      try {
        if(!Records || !Records.length ) {
          const error = new ResponseBuilder()
            .setStatusCode(400)
            .setBody({ message: 'Records is impty'})
            .build();
          
          console.log(error)
        }

        await this.receiveResumeService.receive(Records)
      } catch (error: unknown) {
        console.log('[ERROR-RECEIVE-RESUME]', error)      
      }
    }
}