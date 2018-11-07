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
        var sliderContainer = L.DomUtil.create('div', 'slider hidden-xs', this._container);
        $(sliderContainer).append('<div id="slider_title" class="left-content"><strong>Slide time-range controls or push play for animation</strong></div>');
        $(sliderContainer).append('<div id="leaflet-slider" class="left-content"><div class="ui-slider-handle"></div><div id="slider-timestamp" style="display: none;"></div></div>');
        $(sliderContainer).append('<div id ="time_range" class="left-content"><strong>January 1, 1820 - July 27, 1879</strong></div>');
		//Chirag//A player and settings time controller added. To change images please update images at folder://library-test.uta.edu/borderland/sites/all/themes/borderland_sass/images/
		$(sliderContainer).append('<div id ="slider-control" class="right-content"><img id="playPause" src="//library-test.uta.edu/borderland/sites/all/themes/borderland_sass/images/play_slider.png" alt="" data-toggle="tooltip" data-placement="left" title="Click play for animation"><img id="customSettings" src="//library-test.uta.edu/borderland/sites/all/themes/borderland_sass/images/settings_slider.png" alt="" data-toggle="tooltip" data-placement="left" title="Click settings to change animation"></div>');
		
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
					
					// var left = 100 * (ui.values[0] - myMin) / (myMax - myMin);
					// var right = 100 * (ui.values[1] - myMin) / (myMax - myMin);
					// $(this).css('background-image', '-webkit-linear-gradient(left, red ' + left + '%, blue ' + right + '%)');

                    var i;
                    

                    // clear markers
                    for (i = _options.minValue; i <= _options.maxValue; i++) {
						//console.log("seeing the bounds"+i);
                        if(_options.markers[i]) map.removeLayer(_options.markers[i]);
                    }
                    
                    // clear event list
                    $('#event-list').html('');
					var d = new Date(_options.markers[ui.values[0]].feature.properties.time);
					var d1 = new Date(_options.markers[ui.values[1]].feature.properties.time);
					var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                    if(_options.range){
						//Chirag
						//$('#time_range').html('<strong>'+_extractTimestamp(_options.markers[ui.values[0]].feature.properties[_options.timeAttribute],_options).substr(0,4)+' - '+_extractTimestamp(_options.markers[ui.values[1]].feature.properties[_options.timeAttribute],_options).substr(0,4)+'</strong>')
						//Commenting previous time range -- new one is according to long-date format i.e month-date-year.
						$('#time_range').html('<strong>'+months[d.getMonth()] +' '+ d.getDate() +', '+ d.getFullYear() +' - '+months[d1.getMonth()] +' '+d1.getDate() +', '+ d1.getFullYear()+'</strong>');
                        // console.log("I am getting :"+ ui.values[0] +" and :"+ui.values[1]);
					   for (i = ui.values[0]; i <= ui.values[1]; i++){
						   //console.log("Marker id: "+_options.markers[i].feature.properties.Nid + " and marker name: "+_options.markers[i].feature.properties.name);
                           if(_options.markers[i]) {
							   //console.log("hmm"+tribeFeature)
							   if(tribeFeature!="All") {
								   for (var ftrs in matchFeatures){
										   if(_options.markers[i].feature.properties.Tribe.replace(regex,"").includes(matchFeatures[ftrs])){
												//updating markers and event-list
												var mexicanIcon = L.icon({iconUrl: "//library.uta.edu/borderland/sites/default/files/marker/1821-Mexican.png",
																		  iconSize: [24,38],
																		  iconAnchor: [12, 38],
																		  popupAnchor: [0,-38]
																		});
												var revolutionIcon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/1835-Revolution.png',
																			 iconSize: [24,38],
																			 iconAnchor: [12, 38],
																			 popupAnchor: [0,-38]
																		   });
												var republicIcon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/1836-Republic.png',
																		   iconSize: [24,38],
																		   iconAnchor: [12, 38],
																		   popupAnchor: [0,-38]
																		 });
												var statehoodIcon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/1845-Statehood.png',
																		   iconSize: [24,38],
																		   iconAnchor: [12, 38],
																		   popupAnchor: [0,-38]
																		 });
													var timeString = _options.markers[i].feature.properties.timePeriod.toLowerCase();
													timeString = timeString.replace(/ /g,"-");
													
													_options.markers[i].bindPopup('<a href="/borderland/event/'+_options.markers[i].feature.properties.Nid+'">'+_options.markers[i].feature.properties.name+'</a>'+'<br><br>'+_options.markers[i].feature.properties.Date+'<br>'+
													_options.markers[i].feature.properties.description+'<br><br>'+'<strong>Time Period: </strong>'+'<a href="/borderland/period/'+timeString+'">'+_options.markers[i].feature.properties.timePeriod+'</a>'+'<br>'+
													'<strong>Ethnic Group: </strong>'+_options.markers[i].feature.properties.EthnicGroup+'<br>'+'<strong>Tribe: </strong>'+_options.markers[i].feature.properties.Tribe+'<br>'+'<strong>Gender: </strong>'+_options.markers[i].feature.properties.Gender+
													'<br>'+'<strong>Activity: </strong>'+_options.markers[i].feature.properties.Activity);
													_options.markers[i].bindTooltip(_options.markers[i].feature.properties.name,{offset: [0,-25]});

												if (_options.markers[i].feature.properties.timePeriod == 'Mexican Era 1821-1835')
												{
													_options.markers[i].setIcon(mexicanIcon);
													$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/styles/marker/public/marker/1821-Mexican.png" width="21" height="33" alt="Mexican Era Marker"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
												}
												else if (_options.markers[i].feature.properties.timePeriod == 'Texas Revolution 1835-36')
												{
													_options.markers[i].setIcon(revolutionIcon);
													$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/1835-Revolution.png" width="21" height="33" alt="Revolution Era Marker"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
												}
												else if (_options.markers[i].feature.properties.timePeriod == 'Texas Republic 1836-45')
												{
													_options.markers[i].setIcon(republicIcon);
													$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/styles/marker/public/marker/1836-Republic.png" width="21" height="33" alt="Republic Era Marker"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
												}
												else if (_options.markers[i].feature.properties.timePeriod == 'Texas Statehood 1846-')
												{
													_options.markers[i].setIcon(statehoodIcon);
													$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/styles/marker/public/marker/1845-Statehood.png" width="21" height="33" alt="Statehood Era Marker"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
												}
											   map.addLayer(_options.markers[i]);
											   featuregroup.addLayer(_options.markers[i]);
											}
								   }
								}
								else{
									//console.log("TribeFeature"+tribeFeature);
									//updating markers and event-list
									var mexicanIcon = L.icon({iconUrl: "//library.uta.edu/borderland/sites/default/files/marker/1821-Mexican.png",
															  iconSize: [24,38],
															  iconAnchor: [12, 38],
															  popupAnchor: [0,-38]
															});
									var revolutionIcon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/1835-Revolution.png',
																 iconSize: [24,38],
																 iconAnchor: [12, 38],
																 popupAnchor: [0,-38]
															   });
									var republicIcon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/1836-Republic.png',
															   iconSize: [24,38],
															   iconAnchor: [12, 38],
															   popupAnchor: [0,-38]
															 });
									var statehoodIcon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/1845-Statehood.png',
															   iconSize: [24,38],
															   iconAnchor: [12, 38],
															   popupAnchor: [0,-38]
															 });
										var timeString = _options.markers[i].feature.properties.timePeriod.toLowerCase();
										timeString = timeString.replace(/ /g,"-");
										
										_options.markers[i].bindPopup('<a href="/borderland/event/'+_options.markers[i].feature.properties.Nid+'">'+_options.markers[i].feature.properties.name+'</a>'+'<br><br>'+_options.markers[i].feature.properties.Date+'<br>'+
										_options.markers[i].feature.properties.description+'<br><br>'+'<strong>Time Period: </strong>'+'<a href="/borderland/period/'+timeString+'">'+_options.markers[i].feature.properties.timePeriod+'</a>'+'<br>'+
										'<strong>Ethnic Group: </strong>'+_options.markers[i].feature.properties.EthnicGroup+'<br>'+'<strong>Tribe: </strong>'+_options.markers[i].feature.properties.Tribe+'<br>'+'<strong>Gender: </strong>'+_options.markers[i].feature.properties.Gender+
										'<br>'+'<strong>Activity: </strong>'+_options.markers[i].feature.properties.Activity);
										_options.markers[i].bindTooltip(_options.markers[i].feature.properties.name,{offset: [0,-25]});

									if (_options.markers[i].feature.properties.timePeriod == 'Mexican Era 1821-1835')
									{
										_options.markers[i].setIcon(mexicanIcon);
										$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/styles/marker/public/marker/1821-Mexican.png" width="21" height="33" alt="Mexican Era Marker"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
									}
									else if (_options.markers[i].feature.properties.timePeriod == 'Texas Revolution 1835-36')
									{
										_options.markers[i].setIcon(revolutionIcon);
										$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/1835-Revolution.png" width="21" height="33" alt="Revolution Era Marker"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
									}
									else if (_options.markers[i].feature.properties.timePeriod == 'Texas Republic 1836-45')
									{
										_options.markers[i].setIcon(republicIcon);
										$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/styles/marker/public/marker/1836-Republic.png" width="21" height="33" alt="Republic Era Marker"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
									}
									else if (_options.markers[i].feature.properties.timePeriod == 'Texas Statehood 1846-')
									{
										_options.markers[i].setIcon(statehoodIcon);
										$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/styles/marker/public/marker/1845-Statehood.png" width="21" height="33" alt="Statehood Era Marker"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
									}
								   map.addLayer(_options.markers[i]);
								   featuregroup.addLayer(_options.markers[i]);
								}
                           }
                }
            }
			else{
				console.log("Range false.. check range ui events.");
			}
		}
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
		
        if (!_options.range && _options.alwaysShowDate) {
            $('#slider-timestamp').html(_extractTimeStamp(_options.markers[index_start].feature.properties[_options.timeAttribute], _options));
        }
        for (i = _options.minValue; i <= index_start; i++) {
        	var mexicanIcon = L.icon({iconUrl: "//library.uta.edu/borderland/sites/default/files/marker/1821-Mexican.png",
                                						  iconSize: [24,38],
                                						  iconAnchor: [12, 38],
    													  popupAnchor: [0,-38]
                            							});
    		var revolutionIcon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/1835-Revolution.png',
    													     iconSize: [24,38],
    													     iconAnchor: [12, 38],
    													     popupAnchor: [0,-38]
    													   });
    		var republicIcon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/1836-Republic.png',
    													   iconSize: [24,38],
    													   iconAnchor: [12, 38],
    													   popupAnchor: [0,-38]
    													 });
			var statehoodIcon = L.icon({iconUrl: '//library.uta.edu/borderland/sites/default/files/marker/1845-Statehood.png',
    													   iconSize: [24,38],
    													   iconAnchor: [12, 38],
    													   popupAnchor: [0,-38]
    													 });
    							var timeString = _options.markers[i].feature.properties.timePeriod.toLowerCase();
    							timeString = timeString.replace(/ /g,"-");
    							// intially add all the markers and add all the points to the evet list
    							_options.markers[i].bindPopup('<a href="/borderland/event/'+_options.markers[i].feature.properties.Nid+'">'+_options.markers[i].feature.properties.name+'</a>'+'<br><br>'+_options.markers[i].feature.properties.Date+'<br>'+
                               	_options.markers[i].feature.properties.description+'<br><br>'+'<strong>Time Period: </strong>'+'<a href="/borderland/period/'+timeString+'">'+_options.markers[i].feature.properties.timePeriod+'</a>'+'<br>'+'<strong>Ethnic Group: </strong>'+_options.markers[i].feature.properties.EthnicGroup+'<br>'+
                               	'<strong>Tribe: </strong>'+_options.markers[i].feature.properties.Tribe+'<br>'+'<strong>Gender: </strong>'+_options.markers[i].feature.properties.Gender+'<br>'+'<strong>Activity: </strong>'+_options.markers[i].feature.properties.Activity);
                               	_options.markers[i].bindTooltip(_options.markers[i].feature.properties.name,{offset: [0,-25]});

    							if (_options.markers[i].feature.properties.timePeriod == 'Mexican Era 1821-1835')
    							{
                               		_options.markers[i].setIcon(mexicanIcon);
                               		_options.markers[i].setIcon(mexicanIcon);
                               		$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/styles/marker/public/marker/1821-Mexican.png" width="21" height="33" alt="Mexican Era Marker"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');

                              	}
                              	else if (_options.markers[i].feature.properties.timePeriod == 'Texas Revolution 1835-36')
        						{
                               		_options.markers[i].setIcon(revolutionIcon);
                               		$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/marker/1835-Revolution.png" width="21" height="33" alt="Revolution Era Marker"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
        						}
        						else if (_options.markers[i].feature.properties.timePeriod == 'Texas Republic 1836-45')
        						{
                               		_options.markers[i].setIcon(republicIcon);
                               		$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/styles/marker/public/marker/1836-Republic.png" width="21" height="33" alt="Republic Era Marker"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
        						}
								else if (_options.markers[i].feature.properties.timePeriod == 'Texas Statehood 1846-')
        						{
                               		_options.markers[i].setIcon(statehoodIcon);
                               		$('#event-list').append('<div class="views-row" onclick="focusOn('+_options.markers[i].feature.properties.Nid+')" onmouseover="showTooltip('+_options.markers[i].feature.properties.Nid+')" onmouseout="hideTooltip('+_options.markers[i].feature.properties.Nid+')"><div class="panel-flexible panels-flexible-list_results clearfix"><div class="panel-flexible-inside panels-flexible-list_results-inside"><div class="panels-flexible-region panels-flexible-region-list_results-marker panels-flexible-region-first col-md-2 col-sm-1 col-lg-2"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-marker-inside panels-flexible-region-inside-first"><div class="views-field views-field-field-marker"><div class="field-content"><img typeof="foaf:Image" class="img-responsive" src="/borderland/sites/default/files/styles/marker/public/marker/1845-Statehood.png" width="21" height="33" alt="Statehood Era Marker"/></div></div></div></div><div class="panels-flexible-region panels-flexible-region-list_results-center panels-flexible-region-last col-md-10 col-sm-11 col-lg-10"><div class="inside panels-flexible-region-inside panels-flexible-region-list_results-center-inside panels-flexible-region-inside-last"><div class="views-field views-field-title"><span class="field-content">'+_options.markers[i].feature.properties.name+'</span></div><div class="views-field views-field-field-display-date"><div class="field-content">'+_options.markers[i].feature.properties.Date+'</div></div></div></div></div></div></div>');
        						}
            _options.map.addLayer(_options.markers[i]);
        }
    }
});

L.control.sliderControl = function (options) {
    return new L.Control.SliderControl(options);
};

