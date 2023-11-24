console.log("hello there");
    
    const searchBar=document.getElementById("searchBar");
    const button=document.getElementById("button");
    //let searchValue=searchBar.value.replace(/\s/g, "_");
    
    const loadableComponents=document.querySelectorAll(".loadable");
    
    /*current weather main elements*/
    const town=document.getElementById("town");
    const country=document.getElementById("country");
    const time=document.getElementById("time")
    const temperature=document.getElementById("temperature");
    const condition=document.getElementById("condition");
    const imgCondition=document.getElementById("imgCondition");
    
    /*current weather details*/
    const feeling=document.getElementById("feeling")
    const humidity=document.getElementById("humidity")
    const chanceOfRain=document.getElementById("chanceOfRain")
    const windSpeed=document.getElementById("windSpeed")
    
    
    /*forecast weather elements*/
    const forecastDayName=[
    document.getElementById("forecastOneDayName"),
    document.getElementById("forecastTwoDayName"),
    document.getElementById("forecastThreeDayName")
    ]

    const tempForecast=[
    document.getElementById("tempOne"),
    document.getElementById("tempTwo"),
    document.getElementById("tempThree")
    ]
    
    const conditionForecast=[
    document.getElementById("conditionOne"),
    document.getElementById("conditionTwo"),
    document.getElementById("conditionThree")
    ];

    const iconForecast=[
    document.getElementById("iconOne"),
    document.getElementById("iconTwo"),
    document.getElementById("iconThree")
    ]

    const baseUrl="https://api.weatherapi.com/v1"
    const weatherAPIKey="e1819c640df04c5b95f131642232011";
    const keyParameter="?key="+weatherAPIKey;
    
    const dayName=["Sunday","Monsday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    //TODO add a french translation     const dayNameFR=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"]
    
    const monthName=["January","February","March","April","May","June","July","August","September","October","November","December"]
    
    async function getCurrentWeather(location){
        try {
            loadableComponents.forEach(component=>component.classList.add("loading"));
            
            let request=await fetch(baseUrl+"/forecast.json"+keyParameter+"&days=4"+"&q="+location,{mode:"cors"});
            
            let response=await request.json();
            
            let localtime=response.location.localtime;
            let date=new Date(localtime);
            
            let stringTime=localtime.split("-");
            let stringDayAndHour=stringTime[2].split(" ");
            let year=stringTime[0];
            let day=stringDayAndHour[0];
            let hour=stringDayAndHour[1];
                        
            town.textContent=response.location.name;
            country.textContent=response.location.country;
            time.textContent=dayName[date.getDay()]+" "+day+" "+monthName[date.getMonth()]+" " +year+",\n"+hour;
            temperature.textContent=response.current.temp_c+"°C";
            condition.textContent=response.current.condition.text;
            imgCondition.src=response.current.condition.icon.replace("//","https://");
            
            feeling.textContent=response.current.feelslike_c+"°C";
            humidity.textContent=response.current.humidity+"%";
            chanceOfRain.textContent=response.forecast.forecastday[0].day.daily_chance_of_rain+"%"
            windSpeed.textContent=response.current.wind_kph+"km/h";
 
            /*forecast*/
            const allDays=[
            new Date(response.forecast.forecastday[1].date),
            new Date(response.forecast.forecastday[2].date),
            new Date(response.forecast.forecastday[3].date)
            ]
            for(let i=1;i<4;i++){
                tempForecast[i-1].textContent=response.forecast.forecastday[i].day.avgtemp_c+"°C";
                forecastDayName[i-1].textContent=dayName[allDays[i-1].getDay()];
                conditionForecast[i-1].textContent=response.forecast.forecastday[i].day.condition.text;
                iconForecast[i-1].src=response.forecast.forecastday[i].day.condition.icon.replace("//","https://");
            }
            /*end of forecast*/
            
            
            loadableComponents.forEach(element=> element.classList.remove("loading"));
            return response;
        } catch (error) {
            console.log(error)
        }
    }
    button.onclick=()=>{
        console.log(searchBar.value.replace(/\s/g, "_"));
        console.log(getCurrentWeather(searchBar.value.replace(/\s/g, "_")));
    }
    searchBar.addEventListener("keyup", event => {
        if(event.key !== "Enter") return;
        button.click();
        event.preventDefault();
    });
console.log(getCurrentWeather("Cholet"));