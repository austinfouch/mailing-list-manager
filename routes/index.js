var express = require('express');
var router = express.Router();

// renders /mailer
var mailerPage = function(req, res, next) {
  console.log("Mailer...");
  res.render('mailer', { });
}
// renders /contacts
var contactsPage = function(req, res, next) {
  console.log("Contacts...");
  var contacts = req.db;
  var contactList = contacts.find().toArray().then(function(contactList) {
    res.render('contacts', {contactList});
  });
}

// gets
router.get('/', mailerPage)
router.get('/mailer', mailerPage);
router.get('/contacts', contactsPage);

/* POST result page. */
router.post('/result', function(req, res, next) {
  // building variables here for readability
  var name = req.body.title + " " + req.body.firstName + " " + req.body.lastName;
  var address = req.body.street + ", " + req.body.city + ", " + req.body.state 
    + " " + req.body.zip;
  var phone = req.body.phone;
  var email = req.body.email;
  var contactByPhone =  "No";
  var contactByMail = "No";
  var contactByEmail = "No";
  if(req.body.byPhone == "on")
    contactByPhone = "Yes";
  if(req.body.byMail == "on")
    contactByMail = "Yes";
  if(req.body.byEmail == "on")
    contactByEmail = "Yes";

  // need to geocode the address here...
  var initRes = res;  // holds res object before going into geocodeer callback
  var geocoder = req.geo;
  geocoder.geocode(address, function(err, res) {
    // if bad address
    if(res.length < 1){
      initRes.render('failedGeocode', {});
      return;
    }
    // create the object based on above vars and add to 'contacts' collection
    var contact = {
      name : name,
      address : address,
      phone : phone,
      email : email,
      contactByPhone : contactByPhone,
      contactByMail : contactByMail,
      contactByEmail : contactByEmail,
      latitude : res[0].latitude,
      longitude : res[0].longitude
    }
    // insert contact object into 'contacts' collection
    var contacts = req.db;
    contacts.insertOne(contact);
    // render result with just the single contact
    initRes.render('result', {contact});
  });
});

module.exports = router;