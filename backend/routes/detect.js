const express = require("express");
const fetch = require("node-fetch");
const multer = require("multer");

const router = express.Router();
const upload = multer();

router.post("/onions", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (!process.env.ROBOFLOW_WORKFLOW_URL) {
      return res.status(500).json({
        error: "Roboflow workflow URL is not configured",
        hint: "Set ROBOFLOW_WORKFLOW_URL in backend .env"
      });
    }

    if (!process.env.ROBOFLOW_API_KEY) {
      return res.status(500).json({
        error: "Roboflow API key is not configured",
        hint: "Set ROBOFLOW_API_KEY in backend .env"
      });
    }

    const imageBase64 = req.file.buffer.toString("base64");
    const imageDataUri = `data:${req.file.mimetype || "image/jpeg"};base64,${imageBase64}`;

    const roboflowUrl = process.env.ROBOFLOW_WORKFLOW_URL;
    const response = await fetch(roboflowUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.ROBOFLOW_API_KEY,
        inputs: {
          image: {
            type: "base64",
            value: imageDataUri
          }
        }
      }),
    });

    const raw = await response.text();
    let parsed;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = null;
    }

    if (!response.ok) {
      console.error("Roboflow non-200 response:", {
        status: response.status,
        statusText: response.statusText,
        url: process.env.ROBOFLOW_WORKFLOW_URL,
        body: raw,
      });

      return res.status(502).json({
        error: "Roboflow request failed",
        roboflow_status: response.status,
        roboflow_statusText: response.statusText,
        roboflow_body: parsed || raw,
      });
    }

    const debug = {
      ok: true,
      has_outputs: Array.isArray(parsed?.outputs),
      outputs_length: Array.isArray(parsed?.outputs) ? parsed.outputs.length : 0,
      top_level_keys: parsed && typeof parsed === "object" ? Object.keys(parsed).slice(0, 20) : [],
    };

    res.json({
      ...((parsed && typeof parsed === "object") ? parsed : { raw }),
      _debug: debug,
    });

  } catch (error) {
    console.error("Roboflow error:", error);
    res.status(500).json({
      error: "Onion detection failed",
      details: error?.message || String(error)
    });
  }
});

module.exports = router;
