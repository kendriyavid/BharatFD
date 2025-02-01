const Faq = require('../models/faq.js')

const fetchAllFaq = async (req,res)=>{
    const {lang} = req.query ? req.query : "default";
    try{
        const faqs = await Faq.find();
        console.log(faqs._id)
        const responseBody = faqs.map(faq=>({
            question:faq.question,
            response: lang && faq.translations ? faq.translations : faq.response
        }))
        res.json(responseBody)
    }catch(error){
        console.log(error);
        res.status(500).send("error: ",error);
    }
}


const fetchSpecific = async (req, res) => {
    const lang = req.query.lang || "default";
    try {
        const id = req.params.id;
        const faq = await Faq.findById(id);
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }
        const responseBody = {
            response: lang !== "default" ? faq.response : faq.lang
        };
        res.json(responseBody);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ 
            message: "An error occurred", 
            error: error.message 
        });
    }
};

module.exports = {fetchAllFaq, fetchSpecific}