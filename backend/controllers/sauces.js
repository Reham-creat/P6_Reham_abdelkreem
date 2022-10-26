const fs = require('fs');
const Sauces = require('../models/Sauces');

exports.getAllSauces = (req,res) => {
  Sauces.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
};


exports.getSauce = (req,res) => {
  const sauceId = req.params.id;
  Sauces.findById(sauceId)
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(400).json({ error }));
};


exports.editSauce = (req,res) => {
  Sauces.findOne({ _id: req.params.id})
  .then(sauce => {
    if(res.locals.userId != sauce.userId ) return res.status(403).json({ message: 'You can not change this sauce!' });
  
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauces.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifie !'}))
    .catch(error => res.status(400).json({ error }));
  })
  .catch(() => res.status(500).json({ message: 'You can not find the sauce to modify!' }));
};


exports.deleteSauce = (req,res) => {
  Sauces.findOne({ _id: req.params.id })
  .then(sauce => {
    if(res.locals.userId != sauce.userId ) return res.status(403).json({ message: 'You can not delete this sauce!'  });

    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauces.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objcet deleted !'}))
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(() => res.status(500).json({ message: 'You can not find the sauce to delete!' }));
};

// Like/Dislike 
exports.likeSauce = (req,res) => {
  const sauceId = req.params.id;
  const likeStatus = req.body.like;
  const userId = req.body.userId;
  switch(likeStatus) {
   
    case 1:
      Sauces.updateOne({ _id: sauceId }, { $inc: { likes: +1 }, $push: { usersLiked: userId } })
      .then(() => res.status(200).json({ message: 'Like checked in !'}))
      .catch(error => res.status(400).json({ error }));
      break;
    
    case -1:
      Sauces.updateOne({ _id: sauceId }, { $inc: { dislikes: +1 }, $push: { usersDisliked: userId } })
      .then(() => res.status(200).json({ message: 'Dislike checked in !'}))
      .catch(error => res.status(400).json({ error }));
      break;
    
    case 0:
      Sauces.findOne({ _id: sauceId })
      .then( sauce => {
       
        if(sauce.usersLiked.includes(userId)) {
          Sauces.updateOne(
            { _id: sauceId },
            { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
          )
          .then(() => res.status(201).json({ message: "Like took of !" }))
          .catch((error) => res.status(400).json({ error }));
        }
      
        else if(sauce.usersDisliked.includes(userId)) {
          Sauces.updateOne(
            { _id: sauceId },
            { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } }
          )
          .then(() => res.status(201).json({ message: "Dislike took of !" }))
          .catch((error) => res.status(400).json({ error }));
        }
       
        else {
          res.status(403).json({ message: "Impossible to interact."})
          .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch(() => res.status(500).json({ message: 'Impossible to find the sauce!' }));
      break;
  }
};


exports.createSauce = (req,res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauces({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
  .then(() => res.status(201).json({ message: 'Object checked in !'}))
  .catch(error => res.status(400).json({ error }));
};
