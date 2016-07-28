/**
 *  Handle groundoverlays in google format.
 *  Added by bbeeson
 */
/* $Id*/

Drupal.gmap.addHandler('gmap', function(elem) {
  var obj = this;
  obj.bind('init', function() {
    $.each(obj.vars.overlay, function(i,d) {
      switch (d.type) {
        case 'ground': 	
        	var url = d.imageurl;
        	var cnr1 = new google.maps.LatLng(d.cnr1.lat,d.cnr1.lng);
        	var cnr2 = new google.maps.LatLng(d.cnr2.lat,d.cnr2.lng);
        	var bounds = new google.maps.LatLngBounds(cnr1, cnr2);
         	var groundoverlay = new google.maps.GroundOverlay(url,bounds);
           	obj.map.addOverlay(groundoverlay);
           	break;
      }
    });
  });
});