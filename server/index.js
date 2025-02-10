require("dotenv").config();
const express = require("express");
const { fal } = require("@fal-ai/client");
const path = require("path");

const app = express();
app.use(express.json());

app.post("/api/text-to-video", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const result = await fal.subscribe("fal-ai/ltx-video", {
      input: {
        prompt: prompt,
        negative_prompt:
          "low quality, worst quality, deformed, distorted, disfigured, motion smear, motion artifacts, fused fingers, bad anatomy, weird hand, ugly",
        num_inference_steps: 40,
        guidance_scale: 5,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Generation in progress...");
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    const video = result?.data?.video;

    if (!video || !video.file_name) {
      return res.status(500).json({
        error: "Video generation failed or incomplete data received.",
      });
    }

    res.status(200).json({ video });
  } catch (error) {
    console.error("Error generating video:", error);
    res.status(500).json({ error: "Failed to generate video" });
  }
});

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
