<script>
(function ($) {
  
  jQuery(document).bind('leaflet.map', function(event, map, lMap) {
    
    // Move zoom control to a new position
    lMap.zoomControl.setPosition('bottomright');
        
  });

})(jQuery);


jQuery(document).bind( 'leaflet.map', function( e, map, lMap ) {
	var legend = L.control( {position: 'topleft'} );
	legend.onAdd = function () {
		var div = L.DomUtil.create( 'div', 'info' );
		div.innerHTML = '<div class="btn-group">  <button type="button" class="btn btn-legend dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="legend legend-1"></span><span class="legend legend-2"></span><span class="legend legend-3"></span><span class="legend legend-4"></span><span class="legend legend-arrow"></span></button><ul class="dropdown-menu"><li class="legend-marker"><img src="sites/default/files/marker/1821-Mexican.png"><p>Mexican Era<br>1821-1835<p></li><li class="legend-marker"><img src="sites/default/files/marker/1835-Revolution.png"><p>Texas Revolution<br>1835-36<p></li><li class="legend-marker"><img src="sites/default/files/marker/1836-Republic.png"><p>Texas Republic<br>1836-45<p></li><li class="legend-marker"><img  src="sites/default/files/marker/1845-Statehood.png"><p>Texas Statehood<br>1845-<p></li></ul></div>';
		return div;
	};
	legend.addTo( lMap );

});


</script>