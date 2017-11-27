let map;

const initialPlaces = [
	{
		name: "Golden Gate Bridge",
		geometry: {location: {lat: 37.8199286, lng: -122.47825510000001}},
		formatted_address: "Golden Gate Bridge, San Francisco, CA, USA"
	},
	{
		name: "PIER 39",
		geometry: {location: {lat: 37.808673, lng: -122.40982099999997}},
		formatted_address: "Beach St & The Embarcadero, San Francisco, CA 94133, United States"
	},
	{
		name: "Alcatraz Island",
		geometry: {location: {lat: 37.8269775, lng: -122.4229555}},
		formatted_address: "San Francisco, CA 94133, United States"
	},
	{
		name: "Palace of Fine Arts Theatre",
		geometry: {location: {lat: 37.8019913, lng: -122.44865649999997}},
		formatted_address: "3301 Lyon St, San Francisco, CA 94123, United States"
	},
	{
		name: "Twin Peaks",
		geometry: {location: {lat: 37.7525098, lng: -122.4475683}},
		formatted_address: "501 Twin Peaks Blvd, San Francisco, CA 94114, USA"
	}
];

const Place = (data) => {
	this.name = ko.observable(data.name);
	this.formatted_address = ko.observable(data.formatted_address);
	this.marker = data.marker;
	this.infoWindow = data.infoWindow;
};

const ViewModel = () => {
  const self = this;
	self.placesToSearch = ko.observable('');
  self.placesList = ko.observableArray();
  self.placesToFilter = ko.observable('');
  self.filteredPlacesList = ko.computed(function() {
		let filter = self.placesToFilter().toLowerCase();
    if (!filter) {
			self.placesList().forEach(function(place) {
				place.marker.setVisible(true);
			});
			return self.placesList();
		} else {
			return ko.utils.arrayFilter(self.placesList(), function(place) {
				if (place.name().toLowerCase().indexOf(filter) != -1) {
					place.marker.setVisible(true);
					return place;
				} else {
					place.marker.setVisible(false);
				}
			});
		}
	});

  let markers = [];
  let infoWindow = new google.maps.InfoWindow();

  self.hideMarkers = (markers) => {
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
	};

  self.createMarkersForPlaces = (places) => {
    let bounds = new google.maps.LatLngBounds();
    self.hideMarkers(markers);
    function openInfoWindow() {
			let place = places[this.id];
      let marker = this;
			this.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {marker.setAnimation(null);}, 2750);
      self.getWiki(place, place.name, place.formatted_address);
			place.infoWindow.open(map, this);
		}
		for (let i = 0; i < places.length; i++) {
			let place = places[i];
			let marker = new google.maps.Marker({
				title: place.name,
				position: place.geometry.location,
				map: map,
				visible: true,
				id: i
			});
			place.marker = marker;
			markers.push(marker);
      place.infoWindow = infoWindow;
			marker.addListener('click', openInfoWindow);
      if (place.geometry.viewport) {
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		}
    map.fitBounds(bounds);
	};

  const placesService = new google.maps.places.PlacesService(map);
  self.textSearch = () => {
    placesService.textSearch({
			query: self.placesToSearch(),
			bounds: map.getBounds()
		}, function(places) {
			if (places.length === 0) {
				alert('Sorry no place found! Please change key word(s) and search again.');
			}
      self.placesList([]);
			self.createMarkersForPlaces(places);
      places.forEach(function(place) {
				self.placesList.push(new Place(place));
			});
		});
	};

  self.openInfoWindow = (place) => {
		place.marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {place.marker.setAnimation(null);}, 3000);
    self.getWiki(place, place.name(), place.formatted_address());
		place.infoWindow.open(map, place.marker);
	};

  self.getWiki = (place, placeName, placeAddress) => {
		$.ajax({
			url: `https://en.wikipedia.org/w/api.php?action=opensearch&search=${placeName}&format=json&callback=wiwikiCallback`,
			dataType: 'jsonp',
			jsonp: 'callback'
		})
		.done(function(response) {
      let infoContent = `
				<p>${placeName}</p>
				<p>${placeAddress}</p>`;
      place.infoWindow.setContent(infoContent);
		})
		.fail(function(error) {
			alert(Error(error));
		});
	};

  self.createMarkersForPlaces(initialPlaces);
};

let map;
initMap = () => {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.7749, lng: -122.4194},
		zoom: 12
	});
};
handleError = () => {
	alert(`Your map can't be loaded correctly. Please check the console for technical details and solutions.`);
  ko.applyBindings(new ViewModel());
};
