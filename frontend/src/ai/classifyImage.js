// frontend/src/ai/classifyImage.js
// Requires: <script src="https://js.puter.com/v2/"></script> added in index.html

export async function classifyImage(imageUrl) {
  const prompt = `
        You are an image classification assistant for a civics-issue reporting system.
        Given an image, identify the single most relevant department responsible for addressing the issue shown.

        Allowed departments (choose only from these):

        1. Public Works Department (PWD)
        Handles: Road damage, potholes, footpaths, bridges, flyovers, culverts, storm-water structures.

        2. Water Supply Department / Jal Board
        Handles: Drinking water supply, water pipelines, leakages, bursts, tanker requirements.

        3. Sewerage & Drainage Department
        Handles: Sewage lines, blockages, manhole overflow, wastewater drainage issues.

        4. Sanitation Department
        Handles: Garbage accumulation, littering, illegal dumping, waste bins, street sweeping.

        5. Traffic Department
        Handles: Traffic signals, signage, road safety hazards, traffic equipment.

        Instructions:
        - Return ONLY the department name exactly as listed above.
        - Do NOT provide explanations, probabilities, justifications, or additional text.
        - If multiple issues appear, choose the most dominant one.
        - If uncertain, choose the closest matching department.

        Output format:
        <department name>
`;

  const response = await puter.ai.chat(prompt, imageUrl, { model: "gpt-5-nano" });

  const dept =
    response?.message?.content?.trim() ||
    response?.choices?.[0]?.message?.content?.trim();

  return dept || "Manual";
}
