var map, toolbar, renderer, symbol, geomTask, previousGraphic, censusBlockPointsLayer, initLayer;
var isActive = false;

require([
  "esri/map",
  "esri/dijit/Popup",
  "esri/dijit/PopupTemplate",
  "esri/dijit/Search",
  "esri/geometry/Extent",
  "esri/toolbars/draw",
  "esri/graphic",
  "esri/arcgis/utils",
  "esri/renderers/ClassBreaksRenderer",

  "esri/layers/FeatureLayer",
  "esri/InfoTemplate",
  "esri/tasks/query", "esri/tasks/QueryTask",

  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/geometry/screenUtils",

  "esri/Color", "dojo/dom", "dojo/on",
  "dojo/dom-class",
  "dojo/dom-construct", "dojo/query",
  "dojo/parser", "dijit/registry",

  "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
  "dijit/form/Button", "dijit/WidgetSet", "dojo/domReady!"
], function(
  Map, Popup, PopupTemplate, Search, Extent, Draw, Graphic, arcgisUtils,
  ClassBreaksRenderer,
  FeatureLayer, InfoTemplate,
  Query, QueryTask,
  SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
  screenUtils,
  Color, dom, on, domClass, domConstruct, query, parser, registry
) {
  parser.parse();

  var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));
  var popup = new Popup({
      fillSymbol: fill,
      titleInBody: false
  }, domConstruct.create("div"));
  //Add the dark theme which is customized further in the <style> tag at the top of this page
  domClass.add(popup.domNode, "dark");

  symbol = new SimpleMarkerSymbol();
  symbol.setColor(new Color([150, 150, 150, 1]));
  symbol.setSize(15);
  renderer = new ClassBreaksRenderer(symbol, function(target) {
    return app.activeQuery.assess(target);//app is the vue app in vueapp.js
  });

  var numRanges = 510;
  var max = 10;
  var min = 0;
  var breaks = (max - min) / numRanges;

  for (var i=0; i<numRanges; i++) {
   renderer.addBreak(parseFloat(min + (i*breaks)), parseFloat(min + ((i+1)*breaks)), new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15, null, new Color([i, 255 - (i - 255), 0, 0.8])));
  }

  var q = new Query();

  on(dom.byId("undo"), "click", function() {
    if(previousGraphic != null) {
      map.graphics.remove(previousGraphic);
      toolbar.deactivate();
      map.enableMapNavigation();
      }
    });

  censusBlockPointsLayer = new FeatureLayer("http://services7.arcgis.com/YEYZskqaPfGot5jV/arcgis/rest/services/islavista/FeatureServer/0", {
    mode: FeatureLayer.MODE_SELECTION,
    outFields: ["price", "name"]}
  );

  var symbol = new SimpleMarkerSymbol();
  symbol.style = SimpleMarkerSymbol.STYLE_SQUARE;
  symbol.setSize(15);
  symbol.setColor(new Color([0,0,0,0.5]));
  censusBlockPointsLayer.setSelectionSymbol(symbol);

  //To put more stuff into the sidebar
  censusBlockPointsLayer.on("selection-complete", function() {
    dom.byId("sidebar").innerHTML = "<p> Average Price: $" +
      getAveragePrice(censusBlockPointsLayer.getSelectedFeatures()) + "</p>";
  });

  initLayer = new FeatureLayer("http://services7.arcgis.com/YEYZskqaPfGot5jV/arcgis/rest/services/islavista/FeatureServer/0", {
    mode: FeatureLayer.MODE_ONDEMAND,
    outFields: ["price", "name", "street", "city", "state", "FID", "deposit", "bedrooms", "bathrooms", "occupants", "userrating"],
    infoTemplate: new PopupTemplate({
      title: "Apartment Details",
      description: "Name: {name} <br/> Price: ${price} <br/> Address: {street}, {city}, {state} <br/> FID: {FID}"
    })
  });

  initLayer.setRenderer(renderer);

  arcgisUtils.createMap("8c81bb0e582d4948a7a6ac8d1bf3a233", "map").then(function (response) {
    map = response.map;
    createToolbar(map);
    enableSpotlight();
    map.addLayer(censusBlockPointsLayer);
    map.addLayer(initLayer);
  });

  var search = new Search({
     map: map
  }, dom.byId("search"));

  on(dom.byId("circledraw"), "click", function() {
    activateTool();
  });

  on(dom.byId("query"), "click", function() {
    testQuery();
  });

  on(dom.byId("clearquery"), "click", function() {
    initLayer.setDefinitionExpression("");
  });
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

  function activateTool() {
    if (isActive) {
      toolbar.deactivate();
      map.enableMapNavigation();
      dom.byId("circledraw").style.backgroundColor = 'white';
    } else {
      var tool = "Freehand Polygon".toUpperCase().replace(/ /g, "_");
      toolbar.activate(Draw[tool]);
      map.disableMapNavigation();
      dom.byId("circledraw").style.backgroundColor = 'red';
    }
    isActive = !isActive;
  }

  function testQuery() {
    initLayer.setDefinitionExpression("price < 1500 AND FID > 1000");
  }

  function createToolbar(themap) {
    toolbar = new Draw(map);
    toolbar.on("draw-end", addToMap);
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
    toolbar.deactivate();
    map.enableMapNavigation();
    dom.byId("circledraw").style.backgroundColor = 'white';
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

});
