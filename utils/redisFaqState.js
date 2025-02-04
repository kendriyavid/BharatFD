import redisClient from './redisClient.js';
import Faq from '../models/faq.js';

export const updateFaqIdsInCache = async () => {
    try {
        const faqIds = await Faq.find().select('faqId'); // Query database for all FAQ IDs
        await redisClient.set('faqIds:en', JSON.stringify(faqIds.map(faq => faq.faqId)));
        console.log('FAQ IDs updated in Redis cache');
    } catch (error) {
        console.error('Error updating FAQ IDs in cache:', error);
    }
};

export const deleteFaqkeysInCache = async (id) => {
    try {
        const keysToDelete = await redisClient.keys(`faq:${id}:response:*`);
        if (keysToDelete.length > 0) {
            await redisClient.del(...keysToDelete);
        }
    } catch (error) {
        console.log(error);
    }
};
