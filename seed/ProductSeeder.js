var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping');

var products = [

    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/68/Kamen_Rider_SPIRITS_Volume_1.jpg/230px-Kamen_Rider_SPIRITS_Volume_1.jpg',
        title: 'Kamen Rider Spirits Vol 1',
        description: 'Manga version of Kamen Rider Spirits, tell the story of earlier Riders.',
        price: 10
    }),
    new Product({
         imagePath: 'http://news.tokunation.com/wp-content/uploads/sites/5/2016/04/Kamen-Rider-The-First.jpg',
         title: 'Kamen Rider The First',
         description: 'Live action  version of Kamen Rider Spirits, tell the story of earlier Riders. A nice remake',
         price: 20
     }),
     new Product({
         imagePath: 'https://static.comicvine.com/uploads/scale_large/6/67663/5740323-14.jpg',
         title: 'Kamen Rider Spirits Vol 1',
         description: 'Manga version of Kamen Rider Spirits, tell the story of        earlier Riders.',
         price: 10
     }),
     new Product({
        imagePath: '',
        title: 'Sherlock Holmies',
        description: 'Not Benedict Cumberbatch',
        price: 50
    }),


];

var done = 0;
for (var i=0; i < products.length; i++) {
    products[i].save(function(err, result){
        done++;
        if(done===products.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}
