import { ResponseBuilder } from "../../shared/utils/responseBuilder.utils";
import { SearchTalentService } from "./searchTalent.service";

export class SearchTalentController {
    constructor(private readonly searchTalentService: SearchTalentService) {}

    async search({tag}: {tag: string}) {
      try {
        if(!tag) {
          return new ResponseBuilder()
            .setStatusCode(400)
            .setBody({ message: 'property not passed: tag'})
            .build();
        }

        const search = await this.searchTalentService.searchByTag(tag)

        return new ResponseBuilder()
          .setStatusCode(200)
          .setBody(search)
          .build();

      } catch (error: unknown) {
        console.log('error', error)
        return new ResponseBuilder()
          .setStatusCode(500)
          .setBody({ error: true, message: `Internal error in register: ${(error as Error).message}`})
          .build();
      }
    }
}