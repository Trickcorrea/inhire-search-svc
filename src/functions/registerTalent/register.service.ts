import { Talents } from "../../shared/talents/talentes.model";
import { TalentsService } from "../../shared/talents/talents.service";

export class RegisterService {
    constructor(private readonly talentsService: TalentsService){}

    registerTalents(talents: Talents) {
        return this.talentsService.create(talents)
    }
}