// api/recommend.js
const { Configuration, OpenAIApi } = require("openai");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method is allowed." });
  }

  const { taste, alcohol } = req.body;
  if (!taste || !alcohol) {
    return res.status(400).json({ error: "맛 선택과 도수 선택은 필수입니다." });
  }

  // OpenAI 설정
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const prompt = `${taste} 맛에 ${alcohol} 도수인 칵테일을 추천해줘.`;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const recommendation = completion.data.choices[0].message.content.trim();

  return res.status(200).json({ recommendation });
};
