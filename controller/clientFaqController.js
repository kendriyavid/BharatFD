const Faq = require('../models/faq.js');
const translateHTML = require("../utils/htmlTranslator.js");
const redisClient = require("../utils/redisClient.js")
const fetchAllFaq = async (req, res) => {
    const lang = req.query.lang || 'default';

    try {
        const faqIdsJson = await redisClient.get('faqIds:en');
        const faqIds = faqIdsJson ? JSON.parse(faqIdsJson) : [];

        const faqs = [];

        for (const faqId of faqIds) {
            let translatedResponse;
            let faq = null;

            const cacheResponse = await redisClient.get(`faq:${faqId}:response:${lang}`);
            if (cacheResponse) {
                console.log("cacheresponse: ",cacheResponse)
                translatedResponse = JSON.parse(cacheResponse);
                faqs.push({
                    id: translatedResponse.id,
                    question: translatedResponse.question,  
                    response: translatedResponse.response  
                });
            } else {
                faq = await Faq.findOne({ faqId });
                console.log("db response",faq)

                if (!faq) {
                    continue; 
                }

                translatedResponse = lang === 'default' 
                    ? faq.response 
                    : (await translateHTML(faq.response, lang)).translated;

                await redisClient.set(`faq:${faqId}:response:${lang}`, JSON.stringify({
                    id: faqId,
                    question: faq.question,
                    response:translatedResponse
                }));
                faqs.push({
                    id: faqId,
                    question: faq ? faq.question : null,  
                    response: translatedResponse  
                });
            }  
        }
        res.json(faqs);
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({ message: 'Error fetching FAQs', error: error.message });
    }
};




const fetchSpecific = async (req, res) => {
    const lang = req.query.lang || "default";
    const id = req.params.id;
    const cacheKey = `faq:${id}:response:${lang}`; 

    try {
        const cachedFaq = await redisClient.get(cacheKey);
        
        if (cachedFaq) {
            console.log("Returning specific FAQ from cache");
            console.log(cachedFaq)
            const parsed = JSON.parse(cachedFaq)
            const jsonCachef  ={
                id: parsed.id,
                question: parsed.question,
                response: parsed.response,
            }
            return res.json(jsonCachef);
        }

        const faq = await Faq.findOne({ faqId: id });
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        let response = lang === "default" ? faq.response : faq.translations.get(lang);

        if (!response && lang !== "default") {
            try {
                const translationResult = await translateHTML(faq.response, lang);
                response = translationResult.translated;

                faq.translations.set(lang, response);
                await faq.save();
            } catch (error) {
                console.error('Translation error:', error);
                return res.status(500).json({
                    message: "Error translating FAQ",
                    error: error.message
                });
            }
        }

        const responseData = {
            id: faq.faqId,
            question: faq.question,
            response
        };

        await redisClient.setex(cacheKey, 3600, JSON.stringify(responseData));

        console.log("Returning specific FAQ from DB");
        res.json(responseData);
    } catch (error) {
        console.error('Error fetching FAQ:', error);
        res.status(500).json({
            message: "Error fetching FAQ",
            error: error.message
        });
    }
};

module.exports = { fetchAllFaq, fetchSpecific };