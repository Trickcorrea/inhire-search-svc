import { TalentsRepository } from "./talents.repository";
import { TalentsService } from "./talents.service";

const talentsRepository = new TalentsRepository()
const talentsService = new TalentsService(talentsRepository)

export { talentsService }