import { talentsService } from "../../shared/talents";
import { ReceiveResumeController } from "./receiveRsume.controller";
import { ReceiveResumeService } from "./receiveRsume.service";

const receiveRsumeService = new ReceiveResumeService(talentsService)
const receiveResume = new ReceiveResumeController(receiveRsumeService)

export { receiveResume }