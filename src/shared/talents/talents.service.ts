import { ITalentsRepository } from "./talents.interface"
import { Talents } from "./talentes.model"
import { ETalentsIndexName } from "./talents.type"

export class TalentsService{
    constructor(private readonly talentsRepository: ITalentsRepository<Talents>){}

    create(talents: Talents): Promise<object> {
        return this.talentsRepository.save(talents)
    }
    query(data: any): Promise<any>{
        return this.talentsRepository.query(data)
    }
    getTalentByTag(tag: string): Promise<Talents[]>{
        const query = {
            IndexName: ETalentsIndexName.techIndex,
            KeyConditionExpression: "tech = :ttech AND begins_with (techId , :ttechId )",
            ExpressionAttributeValues: {
              ':ttech': tag,
              ':ttechId': "TECH#"
            }
        }
        return this.talentsRepository.query(query)
    }
}