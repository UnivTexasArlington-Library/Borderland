L.Control.SliderControl = L.Control.extend({
    options: {
        layers: null,
        timeAttribute: 'time',
        startTimeIdx: 0,    // start looking for timestring at index[0]
        timeStrLength: 19,  // the size of yyyy-mm-dd hh:mm:ss i.e. 19
        maxValue: -1,
        minValue: 0,
        showAllOnStart: true,
        markers: null,
        range: true,
        alwaysShowDate : true,
        
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._layer = this.options.layer;

    },

    extractTimestamp: function(time, options) {
        return time.substr(options.startTimeIdx, options.startTimeIdx + options.timeStrLength);
    },

    setPosition: function (position) {
        var map = this._map;

        if (map) {
            map.removeControl(this);
        }

        this.options.position = position;

        if (map) {
            map.addControl(this);
        }
        this.startSlider();
        return this;
    },

    onAdd: function (map) {
        this.options.map = map;

        // control sliderContainer using jquery ui slider
        var sliderContainer = L.DomUtil.create('div', 'slider', this._container);
        $(sliderContainer).append('<div id="leaflet-slider" style="width:400px;"><div class="ui-slider-handle"></div><div id="slider-timestamp" style="display: none;"></div></div>');
        $(sliderContainer).append('<div id ="time_range" style="color: white;"><strong>1820 - 1839 (slide to change time range)</strong></div>')
        

        //Prevent map panning/zooming while using the slider
        $(sliderContainer).mousedown(function () {
            map.dragging.disable();
        });
        $(document).mouseup(function () {
            map.dragging.enable();
        });

        var options = this.options;
        this.options.markers = [];
		

		//calculate the min and max values for the slider
        if (this._layer) {
            var index_temp = 0;
            this._layer.eachLayer(function (layer) {
                options.markers[index_temp] = layer;
                ++index_temp;
            });
            options.maxValue = index_temp - 1;
            this.options = options;
        } else {
            console.log("Error");
        }
        return sliderContainer;
    },

    onRemove: function (map) {
        //Delete all markers which where added via the slider and remove the slider div
        for (i = this.options.minValue; i <= this.options.maxValue; i++) {
            map.removeLayer(this.options.markers[i]);
        }
        $('#leaflet-slider').remove();
        $('#event-list').remove(); //remove event-list
        // unbind listeners to prevent memory leaks
        $(document).off("mouseup");
        $(".slider").off("mousedown");
    },

    startSlider: function () {
        _options = this.options;
        _extractTimestamp = this.extractTimestamp
        var index_start = _options.minValue;
        if(_options.showAllOnStart){
            index_start = _options.maxValue;
            if(_options.range) _options.values = [_options.minValue,_options.maxValue];
            else _options.value = _options.maxValue;
        }
        $("#leaflet-slider").slider({
            range: _options.range,
            value: _options.value,
            values: _options.values,
            min: _options.minValue,
            max: _options.maxValue,
            step: 1,
            slide: function (e, ui) {
                var map = _options.map;
                var featuregroup = L.featureGroup();
                if(!!_options.markers[ui.value]) {
                    if(_options.markers[ui.value].feature !== undefined) {
                        if(_options.markers[ui.value].feature.properties[_options.timeAttribute]){
                            if(_options.markers[ui.value]) $('#slider-timestamp').html(
                                _extractTimestamp(_options.markers[ui.value].feature.properties[_options.timeAttribute], _options).substr(0,4));//only to check; display is set to none

                        }else {
                            console.error("Time property "+ _options.timeAttribute +" not found in data");
                        }
                    }else {
                        // set by leaflet Vector Layers
                        if(_options.markers [ui.value].options[_options.timeAttribute]){
                            if(_options.markers[ui.value]) $('#slider-timestamp').html(
                                _extractTimestamp(_options.markers[ui.value].options[_options.timeAttribute], _options).substr(0,4));//only to check; display is set to none
                        }else {
                            console.error("Time property "+ _options.timeAttribute +" not found in data");
                        }
                    }
                    


                    var i;
                    

                    // clear markers
                    for (i = _options.minValue; i <= _options.maxValue; i++) {
                        if(_options.markers[i]) map.removeLayer(_options.markers[i]);
                    }
                    

                    // clear event list
                    $('#event-list').html('');
                    

                    if(_options.range){
                        // jquery ui using range
                        $('#time_range').html('<strong>'+_extractTimestamp(_options.markers[ui.values[0]].feature.properties[_options.timeAttribute],_options).substr(0,4)+' - '+_extractTimestamp(_options.markers[ui.values[1]].feature.properties[_options.timeAttribute],_options).substr(0,4)+' (slide to change time range)</strong>')
                        for (i = ui.values[0]; i <= ui.values[1]; i++){
                           if(_options.markers[i]) {
                                
                                //updating markers and event-list
                                var mexicanIcon = L.icon({iconUrl: "https://library.uta.edu/borderland/sites/default/files/styles/marker/public/marker/1821-Mexican.png?itok=gvK38pp2",
                                						  iconSize: [24,38],
                                						  iconAnchor: [12, 38],
    													  popupAnchor: [0,-38]
                            							});
    							var revolutionIcon = L.icon({iconUrl: 'https://library.uta.edu/borderland/sites/default/files/styles/marker/public/marker/1835-Revolution.png?itok=nyUoBPZ8',
    													     iconSize: [24,38],
    													     iconAnchor: [12, 38],
    													     popupAnchor: [0,-38]
    													   });
    							var republicIcon = L.icon({iconUrl: 'https://library.uta.edu/borderland/sites/default/files/styles/marker/public/marker/1836-Republic.png?itok=3KiuoytH',
    													   iconSize: [24,38],
    													   iconAnchor: [20, 51],
    													   popupAnchor: [0,-38]
    													 });
    							
    							    _options.markers[i].bindPopup('<a href="#">'+_options.markers[i].feature.properties.name+'</a>'+'<br><br>'+_options.markers[i].feature.properties.Date+'<br>'+
                               		_options.markers[i].feature.properties.description+'<br><br>'+'<strong>Time Period: </strong>'+'<a href="#">'+_options.markers[i].feature.properties.timePeriod+'</a>'+'<br>'+
                               		'<strong>Ethnic Group: </strong>'+'<br>'+'<strong>Tribe: </strong>'+_options.markers[i].feature.properties.Tribe+'<br>'+'<strong>Gender: </strong>'+_options.markers[i].feature.properties.Gender+
                               		'<br>'+'<strong>Activity: </strong>'+_options.markers[i].feature.properties.Activity+'<br>'+'<strong>Location:</strong>'+'<br>'+'Latitude: '+_options.markers[i].feature.geometry.coordinates[0]+'<br>'+'Longitude: '+_options.markers[i].feature.geometry.coordinates[1]+'<br><br><br>'+
                               		'<strong>Citation:</strong>'+_options.markers[i].feature.properties.Citation);

    							if (_options.markers[i].feature.properties.timePeriod == 'Mexican Era 1821-1835')
    							{
                               		_options.markers[i].setIcon(mexicanIcon);
                               		$('#event-list').append('<div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="https://library.uta.edu/borderland/sites/default/files/styles/marker/public/marker/1821-Mexican.png?itok=gvK38pp2" width="21" height="33" alt="Mexican Era Marker" /></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].features.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].features.properties.Date+'</div></div></div></div></div>')
                              	}
                              	else if (_options.markers[i].feature.properties.timePeriod == 'Texas Revolution 1835-36')
        						{
                               		_options.markers[i].setIcon(revolutionIcon);
                               		$('#event-list').append('<div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="https://library.uta.edu/borderland/sites/default/files/styles/marker/public/marker/1835-Revolution.png?itok=nyUoBPZ8" width="21" height="33" alt="Mexican Era Marker" /></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].features.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].features.properties.Date+'</div></div></div></div></div>')
        						}
        						else if (_options.markers[i].feature.properties.timePeriod == 'Texas Republic 1836-45')
        						{
                               		_options.markers[i].setIcon(republicIcon);
                               		$('#event-list').append('<div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="https://library.uta.edu/borderland/sites/default/files/styles/marker/public/marker/1836-Republic.png?itok=3KiuoytH" width="21" height="33" alt="Mexican Era Marker" /></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].features.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].features.properties.Date+'</div></div></div></div></div>')
        						}
                               map.addLayer(_options.markers[i]);
                               featuregroup.addLayer(_options.markers[i]);
                           }
                }
                };
            }
        }
        });
        if (!_options.range && _options.alwaysShowDate) {
            $('#slider-timestamp').html(_extractTimeStamp(_options.markers[index_start].feature.properties[_options.timeAttribute], _options));
        }
        for (i = _options.minValue; i <= index_start; i++) {
        	var mexicanIcon = L.icon({iconUrl: "https://library.uta.edu/borderland/sites/default/files/styles/marker/public/marker/1821-Mexican.png?itok=gvK38pp2",
                                						  iconSize: [24,38],
                                						  iconAnchor: [12, 38],
    													  popupAnchor: [0,-38]
                            							});
    		var revolutionIcon = L.icon({iconUrl: 'https://library.uta.edu/borderland/sites/default/files/styles/marker/public/marker/1835-Revolution.png?itok=nyUoBPZ8',
    													     iconSize: [24,38],
    													     iconAnchor: [12, 38],
    													     popupAnchor: [0,-38]
    													   });
    		var republicIcon = L.icon({iconUrl: 'https://library.uta.edu/borderland/sites/default/files/styles/marker/public/marker/1836-Republic.png?itok=3KiuoytH',
    													   iconSize: [24,38],
    													   iconAnchor: [12, 38],
    													   popupAnchor: [0,-38]
    													 });
    							// intially add all the markers and add all the points to the evet list
    							_options.markers[i].bindPopup('<a href="#">'+_options.markers[i].feature.properties.name+'</a>'+'<br><br>'+_options.markers[i].feature.properties.Date+'<br>'+
                               	_options.markers[i].feature.properties.description+'<br><br>'+'<strong>Time Period: </strong>'+'<a href="#">'+_options.markers[i].feature.properties.timePeriod+'</a>'+'<br>'+'<strong>Ethnic Group: </strong>'+'<br>'+
                               	'<strong>Tribe: </strong>'+_options.markers[i].feature.properties.Tribe+'<br>'+'<strong>Gender: </strong>'+_options.markers[i].feature.properties.Gender+'<br>'+'<strong>Activity: </strong>'+_options.markers[i].feature.properties.Activity+'<br>'+'<strong>Location:</strong>'+'<br>'+'Latitude: '
                               	+_options.markers[i].feature.geometry.coordinates[0]+'<br>'+'Longitude: '+_options.markers[i].feature.geometry.coordinates[1]+'<br><br><br>'+'<strong>Citation:</strong>'+
                               	_options.markers[i].feature.properties.Citation);

    							if (_options.markers[i].feature.properties.timePeriod == 'Mexican Era 1821-1835')
    							{
                               		_options.markers[i].setIcon(mexicanIcon);
                               		_options.markers[i].setIcon(mexicanIcon);
                               		$('#event-list').append('<div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="https://library.uta.edu/borderland/sites/default/files/styles/marker/public/marker/1821-Mexican.png?itok=gvK38pp2" width="21" height="33" alt="Mexican Era Marker" /></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].features.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].features.properties.Date+'</div></div></div></div></div>')
                              	}
                              	else if (_options.markers[i].feature.properties.timePeriod == 'Texas Revolution 1835-36')
        						{
                               		_options.markers[i].setIcon(revolutionIcon);
                               		$('#event-list').append('<div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="https://library.uta.edu/borderland/sites/default/files/styles/marker/public/marker/1835-Revolution.png?itok=nyUoBPZ8" width="21" height="33" alt="Mexican Era Marker" /></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].features.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].features.properties.Date+'</div></div></div></div></div>')
        						}
        						else if (_options.markers[i].feature.properties.timePeriod == 'Texas Republic 1836-45')
        						{
                               		_options.markers[i].setIcon(republicIcon);
                               		$('#event-list').append('<div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="https://library.uta.edu/borderland/sites/default/files/styles/marker/public/marker/1836-Republic.png?itok=3KiuoytH" width="21" height="33" alt="Mexican Era Marker" /></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].features.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].features.properties.Date+'</div></div></div></div></div>')
        						}
            _options.map.addLayer(_options.markers[i]);
        }
    }
});

L.control.sliderControl = function (options) {
    return new L.Control.SliderControl(options);
};
