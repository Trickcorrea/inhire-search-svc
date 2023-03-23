import { GenerateUrlController } from "./generateUrl.controller";
import { GenerateUrlService } from "./generateUrl.service";

const generateUrlService = new GenerateUrlService()
const generateUrlToUpload = new GenerateUrlController(generateUrlService)

export { generateUrlToUpload }