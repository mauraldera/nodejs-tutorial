var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var formidable = require('formidable');
var Cart = require ('../models/cart');


/* GET home page. */
router.get('/', function (req, res, next) {
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'Shopping Cart', products: productChunks });
    });
});



router.post('/addNewProduct', function (req, res) {
    var form = new formidable.IncomingForm();
    var fullFilename;
    var id = req.params.id;
    var product = new Product();

    form.parse(req,function(err,fields){
        console.log(fields);
        Product.findById(id, function (err, doc){
            if(err) {
                console.log("Find by Id: " + err);
                res.redirect('/edit/'+id);
            }
        console.log("Full filename: "+fullfilename);
        if(!fullfilename){
            doc.imagePath = fields.imagePath;
        } else {
            doc.imagePath = fields.imagePath;
        }
        doc.title = fields.title;
        doc.description = fields.decription;
        doc.price = fields.price;
        doc.save(function(err){
            if(err){
                console.log("error save: "+err);
                res.redirect('/edit'+id);
            } else {
                console.log("sucess");
                res.redirect("/listProduct");
            }
        });
        });
        // product = new Product(fields);
        // console.log('Product: ' + product)
        // console.log('fullFilename: ' + fullFilename);
        // product.imagePath = fullFilename;
        // product.save(function(err){
        //     if (err) {
        //         console.log(err);
        //         res.render("shop/addProduct");
        //     } else {
        //         console.log("successfully created a product.");
        //         res.redirect('/list');
        //     }
        // });
    });

    form.on('file', function(name,file,fields){
        // product = new Product(fields);
        // console.log('Product: ' + product);
        // console.log('Uploaded ' + file.name);
        // fullFilename = './photo_uploads/' + file.name;
        console.log('Filename ' +file.name);
        if(file.name){
            fullfilename = './photo_uploads/' + file.name;
        }
    });
    form.on('fileBegin', function(name, file){
        console.log('Masuk upload, filename: ' + file.name);
        if(file.name){
            file.path = process.cwd() + '/public/photo_uploads/' + file.name;
        }
    });

    // form.on('fileBegin', function(name,file){
    //     file.path = __dirname + '/photo_uploads/' + file.name;
    // });

});

router.get('/list', function (req, res) {
    Product.find(function (err, prods) {
        res.render('shop/list', { title: 'All Products', products: prods });
    });

});

router.post('/delete/:id', function (req, res) {
    Product.remove({ _id: req.params.id }, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Product deleted!");
            res.redirect("/list");
        }
    });
});

router.get('/edit/:id', function (req, res) {
    Product.findOne({ _id: req.params.id }).exec(function (err, prods) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('shop/edit', { title: 'All Products', products: prods });
        }
    })
})

router.post('/updateProduct/:id', function (req, res) {

    if(req.body.imagePath==Null){
        console.log("No uploaded image", err);
        res.redirect()
    }else{

    }
    Product.findByIdAndUpdate(req.params.id,
        {
            $set:
            {
                imagePath: req.body.imagePath,
                title: req.body.title,
                description: req.body.description,
                price: req.body.price
            }
        }, { new: true },
        function (err, products) {
            if (err) {
                console.log(err);
                res.render("shop/edit", { products: req.body });
            }
            res.redirect("/list");
        });

});

router.get('/like/:id', function(req,res) {
    Product.findByIdAndUpdate(req.params.id,
        {
        $inc:
        {like: 1
        }
    }, {new: true},
    function (err) {
        if(err){
            console.log(err);
            res.redirect("/");
        }
        res.redirect("/");
    });
});

router.get('/add-to-cart/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if(err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log();
        res.redirect('/');
    });
});

router.get('/shopping-cart', function (req, res, next) {
    if(!req.session.cart) {
        return res.render('/shop/shopping-cart', {products:null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/addNewProduct', function (req, res) {
    res.render('shop/addProduct', { title: 'Page Add' });
});

router.get('/reduce/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req,res,next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});


module.exports = router;