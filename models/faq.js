import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema({
  faqId: {
    type: String,
    unique: true,
  },
  question: {
    type: String,
    required: true,
    unique: true,
  },
  response: {
    type: String, 
    required: true,
  },
  translations: {
    type: Map, 
    of: String,
    default: {}, 
  },
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

export default Faq;
