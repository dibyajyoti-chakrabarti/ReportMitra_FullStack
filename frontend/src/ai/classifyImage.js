// frontend/src/ai/classifyImage.js
// Requires: <script src="https://js.puter.com/v2/"></script> added in index.html

export async function classifyImage(imageUrl) {
  const prompt = `
You are an image classification assistant for a civics-issue reporting system.
Given an image, identify the single most relevant department responsible for handling the issue shown.

Allowed departments:
- street lighting dept
- water dept
- littering dept
- graffiti dept
- potholes dept

Instructions:
- Return ONLY ONE department name from the list above.
- Do NOT provide explanations, probabilities, or extra text.
- If multiple issues appear, choose the most dominant one.
- If uncertain, choose the closest matching category.

Output format:
<department name>
`;

  const response = await puter.ai.chat(prompt, imageUrl, { model: "gpt-5-nano" });

  const dept =
    response?.message?.content?.trim() ||
    response?.choices?.[0]?.message?.content?.trim();

  return dept || "Manual";
}
