const express = require('express');
const path = require('path');
const OpenAI = require('openai');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Notion 설정
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

// AI 추천 요청하는 함수
async function getCocktailRecommendation(taste, alcohol) {
    const prompt = `${taste}한 맛을 좋아하며 도수가 ${alcohol} 칵테일을 추천해줘.`;
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content.trim();
}

// 노션에 데이터 저장
async function saveToNotion(taste, alcohol, recommendation) {
    await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
            '제목': { title: [{ text: { content: taste + " / " + alcohol } }] },
            '추천결과': { rich_text: [{ text: { content: recommendation } }] },
            '날짜': { date: { start: new Date().toISOString() } },
        },
    });
}

// 요청 처리
app.post('/recommend', async (req, res) => {
    const { taste, alcohol } = req.body;
    const recommendation = await getCocktailRecommendation(taste, alcohol);
    await saveToNotion(taste, alcohol, recommendation);
    res.json({ recommendation });
});

// 서버 시작
app.listen(9151, () => console.log('서버가 실행 중입니다: http://localhost:9151'));
