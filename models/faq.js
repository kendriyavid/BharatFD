const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema({
  faqId: {
    type: String,
    unique: true,
  },
  question: {
    type: String,
    required: true,
    unique: true
  },
  response: {
    type: String, // Stores WYSIWYG-generated HTML content
    required: true
  },
  translations: {
    type: Map, // Stores translated versions of the response
    of: String,
    default: {} // Example: { "hi": "<p>हिंदी अनुवाद</p>", "bn": "<p>বাংলা অনুবাদ</p>" }
  }
}, { timestamps: true });


FaqSchema.pre('save', async function(next) {
  if (this.isNew) {
    const highestFaq = await this.constructor.findOne({}, { faqId: 1 })
      .sort({ faqId: -1 });
    
    const nextId = highestFaq ? 
      'FAQ' + (Number(highestFaq.faqId.replace('FAQ', '')) + 1).toString().padStart(4, '0') :
      'FAQ0001';
    
    this.faqId = nextId;
  }
  next();
});



const Faq = mongoose.model("Faq", FaqSchema);
module.exports = Faq;
