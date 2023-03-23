import { talentsService } from "../../shared/talents";
import { RegisterController } from "./register.controller";
import { RegisterService } from "./register.service";

const registerService = new RegisterService(talentsService)
const registerController = new RegisterController(registerService)

export { registerController }