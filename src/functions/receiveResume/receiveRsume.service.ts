import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { S3EventRecord } from "aws-lambda";
import { Configuration, OpenAIApi } from "openai";
import { PDFExtract } from "pdf.js-extract"
import { Talents } from "../../shared/talents/talentes.model";
import { TalentsService } from "../../shared/talents/talents.service";

export class ReceiveResumeService {
    constructor(private readonly talentsService: TalentsService) {}

    async receive(Records: S3EventRecord[]): Promise<void>{
        const [ objectFromS3 ] = Records
        const { key } =  objectFromS3.s3.object
        const { name: bucketName } = objectFromS3.s3.bucket

        const pdfBuffer = await this.getPdfFileBuffer(bucketName, key)
        const textFromPdf = await this.getTextFromPdfBuffer(pdfBuffer)
        const talentConverted = await this.getInfoFromText(textFromPdf, key)

        await this.saveTalent(talentConverted)
    }

    private async getPdfFileBuffer(bucket:string, key: string): Promise<Buffer>{
        const s3Client = this.getS3Client()

        const response = await s3Client.send(new GetObjectCommand({
            Key: key,
            Bucket: bucket,
        }))
    
        const responseByte = await response.Body?.transformToByteArray() as Uint8Array

        return Buffer.from(new Uint8Array(responseByte as any ))
    }
    private async getTextFromPdfBuffer(pdf: Buffer) {
        const pdfExtract = new PDFExtract()
        const options = {};
        
        const objectPdf = await new Promise((resolve, reject) => {
            pdfExtract.extractBuffer(pdf, options, (err, data) => {
                if (err) {
                    console.log(err);
                    return reject(err) 
                }
                
                resolve(data)
            });
        })

        return this.transformObjectPdfToText(objectPdf)
    }
    private transformObjectPdfToText(objectPdf: any) {
        const { pages } = objectPdf

        let text = ''

        for(const { content } of pages) {
            for(const { str } of content) {
                text += ' ' + str
            }
        }

        return text
    }
    private async getInfoFromText(textFromPdf: string, resumeKey: string): Promise<Talents> {
        const openIaClient = this.getOpenIaClient()

        const response = await openIaClient.createCompletion({
            model: "text-davinci-003",
            prompt: `leia o texto que é um currículo retire desse texto as informações de nome, email, as tecnologias trabalhadas em um array chamado tags e Retorne essas instruções como um objeto JSON com a estrutura {"nome": String, "email": String, "tags": [String]}. Não retorne nenhum texto ou numeração que não seja json. \n\n ${textFromPdf}`,
            temperature: 0.3,
            max_tokens: 2000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
    
        const [itens] = response.data.choices
        const {text} = itens

        const talentParsed = JSON.parse(text as string)

        return {
            name: talentParsed?.nome,
            email: talentParsed?.email,
            tags: talentParsed?.tags,
            resumeKey   
        } as Talents
    }
    private async saveTalent(talent: Talents) {
        return this.talentsService.create(talent)
    }
    private getS3Client(){
        return new S3Client({
            region: process.env.REGION
        })
    }
    private getOpenIaClient(){
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });

        return new OpenAIApi(configuration);
    }
}