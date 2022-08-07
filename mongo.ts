import { Collection, MongoClient } from 'mongodb';

export class MongoManager {

    client: MongoClient;

    constructor(url: string) {
        this.client = new MongoClient(url);
    }

    connect() {
        return this.client.connect();
    }

    collection() {
        type Code = {
            survey_code: string,
            coupon_code: string | null,
            inserted: Date,
            solved: Date | null,
            used: Date | null
        }

        const codes: Collection<Code> = this.client.db("McD").collection('codes');
        return codes;
    }

    templates() {
        type Template = {
            code: string,
        }

        const templates: Collection<Template> = this.client.db("McD").collection('templates');
        return templates;
    }

    async markUsed(code: string) {
        return await this.collection().updateOne({ coupon_code: code }, { $set: { used: new Date() } })
    }

    async getUnusedCodes() {
        return await this.collection().find({
            used: null,
            coupon_code: {$ne:null}
        }).toArray()
    }

    async insertSurveyCode(code: string) {
        return await this.collection().insertOne({
            survey_code: code,
            coupon_code: null,
            inserted: new Date(),
            solved: null,
            used: null
        });
    }

    async checkSurveyCode(code: string) {
        const query = { survey_code: code }
        const result = await this.collection().findOne(query)
        if (result == null) return true; else return false
    }

    async insertCouponCode(survey_code: string, coupon_code: string) {
        return await this.collection().updateOne({ survey_code: survey_code }, { $set: { coupon_code: coupon_code, solved: new Date() } })
    }

    async getTemplates() {
        return await this.templates().find({}).toArray()
    }

    async updateTemplate(code: string, template: string) {
        return await this.templates().updateOne({ code: template }, { $set: { code: code } })
    }

    async deleteTemplate(code: string) {
        return await this.templates().deleteOne({ code: code })
    }
}

export default MongoManager;