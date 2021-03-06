L.Control.SliderControl = L.Control.extend({
	
    options: {
        layers: null,
        timeAttribute: 'time',
        startTimeIdx: 0,    // start looking for timestring at index[0]
        timeStrLength: 19,  // the size of yyyy-mm-dd hh:mm:ss i.e. 19
        maxValue: 0,     //for months implementation//15000,
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
        var sliderContainer = L.DomUtil.create('div', 'slider hidden-xs', this._container);
        $(sliderContainer).append('<div id="slider_title" class="left-content"><strong>Slide time-range controls or push play for animation</strong></div>');
        $(sliderContainer).append('<div id="leaflet-slider" class="left-content"><div class="ui-slider-handle"></div><div id="slider-timestamp" style="display: none;"></div></div>');
        //Edit here to chnage the Time Slider Time Range.
		$(sliderContainer).append('<div id ="time_range" class="left-content"><strong>January 1820 - July 1879</strong></div>');
		//Chirag//Time player and settings controller added. To change images please update images at folder://library.uta.edu/borderland/sites/all/themes/borderland_sass/images/
		$(sliderContainer).append('<div id ="slider-control" class="right-content"><img id="playPause" src="//library.uta.edu/borderland/sites/all/themes/borderland_sass/images/play_slider.png" alt="" data-toggle="tooltip" data-placement="left" title="Click play for animation"><img id="customSettings" src="//library.uta.edu/borderland/sites/all/themes/borderland_sass/images/settings_slider.png" alt="" data-toggle="tooltip" data-placement="left" title="Click settings to change animation"></div>');
		
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
            this.options = options;
			this.options.maxValue = index_temp;
        } else {
            console.log("Error");
        }
        return sliderContainer;
    },
	
	 slide: function (e, ui) {
                var map = _options.map;
                var featuregroup = L.featureGroup();
				filterStart = new Date((ui.values[0]*86400000*30)-4733662164000); //Calculate the Start and End date w.r.t. UTC time clock.. in our case its 1820 to any event end..
				filterEnd = new Date((ui.values[1]*86400000*30)-4733662164000);
				
				_timeRange = ui.values[1] - ui.values[0];
				$("#durationInput").val(_timeRange); // Calculating this so that if a manual chnage to slider happens it stays as it is..
				
                _timeValues = [filterStart,filterEnd];
				var layers_length = _options.markers.length-1;
			    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
				$('#time_range').html('<strong>'+months[filterStart.getMonth()] +' '+ filterStart.getFullYear() +' - '+months[filterEnd.getMonth()] +' '+ filterEnd.getFullYear()+'</strong>');
				
				// clear event list
				$('#event-list').html('');
				for (i = _options.minValue; i <= layers_length; i++) {
						if(_options.markers[i]) map.removeLayer(_options.markers[i]);
				}
				
				for (i = _options.minValue; i <= layers_length; i++) {
					var marker_timestamp = (_options.markers[i].feature.properties.time);
					var marker_date = new Date(marker_timestamp.slice(0,4),(parseInt(marker_timestamp.slice(5,7))-1),marker_timestamp.slice(8,10));
						if (marker_date >= filterStart && marker_date <=filterEnd)
						{
								if(!!_options.markers[i]) {
										if(_options.markers[i].feature !== undefined) {
											if(_options.markers[i].feature.properties[_options.timeAttribute]){
												if(_options.markers[i]) $('#slider-timestamp').html(
													_extractTimestamp(_options.markers[i].feature.properties[_options.timeAttribute], _options).substr(0,4));//only to check; display is set to none

											}else {
												console.error("Time property "+ _options.timeAttribute +" not found in data");
											}
										}else {
											// set by leaflet Vector Layers
											if(_options.markers [i].options[_options.timeAttribute]){
												if(_options.markers[i]) $('#slider-timestamp').html(
													_extractTimestamp(_options.markers[i].options[_options.timeAttribute], _options).substr(0,4));//only to check; display is set to none
											}else {
												console.error("Time property "+ _options.timeAttribute +" not found in data");
											}
										}
											//adding a filter to show features of only selected tribe if any..
										   if(tribeFeature!="All" && raceFeature =="All" ) {
											   for (var ftrs in matchFeatures){
													   if(_options.markers[i].feature.properties.Tribe.replace(regex,"").includes(matchFeatures[ftrs])){
															//updating markers and event-list
															var zero_Fatalities_Icon = L.icon({iconUrl: "//library.uta.edu/borderland/sites/default/files/marker/fatalities-1.png",
																					  iconSize: [18,29],
																					  iconAnchor: [12, 38],
																					  popupAnchor: [0,-38]
																					});
															var one_to_five_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-2.png',
																						 iconSize: [18,29],
																						 iconAnchor: [12, 38],
																						 popupAnchor: [0,-38]
																					   });
															var  six_to_ten_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-3.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });
															var  eleven_to_twentyfive_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-4.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });
															var  twentysix_to_fifty_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-5.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });
															var  fiftyone_or_more_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-6.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });							 
																var timeString = _options.markers[i].feature.properties.timePeriod.toLowerCase();
																timeString = timeString.replace(/ /g,"-");
																
																_options.markers[i].bindPopup('<a href="/borderland/event/'+_options.markers[i].feature.properties.Nid+'">'+_options.markers[i].feature.properties.name+'</a>'+'<br><br>'+_options.markers[i].feature.properties.Date+'<br>'+
																_options.markers[i].feature.properties.description+'<br><br>'+'<strong>Time Period: </strong>'+'<a href="/borderland/period/'+timeString+'">'+_options.markers[i].feature.properties.timePeriod+'</a>'+'<br>'+
																'<strong>Race/Ethnicity: </strong>'+_options.markers[i].feature.properties.RaceEthnicity+'<br>'+'<strong>Tribe: </strong>'+_options.markers[i].feature.properties.Tribe+'<br><p style="margin:20px auto;width:220px;">'+_options.markers[i].feature.properties.EventImage+'</p>');
																_options.markers[i].bindTooltip(_options.markers[i].feature.properties.name,{offset: [0,-25]});

															if (_options.markers[i].feature.properties.Fatalities == 0 || _options.markers[i].feature.properties.Fatalities == 'Unknown')
															{
																_options.markers[i].setIcon(zero_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-1.png" width="21" height="33" alt="Zero Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=1 && _options.markers[i].feature.properties.Fatalities <=5)
															{
																_options.markers[i].setIcon(one_to_five_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-2.png" width="21" height="33" alt="1-5 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=6 && _options.markers[i].feature.properties.Fatalities <=10)
															{
																_options.markers[i].setIcon(six_to_ten_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-3.png" width="21" height="33" alt="6-10 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=11 && _options.markers[i].feature.properties.Fatalities <=25)
															{
																_options.markers[i].setIcon(eleven_to_twentyfive_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-4.png" width="21" height="33" alt="11-25 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=26 && _options.markers[i].feature.properties.Fatalities <=50)
															{
																_options.markers[i].setIcon(twentysix_to_fifty_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-5.png" width="21" height="33" alt="26-50 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=51)
															{
																_options.markers[i].setIcon(fiftyone_or_more_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-6.png" width="21" height="33" alt="51 or more Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
														   map.addLayer(_options.markers[i]);
														   featuregroup.addLayer(_options.markers[i]);
														}
											   }
											}//end of if..
											//adding a filter to show features of only selected race if any..
											if(raceFeature!="All" && tribeFeature =="All") {
											   if(_options.markers[i].feature.properties.RaceEthnicity.replace(regex,"").includes(raceFeature)){
													//updating markers and event-list
													var zero_Fatalities_Icon = L.icon({iconUrl: "//library.uta.edu/borderland/sites/default/files/marker/fatalities-1.png",
																					  iconSize: [18,29],
																					  iconAnchor: [12, 38],
																					  popupAnchor: [0,-38]
																					});
															var one_to_five_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-2.png',
																						 iconSize: [18,29],
																						 iconAnchor: [12, 38],
																						 popupAnchor: [0,-38]
																					   });
															var  six_to_ten_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-3.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });
															var  eleven_to_twentyfive_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-4.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });
															var  twentysix_to_fifty_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-5.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });
															var  fiftyone_or_more_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-6.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });							 
																var timeString = _options.markers[i].feature.properties.timePeriod.toLowerCase();
																timeString = timeString.replace(/ /g,"-");
																
																_options.markers[i].bindPopup('<a href="/borderland/event/'+_options.markers[i].feature.properties.Nid+'">'+_options.markers[i].feature.properties.name+'</a>'+'<br><br>'+_options.markers[i].feature.properties.Date+'<br>'+
																_options.markers[i].feature.properties.description+'<br><br>'+'<strong>Time Period: </strong>'+'<a href="/borderland/period/'+timeString+'">'+_options.markers[i].feature.properties.timePeriod+'</a>'+'<br>'+
																'<strong>Race/Ethnicity: </strong>'+_options.markers[i].feature.properties.RaceEthnicity+'<br>'+'<strong>Tribe: </strong>'+_options.markers[i].feature.properties.Tribe+'<br><p style="margin:20px auto;width:220px;">'+_options.markers[i].feature.properties.EventImage+'</p>');
																_options.markers[i].bindTooltip(_options.markers[i].feature.properties.name,{offset: [0,-25]});

															if (_options.markers[i].feature.properties.Fatalities == 0 || _options.markers[i].feature.properties.Fatalities == 'Unknown')
															{
																_options.markers[i].setIcon(zero_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-1.png" width="21" height="33" alt="Zero Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=1 && _options.markers[i].feature.properties.Fatalities <=5)
															{
																_options.markers[i].setIcon(one_to_five_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-2.png" width="21" height="33" alt="1-5 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=6 && _options.markers[i].feature.properties.Fatalities <=10)
															{
																_options.markers[i].setIcon(six_to_ten_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-3.png" width="21" height="33" alt="6-10 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=11 && _options.markers[i].feature.properties.Fatalities <=25)
															{
																_options.markers[i].setIcon(eleven_to_twentyfive_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-4.png" width="21" height="33" alt="11-25 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=26 && _options.markers[i].feature.properties.Fatalities <=50)
															{
																_options.markers[i].setIcon(twentysix_to_fifty_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-5.png" width="21" height="33" alt="26-50 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=51)
															{
																_options.markers[i].setIcon(fiftyone_or_more_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-6.png" width="21" height="33" alt="51 or more Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
														   map.addLayer(_options.markers[i]);
														   featuregroup.addLayer(_options.markers[i]);
												}
											}//end of else if..
											//adding a filter to show features of only selected tribe and race if any..
											if(tribeFeature!="All" && raceFeature!="All") {
											   for (var ftrs in matchFeatures){
													   if(_options.markers[i].feature.properties.Tribe.replace(regex,"").includes(matchFeatures[ftrs]) && _options.markers[i].feature.properties.RaceEthnicity.replace(regex,"").includes(raceFeature)){
															//updating markers and event-list
															var zero_Fatalities_Icon = L.icon({iconUrl: "//library.uta.edu/borderland/sites/default/files/marker/fatalities-1.png",
																					  iconSize: [18,29],
																					  iconAnchor: [12, 38],
																					  popupAnchor: [0,-38]
																					});
															var one_to_five_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-2.png',
																						 iconSize: [18,29],
																						 iconAnchor: [12, 38],
																						 popupAnchor: [0,-38]
																					   });
															var  six_to_ten_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-3.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });
															var  eleven_to_twentyfive_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-4.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });
															var  twentysix_to_fifty_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-5.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });
															var  fiftyone_or_more_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-6.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });							 
																var timeString = _options.markers[i].feature.properties.timePeriod.toLowerCase();
																timeString = timeString.replace(/ /g,"-");
																
																_options.markers[i].bindPopup('<a href="/borderland/event/'+_options.markers[i].feature.properties.Nid+'">'+_options.markers[i].feature.properties.name+'</a>'+'<br><br>'+_options.markers[i].feature.properties.Date+'<br>'+
																_options.markers[i].feature.properties.description+'<br><br>'+'<strong>Time Period: </strong>'+'<a href="/borderland/period/'+timeString+'">'+_options.markers[i].feature.properties.timePeriod+'</a>'+'<br>'+
																'<strong>Race/Ethnicity: </strong>'+_options.markers[i].feature.properties.RaceEthnicity+'<br>'+'<strong>Tribe: </strong>'+_options.markers[i].feature.properties.Tribe+'<br><p style="margin:20px auto;width:220px;">'+_options.markers[i].feature.properties.EventImage+'</p>');
																_options.markers[i].bindTooltip(_options.markers[i].feature.properties.name,{offset: [0,-25]});

															if (_options.markers[i].feature.properties.Fatalities == 0 || _options.markers[i].feature.properties.Fatalities == 'Unknown')
															{
																_options.markers[i].setIcon(zero_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-1.png" width="21" height="33" alt="Zero Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=1 && _options.markers[i].feature.properties.Fatalities <=5)
															{
																_options.markers[i].setIcon(one_to_five_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-2.png" width="21" height="33" alt="1-5 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=6 && _options.markers[i].feature.properties.Fatalities <=10)
															{
																_options.markers[i].setIcon(six_to_ten_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-3.png" width="21" height="33" alt="6-10 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=11 && _options.markers[i].feature.properties.Fatalities <=25)
															{
																_options.markers[i].setIcon(eleven_to_twentyfive_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-4.png" width="21" height="33" alt="11-25 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=26 && _options.markers[i].feature.properties.Fatalities <=50)
															{
																_options.markers[i].setIcon(twentysix_to_fifty_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-5.png" width="21" height="33" alt="26-50 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=51)
															{
																_options.markers[i].setIcon(fiftyone_or_more_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-6.png" width="21" height="33" alt="51 or more Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
														   map.addLayer(_options.markers[i]);
														   featuregroup.addLayer(_options.markers[i]);
														}
											   }
											}// end of else if..
											// else show all feature and tribe if no tribe and race is selected..
											if(tribeFeature=="All" && raceFeature=="All") {
												//updating markers and event-list
												var zero_Fatalities_Icon = L.icon({iconUrl: "//library.uta.edu/borderland/sites/default/files/marker/fatalities-1.png",
																					  iconSize: [18,29],
																					  iconAnchor: [12, 38],
																					  popupAnchor: [0,-38]
																					});
															var one_to_five_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-2.png',
																						 iconSize: [18,29],
																						 iconAnchor: [12, 38],
																						 popupAnchor: [0,-38]
																					   });
															var  six_to_ten_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-3.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });
															var  eleven_to_twentyfive_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-4.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });
															var  twentysix_to_fifty_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-5.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });
															var  fiftyone_or_more_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-6.png',
																					   iconSize: [18,29],
																					   iconAnchor: [12, 38],
																					   popupAnchor: [0,-38]
																					 });							 
																var timeString = _options.markers[i].feature.properties.timePeriod.toLowerCase();
																timeString = timeString.replace(/ /g,"-");
																
																_options.markers[i].bindPopup('<a href="/borderland/event/'+_options.markers[i].feature.properties.Nid+'">'+_options.markers[i].feature.properties.name+'</a>'+'<br><br>'+_options.markers[i].feature.properties.Date+'<br>'+
																_options.markers[i].feature.properties.description+'<br><br>'+'<strong>Time Period: </strong>'+'<a href="/borderland/period/'+timeString+'">'+_options.markers[i].feature.properties.timePeriod+'</a>'+'<br>'+
																'<strong>Race/Ethnicity: </strong>'+_options.markers[i].feature.properties.RaceEthnicity+'<br>'+'<strong>Tribe: </strong>'+_options.markers[i].feature.properties.Tribe+'<br><p style="margin:20px auto;width:220px;">'+_options.markers[i].feature.properties.EventImage+'</p>');
																_options.markers[i].bindTooltip(_options.markers[i].feature.properties.name,{offset: [0,-25]});

															if (_options.markers[i].feature.properties.Fatalities == 0 || _options.markers[i].feature.properties.Fatalities == 'Unknown')
															{
																_options.markers[i].setIcon(zero_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-1.png" width="21" height="33" alt="Zero Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=1 && _options.markers[i].feature.properties.Fatalities <=5)
															{
																_options.markers[i].setIcon(one_to_five_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-2.png" width="21" height="33" alt="1-5 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=6 && _options.markers[i].feature.properties.Fatalities <=10)
															{
																_options.markers[i].setIcon(six_to_ten_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-3.png" width="21" height="33" alt="6-10 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=11 && _options.markers[i].feature.properties.Fatalities <=25)
															{
																_options.markers[i].setIcon(eleven_to_twentyfive_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-4.png" width="21" height="33" alt="11-25 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=26 && _options.markers[i].feature.properties.Fatalities <=50)
															{
																_options.markers[i].setIcon(twentysix_to_fifty_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-5.png" width="21" height="33" alt="26-50 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
															else if (_options.markers[i].feature.properties.Fatalities >=51)
															{
																_options.markers[i].setIcon(fiftyone_or_more_Fatalities_Icon);
																$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-6.png" width="21" height="33" alt="51 or more Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
															}
														   map.addLayer(_options.markers[i]);
														   featuregroup.addLayer(_options.markers[i]);
											}
								}//END OF OPTION MARKER'S IF
								 //  featuregroup.addLayer(_options.markers[i]);
						}//end of if..
					
				}//end of for..
               
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
			slide: this.slide
         });
		var layers_length = _options.markers.length-1;
		//console.log("Markers length: "+layers_length);
		var ui_c = {"values":[$('#leaflet-slider').slider("values",0),$('#leaflet-slider').slider("values",1)]};
		
		filterStart = new Date((ui_c.values[0]*86400000*30)-4733662164000);//Calculate the Start and End date w.r.t. UTC time clock.. in our case its 1820 to any event end..
		filterEnd = new Date((ui_c.values[1]*86400000*30)-4733662164000);
        if (!_options.range && _options.alwaysShowDate) {
            $('#slider-timestamp').html(_extractTimeStamp(_options.markers[index_start].feature.properties[_options.timeAttribute], _options));
        }
        for (i = _options.minValue; i <= layers_length; i++) {
			var marker_timestamp = (_options.markers[i].feature.properties.time);
			var marker_date = new Date(marker_timestamp.slice(0,4),(parseInt(marker_timestamp.slice(5,7))-1),marker_timestamp.slice(8,10));	
			if (marker_date >= filterStart && marker_date <=filterEnd)
			{
        	var zero_Fatalities_Icon = L.icon({iconUrl: "//library.uta.edu/borderland/sites/default/files/marker/fatalities-1.png",
									  iconSize: [18,29],
									  iconAnchor: [12, 38],
									  popupAnchor: [0,-38]
									});
			var one_to_five_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-2.png',
										 iconSize: [18,29],
										 iconAnchor: [12, 38],
										 popupAnchor: [0,-38]
									   });
			var  six_to_ten_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-3.png',
									   iconSize: [18,29],
									   iconAnchor: [12, 38],
									   popupAnchor: [0,-38]
									 });
			var  eleven_to_twentyfive_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-4.png',
									   iconSize: [18,29],
									   iconAnchor: [12, 38],
									   popupAnchor: [0,-38]
									 });
			var  twentysix_to_fifty_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-5.png',
									   iconSize: [18,29],
									   iconAnchor: [12, 38],
									   popupAnchor: [0,-38]
									 });
			var  fiftyone_or_more_Fatalities_Icon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/fatalities-6.png',
									   iconSize: [18,29],
									   iconAnchor: [12, 38],
									   popupAnchor: [0,-38]
									 });							 
				var timeString = _options.markers[i].feature.properties.timePeriod.toLowerCase();
				timeString = timeString.replace(/ /g,"-");
				
				_options.markers[i].bindPopup('<a href="/borderland/event/'+_options.markers[i].feature.properties.Nid+'">'+_options.markers[i].feature.properties.name+'</a>'+'<br><br>'+_options.markers[i].feature.properties.Date+'<br>'+
				_options.markers[i].feature.properties.description+'<br><br>'+'<strong>Time Period: </strong>'+'<a href="/borderland/period/'+timeString+'">'+_options.markers[i].feature.properties.timePeriod+'</a>'+'<br>'+
				'<strong>Race/Ethnicity: </strong>'+_options.markers[i].feature.properties.RaceEthnicity+'<br>'+'<strong>Tribe: </strong>'+_options.markers[i].feature.properties.Tribe+'<br><p style="margin:20px auto;width:220px;">'+_options.markers[i].feature.properties.EventImage+'</p>');
				_options.markers[i].bindTooltip(_options.markers[i].feature.properties.name,{offset: [0,-25]});

			if (_options.markers[i].feature.properties.Fatalities == 0 || _options.markers[i].feature.properties.Fatalities == 'Unknown')
			{
				_options.markers[i].setIcon(zero_Fatalities_Icon);
				$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-1.png" width="21" height="33" alt="Zero Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
			}
			else if (_options.markers[i].feature.properties.Fatalities >=1 && _options.markers[i].feature.properties.Fatalities <=5)
			{
				_options.markers[i].setIcon(one_to_five_Fatalities_Icon);
				$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-2.png" width="21" height="33" alt="1-5 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
			}
			else if (_options.markers[i].feature.properties.Fatalities >=6 && _options.markers[i].feature.properties.Fatalities <=10)
			{
				_options.markers[i].setIcon(six_to_ten_Fatalities_Icon);
				$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-3.png" width="21" height="33" alt="6-10 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
			}
			else if (_options.markers[i].feature.properties.Fatalities >=11 && _options.markers[i].feature.properties.Fatalities <=25)
			{
				_options.markers[i].setIcon(eleven_to_twentyfive_Fatalities_Icon);
				$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-4.png" width="21" height="33" alt="11-25 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
			}
			else if (_options.markers[i].feature.properties.Fatalities >=26 && _options.markers[i].feature.properties.Fatalities <=50)
			{
				_options.markers[i].setIcon(twentysix_to_fifty_Fatalities_Icon);
				$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-5.png" width="21" height="33" alt="26-50 Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
			}
			else if (_options.markers[i].feature.properties.Fatalities >=51)
			{
				_options.markers[i].setIcon(fiftyone_or_more_Fatalities_Icon);
				$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/fatalities-6.png" width="21" height="33" alt="51 or more Fatalities"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
			}
            _options.map.addLayer(_options.markers[i]);
			}
        }
    }
});

L.control.sliderControl = function (options) {
    return new L.Control.SliderControl(options);
};

