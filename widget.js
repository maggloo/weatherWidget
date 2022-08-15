function WeatherWidget() {
            let apiurl = "https://api.openweathermap.org/data/2.5/";
            let apikey = "17d7648413d9769c5fd2973be17f87bf";
            const minskLat = 53.9;
            const minskLong = 27.5667;
  
            //делала запрос через onecall (возвращает json с прогнозом на 8 дней + текущую погоду) 
            let apiQuery = `${apiurl}/onecall?lat=${minskLat}&lon=${minskLong}&exclude=minutely,alerts,hourly&units=metric&lang=ru&appid=${apikey}`;
            let isForecastOpened = false;
            let isWidgetOpened = true;
            let container = null;
            let widgetWrapper = null;
            let closeWidget = null;
            let forecastWrapper = null;
            let data = null;
            let getForecast = null;
            let openBtn = null;
            let today = null;
            let tommorow = null;
            let dayAfter = null;
            let targetHeight = 100;

            this.getData = async function() {
                widgetWrapper = document.createElement("div");
                widgetWrapper.classList.add("widget");
                container = document.createElement("div");
                container.id = "wrapper";

                document.body.prepend(widgetWrapper);
                widgetWrapper.append(container);   

                let loader = document.createElement("img");
                loader.src = "https://www.superiorlawncareusa.com/wp-content/uploads/2020/05/loading-gif-png-5.gif";
                loader.id = "spinner";

                container.append(loader);
                loader.style.display = "block";          

                try {
                    const response = await fetch(apiQuery);
                    data = await response.json();
                    this.showInfo(data);
                    loader.style.display = "none";
                  // console.log(data);
                } catch (error) {
                    console.error("error:" + error);
                } 
            }

            this.showInfo = function(data) {     
                closeWidget = document.createElement("div");
                closeWidget.id = "close-button";
                closeWidget.innerHTML = `<svg width="30px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <line class="svg" x1="12" x2="5.5" y1="15.38" y2="8.62"/>
                    <line class="svg" x1="12" x2="18.5" y1="15.38" y2="8.62"/></svg>`;
                
                getForecast = document.createElement("div");
                getForecast.id = "get-forecast";
                getForecast.textContent = "Прогноз на 3 дня";
                forecastWrapper = document.createElement("div");
                forecastWrapper.id = "forecast-wrapper";
                today = document.createElement("div");
                tommorow = document.createElement("div");
                dayAfter = document.createElement("div");
                today.classList.add('today');
                tommorow.classList.add('tommorow');
                dayAfter.classList.add('day-after-tommorow');

                openBtn = document.createElement("div");
                openBtn.id = "open-button";
                openBtn.innerHTML = `<svg width="30px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <line class="svg" x1="12" x2="5.5" y1="15.38" y2="8.62"/>
                <line class="svg" x1="12" x2="18.5" y1="15.38" y2="8.62"/></svg>`;

                const name = document.createElement("div"); 
                name.innerHTML = `Сейчас в Минске ${Math.round(data.current.temp)}&#176;C`;
                const img = document.createElement("div");
                img.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}.png">`
                const weather = document.createElement("div");
                weather.textContent = data.current.weather[0].description;
                const wind =  document.createElement("div");
                wind.textContent = `Ветер: ${Math.round(data.current.wind_speed)} м/с`;

                widgetWrapper.append(forecastWrapper, openBtn); 
                container.append(closeWidget, name, img, weather, wind, getForecast);
                forecastWrapper.append(today, tommorow, dayAfter);

                
                this.getEventListeners();
                                   
            }
            this.getEventListeners = function() {
                  
                closeWidget.addEventListener('click', function() {         
                    if (isWidgetOpened) {  
                    isWidgetOpened = false;
                    isForecastOpened = false;
                    widgetWrapper.classList.toggle("closed-widget");
                    widgetWrapper.classList.toggle("widget");
                    container.style.display = "none";  
                    forecastWrapper.style.display = "none";   
                    openBtn.style.display = 'inline-block';  
                    openBtn.style.opacity = '50%'; 
                    container.style.overflow = 'hidden';
                    }                   
                });
                openBtn.addEventListener('click', function(){
                    if (!isWidgetOpened){
                        openBtn.style.display = 'none';                           
                        isWidgetOpened = true;
                        widgetWrapper.classList.toggle("closed-widget");
                        widgetWrapper.classList.toggle("widget");
                        container.style.display = "flex";
                    }           
                });             
                
                getForecast.addEventListener('click', () => {this.showForecast(data)});    

            }

            this.showForecast = function(data) {
                const daysArray = [today, tommorow, dayAfter];          
                
                if (!isForecastOpened) {
                    isForecastOpened = true;  
                    drawElement(daysArray);

                    function drawElement(daysArray) {
                        for (let i = 0; i < daysArray.length; i++) {
                            let day = (daysArray[i] === today) ? "Сегодня" : (daysArray[i] === tommorow) ? "Завтра" : "Послезавтра";
                            let name = document.createElement("div");
                            name.innerHTML = `${day} максимальная температура воздуха составит ${Math.round(data.daily[i].temp.max)}&#176;C`;
                            let img = document.createElement("div");
                            img.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png">`
                            let weather = document.createElement("div");
                            weather.textContent = data.daily[i].weather[0].description;
                            let wind =  document.createElement("div");
                            wind.textContent = `Ветер: ${Math.round(data.daily[i].wind_speed)} м/с`;                           
                            if (!(daysArray[i].querySelector("div"))) {                                
                                daysArray[i].prepend(name, img, weather, wind);                                                        
                            } 
                            
                            daysArray[i].style.height = '0px';
                            forecastWrapper.style.display = "flex";
                            
                            setTimeout (() => {
                                container.style.overflow = 'visible'; 
                                daysArray[i].style.padding = '20px';
                                daysArray[i].style.height = targetHeight + "px"; 
                                daysArray[i].style.opacity = '100%';                              
                            }, 0); 
                        }
                    }
                }

                else {                    
                    daysArray.forEach(element => {
                            element.style.height = "0px";
                            element.style.padding = "0px";
                            element.style.opacity = '0%';
                    isForecastOpened = false;
                    });       
                }
                
            }
        }

        new WeatherWidget().getData();
