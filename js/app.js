let map;

const ViewModel = () => {

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
