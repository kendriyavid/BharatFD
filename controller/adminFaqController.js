const Faq = require("../models/faq.js");

const createFaq = async (req, res) => {
    try {
        const { question, response } = req.body;
        
        if (!question || !response) {
            return res.status(400).json({ 
                message: "Question and response are required" 
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

        res.json({ message: "FAQ deleted successfully" });

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