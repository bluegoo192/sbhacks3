var globals = {
    toolbar: {},
    renderer: {},
    initLayer: {},
    getRealtorURL: function(realtor) {
        var urlmap = {};
        urlmap["Casa Abrego"] = "http://www.hotelabrego.com/";
        urlmap["Excellence in Property Management Inc."] = "http://www.eipm.us.com/";
        urlmap["Campus 880"] = "http://campus880.com/";
        urlmap["Capitoline Property Management"] = "http://www.capitolineproperties.com/";
        urlmap["Beach Town Rentals"] = "http://beachtownrentals.com/Beach_Town_Rentals/Beach_Town_Rentals_-_Isla_Vista_Student_Rentals.html";
        urlmap["Bartlein & Company Inc."] = "http://www.bartlein.com/";
        urlmap["Dean Brunner Rentals"] = "http://www.deanbrunner.com/";
        urlmap["Del Playa Rentals"] = "http://delplayarental.com/";
        urlmap["Embarcadero Company"] = "http://www.embarcaderorentals.com/";
        urlmap["Berkshire Terrace Apartments"] = "http://berkshireterraceapts.com/";
        urlmap["Central Coast Rentals"] = "https://www.coastalvacationrentals.net/california_central_coast";
        urlmap["DMH Properties"] = "http://www.dmhproperties.net/";
        urlmap["Gallagher Property Management"] = "http://www.gpmproperties.com/";
        urlmap["Eckert Investments"] = "http://www.centralcoastrentals.com/";
        urlmap["820 Camino Corto"] = "http://820-camino-corto.com/";
        urlmap["Enea Properties Company LLC"] = "http://www.eneaproperties.com/";
        urlmap["Coast & Valley Properties"] = "http://coastandvalleyproperties.com/";
        urlmap["Colonial Balboa Cortez Apartments"] = "http://www.essexapartmenthomes.com/california/santa-barbara-county-apartments/goleta-apartments/cbc-and-the-sweeps";
        urlmap["Anita Escamilla"] = "https://pardallcenter.as.ucsb.edu/isla-vista-community-resource-guide/housing-in-isla-vista/leasing-companies/";
        urlmap["Dash Holdings I LLC"] = "https://www.dandb.com/businessdirectory/dashholdingsillc-santabarbara-ca-25967380.html";
        urlmap["Breakpointe Coronado"] = "http://www.thehiveiv.com/";
        urlmap["Cochrane Property Management Inc."] = "http://www.cochranepm.com/";
        if (typeof urlmap[realtor] === 'undefined' || urlmap[realtor] === null) return "http://www.google.com";
        return urlmap[realtor];
    },
    esriRequirements: [
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
      "dojo/dom-class", "dojo/dom-style",
      "dojo/dom-construct", "dojo/query",
      "dojo/parser", "dijit/registry",

      "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
      "dijit/form/Button", "dijit/WidgetSet", "dojo/domReady!"
    ]
}
