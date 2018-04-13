'use strict';

const Product = require('../models/product');
const lang    = require('../../core/lang');

function getProducts (req, res) {
  Product.find({}, (err, products) => {
    if (err)
    return res
      .status(500)
      .send({ message: lang.Server.Fail });
    
    if (!products)
      return res
        .status(404)
        .send({ message: lang.Server.NotFound });
    
    res
      .status(200)
      .send({ products });
  })
}

function getProduct (req, res) {
  let slug = req.params.slug;
  
  Product.findOne({ slug }, (err, product) => {
    if (err)
      return res
        .status(500)
        .send({ error: lang.Server.Fail });

    if (!product)
      return res
        .status(404)
        .send({ error: lang.Server.NotFound });

    res
      .status(200)
      .send({ product });
  })
}

function createProduct (req, res) {
  let product = new Product();

  product.name        = req.body.name;
  product.price       = req.body.price;
  product.category    = req.body.category;
  product.description = req.body.description;
  product.slug        = req.body.slug;

  if (req.body.picture !== '' || req.body.picture)
    product.picture = req.body.picture;

  product.save((err, productStored) => {
    if (err)
    return res
      .status(500)
      .send({ message: `${lang.DataBase.StoreError} ${err.code}` });

    res
      .status(200)
      .send({
        message: lang.DataBase.Stored,
        product: productStored
      });
  })
}

function updateProduct (req, res) {
  let id = req.params.id;
  let update = {
    name:         req.body.name,
    picture:      req.body.picture,
    price:        req.body.price,
    category:     req.body.category,
    slug:         req.body.slug,
    description:  req.body.description,
  }
  
  Product.findByIdAndUpdate(id, update, (err, product) => {
    if (err)
      return res
        .status(500)
        .send({
          message: lang.Server.Fail
        });
    
    return res
      .status(201)
      .send({
        message: lang.DataBase.Updated,
        product: product
      });
  })
}

function deleteProduct (req, res) {
  const id = req.params.id;

  Product.findById(id, (err, product) => {
    if (!product)
    return res
      .status(404)
      .send({ error: 'Product doesn\'t exists.' });

    console.log(product);

    try {
      product.remove();
      return res.send();
    } catch (err) {
      if (err)
        return res
          .status(400)
          .send({ error: 'Error on delete product.' });
    }
  });

}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}