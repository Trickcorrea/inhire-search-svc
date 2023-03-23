import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBRecord } from "aws-lambda";
import { Talents } from "../../shared/talents/talentes.model";

export class SendEmailToRecruitersService {
    async receiveDynamodbSendEmail(Records: DynamoDBRecord[]) {
        for (const record of Records) {
            const talent = this.parseRecord(record)
                
            const emailTemplate = await this.buildEmail(talent)
            await this.sendEmail(emailTemplate)    
        }
    }    
    async sendEmail(emailTemplate: string) {
        const sendEmailCommand = this.createSendEmailCommand(
            process.env.EMAIL_ADDRESS_TO,
            process.env.EMAIL_ADDRESS_FROM,
            emailTemplate
        );
        
        return this.getSesClient().send(sendEmailCommand);
    }
    async signUrl(key: string) {
        const bucket = process.env.BUCKET_NAME
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        return getSignedUrl(this.getS3Client(), command, { expiresIn: 3600 });        
    }
    parseRecord(record: DynamoDBRecord): Talents {
        if (!record.dynamodb?.NewImage) {
          throw new Error("Invalid DynamoDBRecord")
        }
      
        return unmarshall(record.dynamodb?.NewImage as {[key: string]: AttributeValue}) as Talents
    }
    createSendEmailCommand(toAddress, fromAddress, emailTemplate) {
        return new SendEmailCommand({
          Destination: {
            ToAddresses: [
              `IT Recruiter <${toAddress}>`        
            ],
          },
          Message: {
            /* required */
            Body: {
              /* required */
              Html: {
                Charset: "UTF-8",
                Data: emailTemplate,
              }
            },
            Subject: {
              Charset: "UTF-8",
              Data: "New talent available",
            },
          },
          Source: `Patrick Byintera <${fromAddress}>`
        });
    };
    async buildEmail(newTalentInfo: Talents) {
        const hasResume = !!newTalentInfo.resumeKey
        let linkPreSignResume = ''

        if(hasResume) {
            linkPreSignResume = await this.signUrl(newTalentInfo.resumeKey as string)
        }

        return `
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8">
            <title>Tabela de Contatos</title>
            <style>
                table {
                border-collapse: collapse;
                width: 100%;
                max-width: 100%;
                margin: 0 auto;
                font-family: Arial, sans-serif;
                color: #333;
                }
            
                th, td {
                padding: 10px;
                text-align: left;
                }
            
                th {
                background-color: #f2f2f2;
                font-weight: bold;
                text-transform: uppercase;
                border-bottom: 2px solid #ddd;
                }
            
                tr:nth-child(even) {
                background-color: #f9f9f9;
                }
            </style>
            </head>
            <body>
            <h1 style="color:#433d3d">Inhire Search</h1>
            <h3 style="color:#433d3d">New talent available</h3>
            <table>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Tags</th>
                    <th>REsume</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>${newTalentInfo.name}</td>
                    <td>${newTalentInfo.email}</td>
                    <td>${newTalentInfo.tags ? newTalentInfo.tags.join(', ') : newTalentInfo.tech}</td>
                    ${hasResume ? `<td><a href="${linkPreSignResume}" target="_blank" >Resume</a></td>`: '<td><a href="#">No resume</a></td>'}
                </tr>
                </tbody>
            </table>
            <br />
            <p>Entre em contato com nossa equipe para obter mais informações.</p>
            </body>
            </html>
        `
    }
    getS3Client() {
        return new S3Client({
            region: process.env.REGION
        });
    }
    getSesClient() {
        return new SESClient({ region: process.env.REGION });        
    }
}