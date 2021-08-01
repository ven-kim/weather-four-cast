var CURRENT_DATE = moment().format('LLL');

function validateCityName(city) {
	if (city === "") {
		alert("City can not be empty!");
		return false;
	}

	return true;
}

function checkDuplicateCity(city) {
	var recentCities = JSON.parse(localStorage.getItem('cities')) || []
	for (var i = 0; i < recentCities.length; i++) {
		if (recentCities[i].name === city) return false;
	}

	return true;
}

function storeCities(city) {
	var recentCities = JSON.parse(localStorage.getItem('cities')) || []
	var savedCity = {
		name: city
	};

	if (!checkDuplicateCity(city)) {
		return;
	}

	if (recentCities.length === 5) {
		recentCities.shift();
	}
	
	recentCities.push(savedCity);
	localStorage.setItem('cities', JSON.stringify(recentCities));
}

function showRecentCities() {
	$('.past-cities').empty();

	var recentCities = JSON.parse(localStorage.getItem('cities')) || []

	for (var i = 0; i < recentCities.length; i++) {
		var newCity = $('<li>');
		newCity.addClass("list-group-item");
		newCity.text(recentCities[i].name);
		$('.past-cities').append(newCity);
	}
}

function currentForecast(city) {
	var queryURL1 = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=7eacf5331e789eb97f9990d729cb2139';
	
	$.when(
		$.ajax({
			url: queryURL1,
			method: "GET"

		})
	)
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
			// added formula for converting kelvin into fahrenheit
			var temp = (response.main.temp - 273.15) * 9 / 5 + 32
			var fahrenheit = $('<p>');
			var humidity = $('<p>');
			// added formula for converting meters per hour into miles per hour
			var windSpeed = response.wind.speed * 2.236936;
			var imperialWindSpeed = $('<p>');
			var indexEl = $('<span>');
			indexEl.text("UV Index: ");
			var indexNumber = parseFloat(response2.value);
			var indexNumberEl = $('<span>');
			indexNumberEl.text(indexNumber);
			indexNumberEl.attr('id', 'index-number');

			// color coding the UVI index based on current values
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
			$('.city-name').append(cityName + ": " + CURRENT_DATE);
			$('.city-name').append(iconDisplay);
			$('.city-name').append(fahrenheit);
			$('.city-name').append(humidity);
			$('.city-name').append(imperialWindSpeed);
			$('.city-name').append(indexEl);
			$('.city-name').append(indexNumberEl);
		})
	});
}

function fiveDayForecast(city) {
	$(".days").show()

	var queryURL3 = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=7eacf5331e789eb97f9990d729cb2139';
	
	$.ajax({
		url: queryURL3,
		method: "GET"
	})
	.then(function(response3) {
		$("#1").empty();
		$("#2").empty();
		$("#3").empty();
		$("#4").empty();
		$("#5").empty();

		var dayOne = $('<h6>');
		var dayTwo = $('<h6>');
		var dayThree = $('<h6>');
		var dayFour = $('<h6>');
		var dayFive = $('<h6>');

		dayOne.text(moment(CURRENT_DATE).add(1, 'days').format("MMM Do YY"));
		dayTwo.text(moment(CURRENT_DATE).add(2, 'days').format("MMM Do YY"));
		dayThree.text(moment(CURRENT_DATE).add(3, 'days').format("MMM Do YY"));
		dayFour.text(moment(CURRENT_DATE).add(4, 'days').format("MMM Do YY"));
		dayFive.text(moment(CURRENT_DATE).add(5, 'days').format("MMM Do YY"));

		$('#1').append(dayOne);
		$('#2').append(dayTwo);
		$('#3').append(dayThree);
		$('#4').append(dayFour);
		$('#5').append(dayFive);
		
		var v = 1
		for (var i = 0; i < response3.list.length; i++) {

			if (response3.list[i].dt_txt.indexOf("12:00:00") !== -1 &&
					response3.list[i].dt_txt.indexOf("15:00:00") !== -1 ||
					response3.list[i].dt_txt.indexOf("18:00:00") !== -1) {

				var selector = "#" + v;
				var forecastTemp1 = (response3.list[i].main.temp_max - 273.15) * 9 / 5 + 32;
				var forecastFahrenheit1 = $('<p>');
				var forecastHumidity1 = $('<p>');
				var forecastWindSpeed1 = $('<p>');
				var forecastWeather1 = response3.list[i].weather[0].icon;
				var weatherIcon1 = 'https://openweathermap.org/img/wn/' + forecastWeather1 + '.png';
				var iconDisplay1 = $('<img>');
				iconDisplay1.attr('src', weatherIcon1);
				forecastFahrenheit1.text("Temp: " + Math.trunc(forecastTemp1) + '°F');
				forecastHumidity1.text("Humidity: " + response3.list[i].main.humidity + '%');
				forecastWindSpeed1.text("Wind Speed: " + response3.list[i].wind.speed + " MPH")
				$(selector).append(forecastFahrenheit1);
				$(selector).append(forecastHumidity1);
				$(selector).append(forecastWindSpeed1);
				$(selector).append(iconDisplay1);
				v++;
			}
		}
	});
}

function search(city) {
	currentForecast(city);
	fiveDayForecast(city);
}

$(document).ready(function() {
	showRecentCities();

	console.log(CURRENT_DATE);

	$("#search-btn").on("click", function() {
		var city = $('#city-search-input').val().toLowerCase();

		if (validateCityName(city)) {
			storeCities(city);
			search(city);
			showRecentCities();
		}
	});

	$('.past-cities').on("click", "li", function() {
		var city = $(this).text();
		$('#city-search-input').val(city);
		search(city);
	});

});