'use strict';

const Service = require('../models/service');
const lang    = require('../../core/lang');

function getServices (req, res) {
  Service.find({}, (err, services) => {
    if (err)
    return res
      .status(500)
      .send({ message: lang.Server.Fail });
    
    if (!services)
      return res
        .status(404)
        .send({ message: lang.Server.NotFound });
    
    res
      .status(200)
      .send({ services });
  })
}

function getService (req, res) {
  let slug = req.params.slug;
  
  Service.findOne({ slug }, (err, service) => {
    if (err)
      return res
        .status(500)
        .send({ message: lang.Server.Fail });

    if (!service)
      return res
        .status(404)
        .send({ message: lang.Server.NotFound });

    res
      .status(200)
      .send({ service });
  })
}

function createService (req, res) {
  let service = new Service();

  service.name          = req.body.name;
  service.price         = req.body.price;
  service.category      = req.body.category;
  service.description   = req.body.description;
  service.slug          = req.body.slug;
  service.pricePerMeter = req.body.pricePerMeter;

  service.save((err, serviceStored) => {
    if (err)
    return res
      .status(500)
      .send({ message: `${lang.DataBase.StoreError} ${err.code}` });

    res
      .status(200)
      .send({
        message: lang.DataBase.Stored,
        service: serviceStored
      });
  })
}

function updateService (req, res) {
  let id      = req.params.id;
  let update  = {
    name          : req.body.name,
    price         : req.body.price,
    category      : req.body.category,
    description   : req.body.description,
    slug          : req.body.slug,
    pricePerMeter : req.body.pricePerMeter,
  }

  for (var prop in update) { 
    if (update[prop] === null || update[prop] === undefined) {
      delete update[prop];
    }
  }
  
  Service.findByIdAndUpdate(id, update, (err, service) => {
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
        service: service
      });
  })
}

function deleteService (req, res) {
  const id = req.params.id;

  Service.findById(id, (err, service) => {
    if (!service)
    return res
      .status(404)
      .send({ error: 'service doesn\'t exists.' });

    console.log(service);

    try {
      service.remove();
      return res
        .status(200)
        .send({ message: 'Successful deleted' });
    } catch (err) {
      if (err)
        return res
          .status(400)
          .send({ error: 'Error on delete service.' });
    }
  });

}

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
}