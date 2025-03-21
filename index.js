document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cocktailForm");
    const resultDiv = document.getElementById("result");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const taste = document.getElementById("taste").value;
        const alcohol = document.getElementById("alcohol").value;

        try {
            // ✅ 요청 URL을 "/api/recommend"로 변경해야 함!
            const response = await fetch("https://ai-cocktail-sage.vercel.app/api/recommend", {  
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taste, alcohol })
            });

            if (!response.ok) throw new Error("서버 오류 발생");

            const data = await response.json();
            resultDiv.textContent = data.recommendation;
        } catch (error) {
            resultDiv.textContent = "추천을 가져오는 중 오류 발생!";
            console.error(error);
        }
    });
});
