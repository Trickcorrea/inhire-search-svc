import { SendEmailToRecruitersController } from "./sendEmailToRecruiters.controller";
import { SendEmailToRecruitersService } from "./sendEmailToRecruiters.service";

const sendEmailToRecruitersService = new SendEmailToRecruitersService()
const sendEmailToRecruiters = new SendEmailToRecruitersController(sendEmailToRecruitersService)

export { sendEmailToRecruiters }