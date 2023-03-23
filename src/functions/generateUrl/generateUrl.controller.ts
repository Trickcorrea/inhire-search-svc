import { ResponseBuilder } from "../../shared/utils/responseBuilder.utils";
import { GenerateUrlService } from "./generateUrl.service";

export class GenerateUrlController {
    constructor(private readonly generateUrlService: GenerateUrlService) {}

    async signedUploadURL() {
      try {
        const urlSigned = await this.generateUrlService.signedUploadURL()

        return {
            "statusCode": 200,
            "isBase64Encoded": false,
            "headers": {
            "Access-Control-Allow-Origin": "*"
            },
            "body": JSON.stringify(urlSigned)
        }

      } catch (error: unknown) {
        console.log('error', error)
        return new ResponseBuilder()
          .setStatusCode(500)
          .setBody({ error: true, message: `Internal error in generate url: ${(error as Error).message}`})
          .build();
      }
    }
}