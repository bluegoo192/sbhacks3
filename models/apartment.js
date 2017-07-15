var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var apartmentSchema = new Schema({
  apartmentName: String,
  apartmentAddress: String,
  landlordName: String,
  landlordCompany: String,
  email: String,
  images: [Buffer]
});

var Apartment = mongoose.model('Apartment', apartmentSchema);

module.exports = Apartment;
