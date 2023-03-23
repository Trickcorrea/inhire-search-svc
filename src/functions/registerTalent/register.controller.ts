import { Talents } from "../../shared/talents/talentes.model";
import { ResponseBuilder } from "../../shared/utils/responseBuilder.utils";
import { RegisterService } from "./register.service";

export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    async register(talent: Talents) {
      try {
        if(!talent || !talent.name || !talent.email || !talent.tags || !talent.tags?.length ) {
          return new ResponseBuilder()
            .setStatusCode(400)
            .setBody({ message: 'property not passed'})
            .build();
        }

        const talentRegisted = await this.registerService.registerTalents(talent)

        return new ResponseBuilder()
          .setStatusCode(200)
          .setBody(talentRegisted)
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