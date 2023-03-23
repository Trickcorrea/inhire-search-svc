import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from 'uuid'

export class GenerateUrlService {
    async signedUploadURL() {
        const s3Client = this.getS3client()
        const pdfId = uuid();
        const expires = 5 * 60;
        const fileExtension = '.pdf';        

        const s3Params = {
            Bucket: process.env.BUCKET_NAME,
            Key:  `uploads/resume-${pdfId}${fileExtension}`,
            ContentType: 'application/pdf'
        };

        const command = new PutObjectCommand(s3Params);
        const urlsigned = await getSignedUrl(s3Client, command, { expiresIn: expires });        

        return {
            url: urlsigned,
            fileName: `resume-${pdfId}${fileExtension}`
        }
    }

    private getS3client() {
        return new S3Client({
            region: process.env.REGION
        })
    }
}