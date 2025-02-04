const Faq = require("../models/faq.js");
const {updateFaqIdsInCache,deleteFaqkeysInCache} = require("../utils/redisFaqState.js")

const createFaq = async (req, res) => {
    try {
        const { question, response } = req.body;
        
        // if (!question || !response) {
        //     return res.status(400).json({ 
        //         message: "Question and response are required" 
        //     });
        // }

        if (!question || typeof question !== "string" || question.trim().length === 0) {
            return res.status(400).json({
                message: "Question is required and must be a non-empty string"
            });
        }

        if (!response || typeof response !== "string" || response.trim().length === 0) {
            return res.status(400).json({
                message: "Response is required and must be a non-empty string"
            });
        }


        const faq = new Faq({
            question,
            response
        });

        const savedFaq = await faq.save();
        res.status(201).json({
            message: "FAQ created successfully",
            faq: savedFaq
        });
        updateFaqIdsInCache();

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Error creating FAQ",
            error: error.message 
        });
    }
};

const updateFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, response } = req.body;
        
        if (question && (typeof question !== "string" || question.trim().length === 0)) {
            return res.status(400).json({
                message: "Question must be a non-empty string"
            });
        }

        if (response && (typeof response !== "string" || response.trim().length === 0)) {
            return res.status(400).json({
                message: "Response must be a non-empty string"
            });
        }
        
        const updatedFaq = await Faq.findOneAndUpdate(
            { faqId: id },
            req.body,
            { new: true }
        );

        if (!updatedFaq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        res.json({
            message: "FAQ updated successfully",
            faq: updatedFaq
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Error updating FAQ",
            error: error.message 
        });
    }
};

const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedFaq = await Faq.findOneAndDelete({ faqId: id });

        if (!deletedFaq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        // Delete all cached responses for this FAQ
        await deleteFaqkeysInCache(id)
        res.json({ message: "FAQ deleted successfully" });

        updateFaqIdsInCache();
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Error deleting FAQ",
            error: error.message 
        });
    }
};

module.exports = {
    createFaq,
    updateFaq,
    deleteFaq,
};