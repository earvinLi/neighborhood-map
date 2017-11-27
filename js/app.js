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

const ViewModel = () => {

  let markers = [];

  self.createMarkersForPlaces = (places) => {
    let bounds = new google.maps.LatLngBounds();
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
      if (place.geometry.viewport) {
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		}
    map.fitBounds(bounds);
	};

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
