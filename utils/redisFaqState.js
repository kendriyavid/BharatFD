const redisClient = require('./redisClient.js')
const Faq = require('../models/faq.js');

const updateFaqIdsInCache = async () => {
    try {
        const faqIds = await Faq.find().select('faqId'); // Query database for all FAQ IDs
        await redisClient.set('faqIds:en', JSON.stringify(faqIds.map(faq => faq.faqId)));
        console.log('FAQ IDs updated in Redis cache');
    } catch (error) {
        console.error('Error updating FAQ IDs in cache:', error);
    }
};

const deleteFaqkeysInCache = async(id)=>{
    try{
        const keysToDelete = await redisClient.keys(`faq:${id}:response:*`);
        if (keysToDelete.length > 0) {
            await redisClient.del(...keysToDelete);
        }
    }catch(error){
        console.log(error)
    }
}

module.exports={updateFaqIdsInCache, deleteFaqkeysInCache}