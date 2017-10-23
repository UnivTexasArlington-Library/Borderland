L.Control.SliderControl = L.Control.extend({
    options: {
        position: 'topleft',
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
        $(sliderContainer).append('<div id="leaflet-slider" style="width:600px"><div class="ui-slider-handle"></div><div id="slider-timestamp" style="display: none;"></div></div>');
        $(sliderContainer).append('<div id ="time_range" style="color: red;"><h3>1820 - 1839 (slide to change time range)</h3></div>')
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
            console.log("Error: You have to specify a layer via new SliderControl({layer: your_layer});");
        }
        return sliderContainer;
    },

    onRemove: function (map) {
        //Delete all markers which where added via the slider and remove the slider div
        for (i = this.options.minValue; i <= this.options.maxValue; i++) {
            map.removeLayer(this.options.markers[i]);
        }
        $('#leaflet-slider').remove();
        $('#event-list').remove(); //remove side panel
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
                        $('#time_range').html('<h3>'+_extractTimestamp(_options.markers[ui.values[0]].feature.properties[_options.timeAttribute],_options).substr(0,4)+' - '+_extractTimestamp(_options.markers[ui.values[1]].feature.properties[_options.timeAttribute],_options).substr(0,4)+' (slide to change time range)</div>')
                        for (i = ui.values[0]; i <= ui.values[1]; i++){
                           if(_options.markers[i]) {
                           		//adding popups to markers
                           	   _options.markers[i].bindPopup('<a href="#">'+_options.markers[i].feature.properties.name+'</a>'+'<br><br>'+_options.markers[i].feature.properties.time.substr(0,10)+'<br>'+
                           	   _options.markers[i].feature.properties.description+'<br><br>'+'Time Period: '+'<a href="#">'+_options.markers[i].feature.properties.timePeriod+'</a>'+'<br>'+'Location:'+'<br>'+'Latitude: '+
                           	   _options.markers[i].feature.geometry.coordinates[0]+'<br>'+'Longitude: '+_options.markers[i].feature.geometry.coordinates[1]);
                              
                               map.addLayer(_options.markers[i]);
                               featuregroup.addLayer(_options.markers[i]);
                               ///update event list                    
                               $('#event-list').append('<div class="panel-body"><a href="#">'+_options.markers[i].feature.properties.name+' ('+_options.markers[i].feature.properties.time.substr(0,4)+')'+'</a></div');
                           }
                    else{
                        for (i = _options.minValue; i <= ui.value ; i++) {
                            if(_options.markers[i]) {
                                map.addLayer(_options.markers[i]);
                                featuregroup.addLayer(_options.markers[i]);
                            }
                        }
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
            _options.map.addLayer(_options.markers[i]);
        }
    }
});

L.control.sliderControl = function (options) {
    return new L.Control.SliderControl(options);
};