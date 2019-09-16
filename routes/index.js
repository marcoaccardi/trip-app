const express = require('express');
const router  = express.Router();
var Amadeus = require('amadeus');
const axios=require("axios")
var amadeus = new Amadeus({
  clientId: 'zOEKFP0AAfN78XN6tbqMDZE2DA3VbuoT',
  clientSecret: 'ymwDkjLZzeXuRLeA'
});

amadeus.referenceData.locations.pointsOfInterest.get({
  latitude : 41.397158,
  longitude : 2.160873,
  radius:2,
  page: {
    limit: 2
  }
}).then((data)=>{
 console.log("hello2")
});





/* GET home page */
router.get('/', (req, res, next) => {
  axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/Paris.json?access_token=pk.eyJ1IjoiZm9uc29nbXMiLCJhIjoiY2swbWRsZWo3MTV6bTNkcW9vc29ybDZyMSJ9.EiT_I5moTDeyh3CM_Uc5CQ")
.then(data=>{
  let coordinates=data.data.features[0].geometry.coordinates
  console.log("Starts here===>",coordinates);
  res.render('index');
  amadeus.shopping.hotelOffers.get({
    latitude :coordinates[1],
    longitude : coordinates[0],
    radius:2,
    checkInDate:null,
    checkOutDate:null,
  }).then(data=>{
    let hotels=data.data[0];
    let hotelCoordinates=[hotels.hotel.latitude,hotels.hotel.longitude]
    console.log(coordinates);
    console.log(hotels.hotel.name)
    
    amadeus.referenceData.locations.pointsOfInterest.get({
      latitude : hotelCoordinates[0],
      longitude : hotelCoordinates[1],
      radius:2,
      page: {
        limit: 2
      }
    }).then((data)=>{
     console.log("places here: ", data)
    }).catch(err=>{
      console.log(err)
    })
    
  }).catch(err=>{
    console.log(err)
  })

})
});

module.exports = router;
