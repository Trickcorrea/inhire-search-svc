import { talentsService } from "../../shared/talents";
import { SearchTalentController } from "./searchTalent.controller";
import { SearchTalentService } from "./searchTalent.service";

const searchTalentService = new SearchTalentService(talentsService)
const searchTalent = new SearchTalentController(searchTalentService)

export { searchTalent }