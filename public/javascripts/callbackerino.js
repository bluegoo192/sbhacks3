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

var mapProcessor = function(
  Map, Popup, PopupTemplate, Search, Extent, Draw, Graphic, arcgisUtils,
  ClassBreaksRenderer,
  FeatureLayer, InfoTemplate,
  Query, QueryTask,
  SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
  screenUtils,
  Color, dom, on, domClass, domStyle, domConstruct, query, parser, registry
) {

  parser.parse();

  symbol = new SimpleMarkerSymbol();
  symbol.setColor(new Color([150, 150, 150, 1]));
  symbol.setSize(15);
  globals.renderer = new ClassBreaksRenderer(symbol, function(target) {
    return app.activeQuery.assess(target);//app is the vue app in vueapp.js
  });

  var numRanges = 255;
  var max = 10;
  var min = 0;
  var breaks = (max - min) / numRanges;

  for (var i=0; i<numRanges; i++) {
   globals.renderer.addBreak(parseFloat(min + (i*breaks)), parseFloat(min + ((i+1)*breaks)), new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15,
     new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255, 1]), 1), new Color([255, 255 - i, 255 - i, 1])));
  }

  var q = new Query();

  censusBlockPointsLayer = new FeatureLayer("http://services7.arcgis.com/YEYZskqaPfGot5jV/arcgis/rest/services/islavista/FeatureServer/0", {
    mode: FeatureLayer.MODE_SELECTION,
    outFields: ["price", "deposit"]}
  );

  var symbol = new SimpleMarkerSymbol();
  symbol.style = SimpleMarkerSymbol.STYLE_SQUARE;
  symbol.setSize(15);
  symbol.setColor(new Color([0,0,0,0.5]));
  censusBlockPointsLayer.setSelectionSymbol(symbol);

  //To put more stuff into the sidebar
  censusBlockPointsLayer.on("selection-complete", function() {
    dom.byId("sidebar").innerHTML = "<p> Average Price: $" +
      getAveragePrice(censusBlockPointsLayer.getSelectedFeatures()) + "<br/> Highest Price: $" +
      getHighestPrice(censusBlockPointsLayer.getSelectedFeatures()) + "<br/> Lowest Price: $" +
      getLowestPrice(censusBlockPointsLayer.getSelectedFeatures()) + "<br/> Average Deposit: $" +
      getAverageDeposit(censusBlockPointsLayer.getSelectedFeatures()) + "<br/> Highest Deposit: $" +
      getHighestDeposit(censusBlockPointsLayer.getSelectedFeatures()) + "<br/> Lowest Deposit: $" +
      getLowestDeposit(censusBlockPointsLayer.getSelectedFeatures()) + "</p>";
  });

  globals.initLayer = new FeatureLayer("http://services7.arcgis.com/YEYZskqaPfGot5jV/arcgis/rest/services/islavista/FeatureServer/0", {
    mode: FeatureLayer.MODE_ONDEMAND,
    outFields: ["price", "name", "street", "city", "state", "FID", "deposit", "bedrooms", "bathrooms",
      "occupants", "userrating", "realtor", "smoking", "pets", "utilitycoverage", "water", "garbage",
      "gas", "electricity", "internet", "internetquality", "laundry", "hvactype", "age", "environment",
      "numberapplied", "subleases", "floor", "balcony", "rentaltype", "yard", "furnished", "insurance",
      "viewrating", "granitecounters", "tilefloor", "doublepane"],
    infoTemplate: new PopupTemplate({
      title: "Apartment Details",
      description: "<img class='popupImage' src='{price:randomImage}'><br/>" +
        "Address: {street}, {city}, {state} <br/>" +
        "Price: ${price} <br/>" +
        "Tenant Rating: {userrating}/10<br/>" +
        "<button class='showmore' onclick='({FID:showMore})()'>Show More</button>"
    })
  });

  globals.initLayer.setRenderer(globals.renderer);

  arcgisUtils.createMap("c0039c4561bc4829983698261edb5622", "map").then(function (response) {
    map = response.map;
    createToolbar(map);
    enableSpotlight();
    map.addLayer(censusBlockPointsLayer);
    map.addLayer(globals.initLayer);
  });

  var search = new Search({
     map: map
  }, dom.byId("search"));

  on(dom.byId("circledraw"), "click", function() {
    activateTool();
  });

  on(dom.byId("query"), "click", function() {
    showQueries();
  });

  for (string of toggles) {
    attachListeners(dom.byId(string));
  }

  on(dom.byId("splash"), "click", function() {
    domStyle.set(dom.byId("splash"), "display", "none");
    domStyle.set(dom.byId("screenblur"), "display", "none");
  })

  on(dom.byId("submitQuery"), "click", function() {
    var expression = "";
    for (string of toggles) {
      if (domClass.contains(dom.byId(string), "disabledButton")) {
      } else {
        if (string != "hvactype") {
          expression += string + " = 'True' AND ";
        } else {
          expression += string + " = 'Electric' AND ";
        }
      }
    }
    if (dom.byId("priceMax").value == "" && dom.byId("occupantsMin").value == "" && dom.byId("bedroomsMin").value == "") {
      expression += "price > -1";
    }
    if (dom.byId("priceMax").value != "") {
      expression += "price < " + dom.byId("priceMax").value;
      if (dom.byId("occupantsMin").value != "" || dom.byId("bedroomsMin").value != "") {
        expression += " AND ";
      }
    }
    if (dom.byId("occupantsMin").value != "") {
      expression += "occupants > " + dom.byId("occupantsMin").value;
      if (dom.byId("bedroomsMin").value != "") {
        expression += " AND ";
      }
    }
    if (dom.byId("bedroomsMin").value != "") {
      expression += "bedrooms > " + dom.byId("bedroomsMin").value;
    }
    globals.initLayer.setDefinitionExpression(expression);
  })
  //Create extent to limit search
  var extent = new Extent({
     "spatialReference": {
        "wkid": 102100
     },
     "xmin": -13063280,
     "xmax": -13033928,
     "ymin": 4028345,
     "ymax": 4042715
  });

  //set the source's searchExtent to the extent specified above
  //search.sources[0].searchExtent = extent;

  //make sure to start up the widget!
  search.startup();
  search.on("select-result", showLocation);
  search.on("clear-search", removeSpotlight);

  function attachListeners(node){
    on(node, "click", function() {
      if (domClass.contains(node, "disabledButton")) {
        domClass.remove(node, "disabledButton");
      } else {
        domClass.add(node, "disabledButton");
      }
    });
  }

  function activateTool() {
    if (isActive) {
      globals.toolbar.deactivate();
      map.enableMapNavigation();
      app.areaToolLabel = "Area";
    } else {
      var tool = "Freehand Polygon".toUpperCase().replace(/ /g, "_");
      globals.toolbar.activate(Draw[tool]);
      map.disableMapNavigation();
      app.areaToolLabel = "Exit";
    }
    isActive = !isActive;
  }

  randomImage = function(value, key, data) {
    var price = data.price
    var rand = Math.floor(((price / 10) + (price / 100) + (price / 1000)) % 10);
    return images[rand]
  }

  showMore = function(value, key, d) {
    data = d;
    var returnFunction = function() {
      var smoking = (data.smoking === "True") ? "Allowed" : "Not Allowed";
      var pets = (data.pets === "True") ? "Allowed" : "Not Allowed";
      var water = (data.water === "True") ? "Yes" : "No";
      var garbage = (data.garbage === "True") ? "Yes" : "No";
      var gas = (data.gas === "True") ? "Yes" : "No";
      var electricity = (data.electricity === "True") ? "Yes" : "No";
      var internet = (data.internet === "True") ? "Yes" : "No";
      var laundry = (data.laundry === "True") ? "Yes" : "No";
      var subleases = (data.subleases === "True") ? "Allowed" : "Not Allowed";
      var balcony = (data.balcony === "True") ? "Yes" : "No";
      var furnished = (data.furnished === "True") ? "Yes" : "No";
      var insurance = (data.insurance === "True") ? "Yes" : "No";
      var granitecounters = (data.granitecounters === "True") ? "Yes" : "No";
      var tilefloor = (data.tilefloor === "True") ? "Yes" : "No";
      var doublepane = (data.doublepane === "True") ? "Yes" : "No";
      var hvactype = (data.hvac == "Electric") ? "Yes" : "No";
      var url = globals.getRealtorURL(data.realtor);
      this.document.getElementById("sidebar").innerHTML = "<p>" +
        "Realtor: <a href=" + url + " target=\"_blank\">" + data.realtor + "</a><br/>" +
        "Deposit: $" + data.deposit + "<br/>" +
        "Bedrooms: " + data.bedrooms + "<br/>" +
        "Bathrooms: " + data.bathrooms + "<br/>" +
        "Maximum Occupants: " + data.occupants + "<br/>" +
        "View Rating: " + data.viewrating + "/10<br/>" +
        "Smoking: " + smoking + "<br/>" +
        "Pets: " + pets + "<br/>" +
        "Utility Coverage: " + data.utilitycoverage + "<ul>" +
        "<li>Water: " + water + "<br/>" +
        "<li>Garbage: " + garbage + "<br/>" +
        "<li>Gas: " + gas + "<br/>" +
        "<li>Electricity: " + electricity + "<br/>" +
        "<li>Internet: " + internet + "<br/>" +
        "<li>Laundry: " + laundry + "</ul>" +
        "Internet Quality: " + data.internetquality + "/10<br/>" +
        "HVAC is Electric: " + hvactype + "<br/>" +
        "Building Age: " + data.age + "<br/>" +
        "Environment: " + data.environment + "<br/>" +
        "Number of Other Applicants: " + data.numberapplied + "<br/>" +
        "Subleases: " + subleases + "<br/>" +
        "Floor: " + data.floor + "<br/>" +
        "Balcony: " + balcony + "<br/>" +
        "Rental Type: " + data.rentaltype + "<br/>" +
        "Yard: " + data.yard + "<br/>" +
        "Furnished: " + furnished + "<br/>" +
        "Insurance: " + insurance + "<br/>" +
        "Granite Counters: " + granitecounters + "<br/>" +
        "Tile Floors: " + tilefloor + "<br/>" +
        "Double Pane: " + doublepane + "<br/>"
    };
    return returnFunction;
  }

  function showQueries() {
    if (queriesShown) {
      domStyle.set(dom.byId('queryWindow'), "display", "none");
      queriesShown = false;
    } else {
      domStyle.set(dom.byId('queryWindow'), "display", "block");
      queriesShown = true;
    }
  }

  function createToolbar(themap) {
    globals.toolbar = new Draw(map);
    globals.toolbar.on("draw-end", addToMap);
  }

  function showLocation(e) {
    console.log('show location');
    console.log(map);
     map.graphics.clear();
     var point = e.result.feature.geometry;
     var symbol = new SimpleMarkerSymbol().setStyle(
     SimpleMarkerSymbol.STYLE_SQUARE).setColor(
       new Color([255, 0, 0, 0.5])
     );
     var graphic = new Graphic(point, symbol);
     map.graphics.add(graphic);

     map.infoWindow.setTitle("Search Result");
     map.infoWindow.setContent(e.result.name);
     map.infoWindow.show(e.result.feature.geometry);

     var spotlight = map.on("extent-change", function () {
        var geom = screenUtils.toScreenGeometry(map.extent,  map.width, map.height, e.result.extent);
        var width = geom.xmax - geom.xmin;
        var height = geom.ymin - geom.ymax;

        var max = height;
        if (width > height) {
           max = width;
        }

        var margin = '-' + Math.floor(max / 2) + 'px 0 0 -' + Math.floor(max / 2) + 'px';

        query(".spotlight").addClass("spotlight-active").style({
           width: max + "px",
           height: max + "px",
           margin: margin
        });
        spotlight.remove();
      });
    }
  function enableSpotlight() {
    console.log('spotlight enabled');
    var html = "<div id='spotlight' class='spotlight'></div>"
    domConstruct.place(html, dom.byId("map_container"), "first");
  }

  function removeSpotlight() {
    query(".spotlight").removeClass("spotlight-active");
    map.infoWindow.hide();
    map.graphics.clear();
  }

  function addToMap(evt) {
    var symbol = new SimpleFillSymbol();
    globals.toolbar.deactivate();
    map.enableMapNavigation();
    app.areaToolLabel = "Area"
    isActive = false;
    var graphic = new Graphic(evt.geometry, symbol);
    if (previousGraphic != null) {
      map.graphics.remove(previousGraphic);
    }
    previousGraphic = graphic;
    map.graphics.add(graphic);
    q.geometry = evt.geometry;
    censusBlockPointsLayer.selectFeatures(q, FeatureLayer.SELECTION_NEW);
  }

  function getAveragePrice(features) {
    var num = 0;
    var total = 0;
    for (feature of features) {
      total += feature.attributes["price"];
      num ++;
    }
    return (total / num).toFixed(2);
  }
  function getHighestPrice(features) {
    var max = 0;
    for (feature of features) {
      var price = feature.attributes["price"];
      if (price > max) {
        max = price;
      }
    }
    return max;
  }
  function getLowestPrice(features) {
    var min = 999999;
    for (feature of features) {
      var price = feature.attributes["price"];
      if (price < min) {
        min = price;
      }
    }
    return min;
  }
  function getAverageDeposit(features) {
    var num = 0;
    var total = 0;
    for (feature of features) {
      total += feature.attributes["deposit"];
      num ++;
    }
    return (total / num).toFixed(2);
  }
  function getHighestDeposit(features) {
    var max = 0;
    for (feature of features) {
      var price = feature.attributes["deposit"];
      if (price > max) {
        max = price;
      }
    }
    return max;
  }
  function getLowestDeposit(features) {
    var min = 999999;
    for (feature of features) {
      var price = feature.attributes["deposit"];
      if (price < min) {
        min = price;
      }
    }
    return min;
  }
}

require(globals.esriRequirements, mapProcessor);
