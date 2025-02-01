const Faq = require('../models/faq.js');
const translateHTML = require("../utils/htmlTranslator.js");

const fetchAllFaq = async (req, res) => {
    const lang = req.query.lang || "default";
    try {
        const faqs = await Faq.find();
        
        const responseBody = faqs.map(faq => ({
            id: faq.faqId,
            question: faq.question,
            response: lang !== "default" ? 
                (faq.translations.get(lang) || faq.response) : 
                faq.response
        }));

        res.json(responseBody);
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({
            message: "Error fetching FAQs",
            error: error.message
        });
    }
};

const fetchSpecific = async (req, res) => {
    const lang = req.query.lang || "default";
    const id = req.params.id;

    try {
        const faq = await Faq.findOne({ faqId: id });
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        if (lang === "default") {
            return res.json({
                id: faq.faqId,
                question: faq.question,
                response: faq.response
            });
        }

        let translatedResponse = faq.translations.get(lang);
        
        if (!translatedResponse) {
            try {
                const translationResult = await translateHTML(faq.response, lang);
                translatedResponse = translationResult.translated;

                faq.translations.set(lang, translatedResponse);
                await faq.save();
                
            } catch (error) {
                console.error('Translation error:', error);
                return res.status(500).json({
                    message: "Error translating FAQ",
                    error: error.message
                });
            }
        }

        res.json({
            id: faq.faqId,
            question: faq.question,
            response: translatedResponse
        });

    } catch (error) {
        console.error('Error fetching FAQ:', error);
        res.status(500).json({
            message: "Error fetching FAQ",
            error: error.message
        });
    }
};

module.exports = { fetchAllFaq, fetchSpecific };