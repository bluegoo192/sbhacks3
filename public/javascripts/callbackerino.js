var map, symbol, geomTask, previousGraphic, censusBlockPointsLayer, randomImage, showMore, data;
var isActive = false;
var queriesShown = false;

var images = [
  "https://media-cdn.tripadvisor.com/media/photo-o/02/77/31/02/outside-view.jpg",
  "http://www.westmont.edu/_offices/residence_life/uploads/2006/10/ocean%20view%20outside%20(med).jpg",
  "http://cdn.redalertpolitics.com/files/2015/10/869395563_22f8d741b6_o.jpg",
  "https://secure.static.tumblr.com/8c2d0620be7545c947dc7fcc067ff93a/jbb81gu/rexnqf12g/tumblr_static_tumblr_static_b64lwqy7pu88scs8wgo4kos_640.jpg",
  "http://www.hotel-r.net/im/hotel/cy/santa-barbara-apartment.jpg",
  "http://www.buenavistasantabarbara.com/sites/default/files/styles/home_banner_image_style/public/banner_image_03_0.jpg?itok=LH4y2KVh",
  "http://www.hotel-r.net/im/hotel/cy/santa-barbara-apartment-18.jpg",
  "http://casapequenaapts.com/santabarbara/images/casapeqapts%20004.jpg",
  "http://allthingssantabarbara.com/wp-content/uploads/2011/02/Paseo-Chapala-Exterior-A.jpg",
  "http://berkshireterraceapts.com/wp-content/plugins/vslider/timthumb.php?src=%2Fwp-content%2Fuploads%2F2012%2F04%2Fb1.jpg&w=719&h=379&zc=1&q=80"
]

var toggles = [
  "smoking",
  "pets",
  "water",
  "garbage",
  "gas",
  "electricity",
  "internet",
  "laundry",
  "subleases",
  "balcony",
  "furnished",
  "insurance",
  "granitecounters",
  "tilefloor",
  "doublepane",
  "hvactype"
]
