const form = document.querySelector("section.top-banner form");
const input = document.querySelector(".container input");
const msg = document.querySelector("span.msg");
const list = document.querySelector(".ajax-section ul.cities");

localStorage.setItem("tokenkey", "Is65SJ3OhLPCedkPUM8D2gb++tybkpAxlA471B3G4yQtstsU0MQpTwFvBJPLPit8");

form.addEventListener("submit", (event) => {
event.preventDefault(); // sayfa yenilemesinin önüne geç
getWeatherDataFromApi();

});
const getWeatherDataFromApi = async() => {
    const tokenKey = DecryptStringAES(localStorage.getItem("tokenkey"));
    const inputValue = input.value;
    const units = "metric";
    const lang = "tr";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${tokenKey}&units=${units}&lang=${lang}`;
   
    let response ;
try {
    response = await axios(url);
    console.log(response);
    
    const {main, sys, weather, name} = response.data;
    
    const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
    
    const cityNameSpan = document.querySelectorAll(".city span")
    const cityNameSpanArray = Array.from(cityNameSpan);
    if(cityNameSpanArray.length > 0){
        const filteredArray = cityNameSpanArray.filter((span)=> span.innerText == name);
        if(filteredArray.length > 0){
            msg.innerText = `you already know the weather for ${name}, please search for another city!`;
            setTimeout(()=>{
                msg.innerText = "";
            },5000);
            form.reset();
            return; // aynı şehri tekrar li'ye yazdırmamak için kesti. 
        }
    
    }
    
    const createdLi = document.createElement("li");
    createdLi.classList.add("city");
    createdLi.innerHTML = `<h2 class="city-name" data-name="${name}, ${sys.country}">
                                <span>${name}</span>
                                <sup>${sys.country}</sup>
                        </h2>
                        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
                        <figure>
                            <img class="city-icon" src="${iconUrl}">
                            <figcaption>${weather[0].description}</figcaption>
                        </figure>`;
    list.prepend(createdLi); // listeleri eklerken başına ekliyor.
    form.reset();
            //capturing
    createdLi.addEventListener("click", (e)=>{
        createdLi.remove();
        
        // if(e.target.className == "IMG"){
        //     e.target.src = (e.target.src == iconUrl) ? iconUrlAWS : iconUrl;
        // }


    });


} catch( error){
    console.log(error);
    msg.innerText = response.message;


}


};