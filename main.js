var map = L.map("map",{zoomControl:false});
map.setView([41.435435, 2.212861],4);

var myTileLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {maxZoom: 19,id: 'orzoc.181b5b9d'}).addTo(map);

L.control.scale({
  metric:true,
  imperial: true,
  maxWidth: 200
}).addTo(map);

//var cities=require('result.json');

function style_map(geoJsonFeature) {
  // use leaflet's path styling options

  // since the GeoJSON feature properties are modified by the layer,
  // developers can rely on the "isOrigin" property to set different
  // symbols for origin vs destination CircleMarker stylings

  if (geoJsonFeature.properties.isOrigin) {
    return {
      renderer: canvasRenderer, // recommended to use your own L.canvas()
      radius: 10,
      weight: 30,
      //color: '#04FFFF',
      fillColor: 'rgba(0, 0, 0, 1)',
      fillOpacity: 1
    };
  } else {
    return {
      renderer: canvasRenderer,
      radius: 20,
      weight: 30,
      //color: 'rgb(255, 255, 255)',
      fillColor: 'rgb(255, 255, 255)',
      fillOpacity: 0.25
    };
  }
}




canvasRenderer = L.canvas();

var layer = new L.canvasFlowmapLayer(cities, {
//style:style_map,
// required property for this custom layer,
// which relies on the property names of your own data
originAndDestinationFieldIds: {
  originUniqueIdField: 'id_start',
  originGeometry: {
    x: 'x_start',
    y: 'y_start'
  },
  destinationUniqueIdField: 'id_end',
  destinationGeometry: {
    x: 'x_end',
    y: 'y_end'
  },
},

// some custom options
pathDisplayMode: 'all',
animationStarted: true,
animationEasingFamily: 'Cubic',
animationEasingType: 'In',
animationDuration: 2000
}).addTo(map);

var popUp= L.popup();

var selection = {};
layer.on('click', function(e) {
  if ( selection.lng === e.latlng.lng && selection.lat === e.latlng.lat ) {
    layer.selectFeaturesForPathDisplay( cities.features, 'SELECTION_NEW' );
    selection = {};
    return;
  } else {
    selection = e.latlng;
  }

  if (e.sharedOriginFeatures.length) {
    layer.selectFeaturesForPathDisplay(e.sharedOriginFeatures, 'SELECTION_NEW');
    map.fitBounds(e.target.getBounds());
  }
  if (e.sharedDestinationFeatures.length) {
    layer.selectFeaturesForPathDisplay(e.sharedDestinationFeatures, 'SELECTION_NEW');
    map.fitBounds(e.target.getBounds());
  }
  if (!e.isOriginFeature){
    popUp.setLatLng(e.latlng);
    popUp.setContent(e.layer.feature.properties.city);
    popUp.openOn(map);
  }
});