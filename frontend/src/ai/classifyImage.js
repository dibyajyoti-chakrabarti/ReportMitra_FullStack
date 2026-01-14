export async function classifyImage(imageUrl) {
  const prompt = `
        You are an image classification assistant for a civics-issue reporting system.
        Given an image, identify the single most relevant department responsible for addressing the primary issue shown.

        Allowed departments (choose only ONE):

        1. Public Works Department
        Handles ONLY:
        - Structural damage to roads, streets, footpaths, bridges, flyovers, culverts
        - Broken or collapsed concrete or asphalt surfaces
        - Construction defects related strictly to public transport infrastructure

        Does NOT handle water, sewage, garbage, or traffic control equipment.

        2. Water Board Department
        Handles ONLY:
        - Drinking water supply infrastructure
        - Freshwater pipeline leaks or bursts
        - Overflowing or damaged clean-water pipes
        - Tanker water supply issues

        Does NOT handle sewage, drains, stormwater, garbage, or road damage.

        3. Sewage and Drainage Department
        Handles ONLY:
        - Sewage lines and manholes
        - Wastewater overflow
        - Blocked or overflowing underground drainage systems
        - Open sewage flowing on roads or into drains

        Does NOT handle clean water pipes, garbage, or road repair.

        4. Sanitation Department
        Handles ONLY:
        - Garbage accumulation or littering
        - Overflowing or missing waste bins
        - Illegal dumping of solid waste
        - Street sweeping and cleanliness issues

        Does NOT handle sewage water, pipelines, traffic equipment, or structural road damage.

        5. Traffic Department
        Handles ONLY:
        - Traffic signals and signal poles
        - Road signs and signboards
        - Lane markings, barricades, dividers, cones, reflectors
        - Traffic-related safety equipment

        Does NOT handle road surface damage, water, sewage, or garbage.

        Critical Rules:
        - Return ONLY the department name exactly as listed above
        - Do NOT include explanations, probabilities, or additional text
        - Identify the dominant and most visible issue in the image
        - Ignore secondary or background issues

        Overlap Resolution (use ONLY if unavoidable):
        If an issue appears to fall under multiple departments, select the department in the following narrow-to-broad priority order:
        1. Traffic Department
        2. Sanitation Department
        3. Sewerage & Drainage Department
        4. Water Board
        5. Public Works Department (PWD)

        Output format:
        <department name>
`;

  const response = await puter.ai.chat(prompt, imageUrl, { model: "gpt-5-nano" });

  const dept =
    response?.message?.content?.trim() ||
    response?.choices?.[0]?.message?.content?.trim();

  return dept || "Manual";
}
