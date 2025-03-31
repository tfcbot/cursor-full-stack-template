import { Content } from '../app/api';

export const MOCK_CONTENT: Content[] = [
  {
    id: 'mock1',
    topic: 'Artificial Intelligence in Healthcare',
    content: `Artificial Intelligence (AI) is revolutionizing healthcare in numerous ways. From diagnostic tools to personalized treatment plans, AI is changing how medical professionals approach patient care.

AI algorithms can analyze medical images with remarkable accuracy, often detecting abnormalities that might be missed by human eyes. This capability is particularly valuable in radiology, where AI can assist in identifying potential issues in X-rays, MRIs, and CT scans.

In addition to imaging, AI is being used to analyze vast amounts of patient data to identify patterns and predict outcomes. This predictive capability allows healthcare providers to intervene earlier, potentially preventing serious health issues before they develop.

Personalized medicine is another area where AI shines. By analyzing a patient's genetic information, medical history, and other factors, AI can help determine the most effective treatment approaches for individual patients.

In conclusion, Artificial Intelligence in healthcare is a fascinating area worth exploring further. This article aimed to provide a medium overview in a professional style.`,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: 'mock2',
    topic: 'Sustainable Urban Planning',
    content: `This is a short article about "Sustainable Urban Planning" written in a friendly and conversational tone.

Urban planning is changing, folks! Cities are focusing more on sustainability, with green spaces, bike lanes, and public transit becoming major priorities. It's all about making our cities livable for the long term.

In conclusion, Sustainable Urban Planning is a fascinating area worth exploring further. This article aimed to provide a short overview in a casual style.`,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'mock3',
    topic: 'The History of Pizza',
    content: `This is a long article about "The History of Pizza" written in a light-hearted and funny tone.

Paragraph 2: Pizza's origin story begins in Naples, Italy, where someone brilliantly decided that flat bread with toppings was a genius idea. And let's face it, they weren't wrong! The early pizza was essentially a plate you could eat - talk about reducing dishwashing time! The History of Pizza is an interesting subject that can be explored from many angles.

Paragraph 3: Pizza made its grand entrance to America with Italian immigrants in the late 19th century, but it wasn't an overnight sensation. Americans initially looked at pizza the way cats look at vegetables - with suspicion and a hint of disdain. But eventually, they came around, probably after someone said "it's like a sandwich, but round and better." The History of Pizza is an interesting subject that can be explored from many angles.

Paragraph 4: The post-World War II pizza boom changed everything. GIs returning from Italy had developed a taste for this circular delight, and suddenly everyone wanted a slice of the action. Pizza parlors popped up faster than mushroom toppings after rain. The History of Pizza is an interesting subject that can be explored from many angles.

Paragraph 5: Then came the great pizza innovation era - deep dish in Chicago (or as New Yorkers call it, "casserole"), the Hawaiian debate (pineapple: yes or no?), and stuffed crusts (because regular pizza wasn't caloric enough). Pizza was evolving faster than Pokemon! The History of Pizza is an interesting subject that can be explored from many angles.

Paragraph 6: Fast food chains soon entered the pizza arena, promising "delivery in 30 minutes or less" - a concept that delighted college students and terrified other drivers on the road. Pizza delivery drivers became the unsung heroes of late-night study sessions and impromptu parties everywhere. The History of Pizza is an interesting subject that can be explored from many angles.

Paragraph 7: Today, pizza has reached gourmet status. We've gone from simple cheese and pepperoni to artisanal creations with ingredients you can't pronounce and toppings your grandparents would never recognize. "Yes, I'd like a wood-fired, truffle-infused, arugula and prosciutto pizza with a balsamic glaze" - translation: "I'm fancy now." The History of Pizza is an interesting subject that can be explored from many angles.

Paragraph 8: Pizza has even gone global, with countries around the world creating their own unique versions. Japan gave us mayonnaise and squid pizza, while Sweden contributed banana curry pizza - proving that some culinary experiments should perhaps remain in the lab. The History of Pizza is an interesting subject that can be explored from many angles.

In conclusion, The History of Pizza is a fascinating area worth exploring further. This article aimed to provide a long overview in a humorous style.`,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
]; 