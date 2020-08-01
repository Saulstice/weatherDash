console.log("hello");
//Add autocomplete functionality to our search input text field
var input = document.getElementById('pac-input');
autocomplete = new google.maps.places.Autocomplete(input);




// getInfo(localStorage.getItem("Last"));

$(".searchBtn").on("click", function (event) {
    event.preventDefault();
    $("#cityName").empty();
    $("#dayCards").empty();
  
    var searched = $("#pac-input").val();
    
    localStorage.setItem("Last", searched);
    
    

    var newHistory = $('<h5 class="his"></h5>');
    newHistory.text(searched);
    $("#searchHistory").prepend(newHistory);
    $("#searchHistory").prepend('<hr>');
    $("#cityName").append(searched);

    if (searched == "") {
        alert("Enter location");
    } else {
        getInfo(searched);

    }
    
    $(".his").on("click", function () {
        event.preventDefault();
        var here = $(this).text();
        getInfo(here);
    });

});



function getInfo (place){
    $("#cityName").empty();
    $("#cityName").append(place);
    $("#dayCards").empty();
        // take addresss and replace spaces with plus sign since this is the format google api requires
        var address = place.split(' ').join('+');
        var googleURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyCyJX-Kt-KlymneRkWUnMjVk1KrA3bwCD0";

        // Google maps ajax request
        $.ajax({
            url: googleURL,
            method: "GET"
        }).then(function (Response) {
            //set var coordinates equal to coordinates object provided by google api
            var coordinates = Response.results[0].geometry.location;

            // log Latitude and Longitude of selected location
            console.log("Lat: " + coordinates.lat);
            console.log("Long: " + coordinates.lng);

            // Running Trails api request
            //Set lat and long equal to latitude and longitude from google's coordinates object
            var lat = coordinates.lat;
            var long = coordinates.lng;
            // Using OpenWeather api
            var weatherAPI = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=b8a12898806019a6178b169c5ea6f245";

            $.ajax({
                url: weatherAPI,
                method: "GET"
            }).then(function (response) {
                

                var currentDate = moment.unix(response.dt).format("l");
                console.log(currentDate);
                $("#cityName").append(" (" + currentDate + ")<br><hr>");

                var name = response.name;

                var temp = Math.round((response.main.temp - 273.15) * 9 / 5 + 32);
                
                $("#temp0").html("Temperature: " + "<button class='0 btn'>" +temp)
                btnColor(temp, $(".0"));

                var feelsLike = Math.round((response.main.feels_like - 273.15) * 9 / 5 + 32);
                $("#feels").html("Feels like: " + "<button class='1 btn'>" +feelsLike);
                btnColor(feelsLike, $(".1"));

                var tempMax = Math.round((response.main.temp_max - 273.15) * 9 / 5 + 32);
                $("#max").html("Max: " + "<button class='2 btn'>" +tempMax);
                btnColor(tempMax, $(".2"));

                var tempMin = Math.round((response.main.temp_min - 273.15) * 9 / 5 + 32);
                $("#min").html("Min: " + "<button class='3 btn'>" + tempMin);
                btnColor(tempMin, $(".3"));

                var humidity = response.main.humidity;
                $("#humid0").html("Humidity: " + humidity + "%");

                var wind = response.wind.speed;
                $("#wind0").html("Wind: " + wind + " mph");
              
              console.log($(".0"));
                
            });

            var forecastAPI = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&appid=b8a12898806019a6178b169c5ea6f245";
            $.ajax({
                url: forecastAPI,
                method: "GET"
            }).then(function (response) {
                $("#dayCards").empty();
                console.log(response);
                console.log(response.list[2]);
                var dayOne =response.list[2]

                console.log(response.list[10]);
                var dayTwo = response.list[10];

                console.log(response.list[18]);
                var dayThree = response.list[18];

                console.log(response.list[26]);
                var dayFour = response.list[26]

                console.log(response.list[34]);
                var dayFive = response.list[34];
                var days = [dayOne, dayTwo, dayThree, dayFour, dayFive];
                $("#dayCards").empty();
                $.each(days, function (index, value) {
                    var currentDate = moment.unix(days[index].dt).format("l");
                    var temp = Math.round((days[index].main.temp - 273.15) * 9 / 5 + 32);
                    var cardDiv = $('<div class="card text-white bg-primary mb-3" style="max-width: 18rem;">');
                    var cardDate = $('<div class="card-header">');
                    cardDate.text(currentDate);
                    var cardBody = $('<div class="card-body">');
                    var cardIcon = $('<img>');
                    cardIcon.attr("src", "http://openweathermap.org/img/wn/" + days[index].weather[0].icon + "@2x.png");
                    var cardTemp = $('<h5 class="card-title">');
                    cardTemp.text("Temperature: " + temp);
                    var cardHumid = $('<h5 class="card-title">');
                    cardHumid.text("Humidity: " +days[index].main.humidity);

                    cardDiv.append(cardDate);
                    cardDiv.append(cardBody);
                    cardBody.append(cardIcon);
                    cardBody.append(cardTemp);
                    cardBody.append(cardHumid);

                    $("#dayCards").append(cardDiv);
                    
                });
            });
        });

}

function btnColor(num, select){
    if (num>=80){
        var btnColor = "btn-danger";
    } else if (60<num<80){
        btnColor = "btn-warning";
    }else if (num<60){
        btnColor = "btn-primary";
    }
    select.addClass(btnColor);
}