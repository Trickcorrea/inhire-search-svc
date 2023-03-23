import { TalentsService } from "../../shared/talents/talents.service";

export class SearchTalentService {
    constructor(private readonly talentsService: TalentsService){}

    searchByTag(tag: string) {
        return this.talentsService.getTalentByTag(tag)
    }
}