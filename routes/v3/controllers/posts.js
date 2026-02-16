import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here

router.post('/', async (req, res) => {

  if (!req.session.isAuthenticated) {
      return res.status(401).json({
        status: 'error',
        error: 'not logged in'
      })
    }

  try {
    const newPost = new req.models.post({
      url: req.body.url,
      description: req.body.description,
      username: req.session.account.username,
      created_date: new Date()
    })

    // save to database
    await newPost.save();

    // return success
    res.json({"status": "success"});

  } catch (err) {
    console.log(err);
    res.status(500).json({
      "status": "error",
      "error": err.message
    })
  }

});

router.get('/', async (req, res) => {
  try {
    // find all posts in mongodb
    let query = {};

    if (req.query.username) {
      query.username = req.query.username;
    }

    const posts = await req.models.Post.find(query);

    // generate previews for each posts
    let postData = await Promise.all(
      posts.map(async (post) => {
          try{
              // TODO some await call
              let htmlPreview = await getURLPreview(post.url);
              // TODO return info about post
              return {
                description: post.description,
                htmlPreview: htmlPreview,
                username: post.username
              }
          }catch(error){
              // TODO: return error message
              return {
                description: post.description,
                htmlPreview: error.toString()
              }
          }
      })
    );

    // return all posts
    res.json(postData);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      error: err.toString()
    })

  }
})

export default router;