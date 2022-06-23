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
            used: boolean,
            useddate: Date | null,
            invalid: boolean | null
        }

        const Codes: Collection<Code> = this.client.db("McD").collection('codes');
        return Codes;
    }

    async markUsed(code: string) {
        return await this.collection().updateOne({ coupon_code: code }, { $set: { used: true, useddate: new Date() } })
    }

    async getUnSolved() {
        return await this.collection().find({
            coupon_code: null,
            invalid: false
        }).toArray();
    }

    async getUnusedCodes() {
        return await this.collection().find({
            used: false,
            coupon_code: {$ne:null}
        }).toArray()
    }

    async insertSurveyCode(code: string) {
        return await this.collection().insertOne({
            survey_code: code,
            coupon_code: null,
            inserted: new Date(),
            solved: null,
            used: false,
            useddate: null,
            invalid: false
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

    async markInvalid(survey_code: string) {
        return await this.collection().updateOne({survey_code: survey_code}, {$set: {invalid: true}});
    }
}

export default MongoManager;