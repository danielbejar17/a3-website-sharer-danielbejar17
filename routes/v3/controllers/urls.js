import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
// Get /preview
router.get('/preview', async (req, res) => {
  let url = req.query.url;

  try {
    let previewHtml = await getURLPreview(url);
    res.send(previewHtml);
    console.log("we're here");
  } catch (err) {
    res.send(`Error sending message: ${err.message}`);
  }
});

export default router;