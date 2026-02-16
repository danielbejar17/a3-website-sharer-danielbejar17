import mongoose from 'mongoose';

let models = {};
main().catch(err => console.log(err))

async function main() {
  console.log("connecting to mongodb")

  await mongoose.connect('mongodb+srv://dbejar17_db_user:cs0D7z8LZROzMwbb@cluster0.zsyoary.mongodb.net/realmadrid?appName=Cluster0');

  console.log("successfully connected to mongodb");

  // Create schema
  const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    siteType: String,
    username: String,
    created_date: { type: Date, default: Date.now },
  })

  models.Post = mongoose.model('Post', postSchema);
  console.log("mongoose models created")
}

/* const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow')); */

export default models;
