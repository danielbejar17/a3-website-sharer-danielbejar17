import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here

router.post('/', async (req, res) => {
  try {
    // get data
    let url1 = req.body.url;
    let description1 = req.body.description;
    let siteType = req.body.siteType;


    // create new post object
    const newObject = new req.models.Post({
      url: url1,
      description: description1,
      siteType: siteType,
      created_date: new Date()
    });

    // save to database
    await newObject.save();

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
    const posts = await req.models.Post.find({});

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
                siteType: post.siteType
              }
          }catch(error){
              // TODO: return error message
              return {
                description: post.descirption,
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