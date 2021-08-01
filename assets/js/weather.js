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

	$('.past-cities').on("click", "li", function(event) {
		event.preventDefault();
		var city = $(this).text();
		search(city);
	})

	function search(city) {

		$(".days").show()
		var queryURL1 = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=7eacf5331e789eb97f9990d729cb2139'
		
		$.when(
			$.ajax({
				url: queryURL1,
				method: "GET"

			}))
			.then(function(response) {
				var latitude = response.coord.lat;
				var longititude = response.coord.lon;
				var queryURL2 = 'https://api.openweathermap.org/data/2.5/uvi?&appid=7eacf5331e789eb97f9990d729cb2139&lat=' + latitude + '&lon=' + longititude;
				
				$.ajax({
					url:queryURL2,
					method: "GET"
				})
					.then(function(response2) {
						$('.city-name').empty();

						var cityName = response.name;
						var temp = (response.main.temp - 273.15) * 9 / 5 + 32
						var fahrenheit = $('<p>');
						var humidity = $('<p>');
						var windSpeed = response.wind.speed * 2.236936;
						var imperialWindSpeed = $('<p>');
						var indexEl = $('<span>');
						indexEl.text("UV Index: ");
						var indexNumber = parseFloat(response2.value);
						var indexNumberEl = $('<span>');
						indexNumberEl.text(indexNumber);
						indexNumberEl.attr('id', 'index-number');

						if (indexNumber <= 2) {
							indexNumberEl.addClass('d-inline p-2 bg-success text-white')
						} else if (indexNumber >= 3 && indexNumber <= 7) {
							indexNumberEl.addClass('d-inline p-2 bg-warning text-white')
						} else {
							indexNumberEl.addClass('d-inline p-2 bg-danger text-white')
						}

						var todaysWeather = response.weather[0].icon;
						fahrenheit.text("Temperature: " + temp.toFixed(1) + "°F")
						humidity.text("Humidity: " + response.main.humidity + "%")
						imperialWindSpeed.text("Wind Speed: " + windSpeed.toFixed(1) + " MPH")

						var weatherIcon = 'https://openweathermap.org/img/wn/' + todaysWeather + ".png";
						var iconDisplay = $('<img>')
						iconDisplay.attr('src', weatherIcon);
						$('.city-name').append(cityName + ": " + date);
						$('.city-name').append(iconDisplay);
						$('.city-name').append(fahrenheit);
						$('.city-name').append(humidity);
						$('.city-name').append(imperialWindSpeed);
						$('.city-name').append(indexEl);
						$('.city-name').append(indexNumberEl);
					})

			// var queryURL3 = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city +

			})
	}

})