var mongodb = require('mongodb');
var mongoose = require('mongoose');
var Apartment = require('../../models/apartment');

var database = {
  addApartment: function(body) {
    Apartment.where({
      apartmentName: body.apartmentName,
      apartmentAddress: body.apartmentAddress,
      landlordName: body.landlordName
    }).findOne(function (err, apartment){
      if (!apartment) {
        var newApartment = new Apartment({
            apartmentName: body.apartmentName,
            apartmentAddress: body.apartmentAddress,
            landlordName: body.landlordName,
            landlordCompany: body.landlordCompany,
            email: body.email,
            images: body.images
          });
          newApartment.save(function (err) {
            if (err) {
              console.log('Error creating apartment!');
            } else {
              console.log('Successfully created apartment');
            }
            callback();
          });
        } else {
          console.log('Error creating apartment. Already exists.');
        }
    });
  }
};

module.exports = database;
