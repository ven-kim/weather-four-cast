$(document).ready(function() {
	var date = moment().format('LLL');

	console.log(date);

	function storeCities() {
		$('.past-cities').empty()
		
		var recentCities = JSON.parse(localStorage.getItem('cities')) || []
		for (var i = 0; i < recentCities.length; i++) {
			while (recentCities.length > 5) {
				var lastFive = recentCities.length - 5;
				var index = 0;
				recentCities.splice(index, lastFive);
				index++
			}

			var newCity = $('<li>')
			newCity.addClass("list-group-item");
			newCity.text(recentCities[i].name)
			$('.past-cities').append(newCity);
		}
	}
	storeCities();

	$(".button").on("click", function(event) {
		event.preventDefault();

		var city = $('.form-control').val()
		var cityList = [];

		var recentCities = JSON.parse(localStorage.getItem('cities')) || []
		$('.past-cities').val(recentCities);
		var savedCity = {
			name: city
		};

		recentCities.push(savedCity);
		localStorage.setItem('cities', JSON.stringify(recentCities));

		storeCities();
		search(city);
	})
})