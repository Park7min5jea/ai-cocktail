const express = require("express");
const cors = require("cors");

const app = express();  // 🔥 app을 먼저 초기화

app.use(cors());
app.use(express.json());

app.post("/recommend", (req, res) => {
    const { taste, alcohol } = req.body;

    if (!taste || !alcohol) {
        return res.status(400).json({ error: "맛 선택과 도수 선택을 입력하세요." });
    }

    // 예제 추천 로직
    const recommendation = `추천 칵테일: ${taste} 맛과 ${alcohol} 도수에 어울리는 칵테일은 XYZ입니다.`;

    res.json({ recommendation });
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ 서버 실행됨: http://localhost:${PORT}`);
});
