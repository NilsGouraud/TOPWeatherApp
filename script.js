import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
//import gsap from "gsap";
import{OrbitControls} from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls";

    /*
    3d earth code */
    const canvas=document.getElementById("earth");

    const scene =new THREE.Scene();
    let size={width:canvas.width*0.79,height:canvas.width*0.79};
    let earthSize=2;
    let detail=3;
    const camera=new THREE.PerspectiveCamera(earthSize*6,size.width/size.height,0.5,200)
    camera.position.z=earthSize;
    camera.position.x+=5;
    camera.position.y+=5;
    scene.add(camera);
    
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
    if(size.width>size.height){
        renderer.setSize(size.height,size.height);
    }else{
        renderer.setSize(size.width,size.width);
    }
    renderer.render(scene,camera);
    
    const light=new THREE.DirectionalLight(0xffffff);
    light.position.set(-15,+20,-60);
    scene.add(light);
    
    const earthGroup=new THREE.Group();
    //earthGroup.rotation.z=(-23.4*Math.PI/180)/2; 
    scene.add(earthGroup)
    
    const controlEarth =new OrbitControls(camera,canvas);
    //controlEarth.autoRotate=true;
    controlEarth.autoRotateSpeed=2;
    
    const controlLight=new OrbitControls(light,canvas);
    controlLight.autoRotate=true;
    controlLight.autoRotateSpeed=4;
    
    
    let loader=new THREE.TextureLoader();
    
    
    let earth = new THREE.Mesh(new THREE.IcosahedronGeometry(earthSize,detail),new THREE.MeshStandardMaterial({
        map         : loader.load('./images/texture.jpg'),
        bumpMap     : loader.load('./images/bumpMap.jpg'), 
        bumpScale   : 0.05,
        roughness   : 1,
        roughnessMap: loader.load("./images/roughnessMap.jpg")
    }))
    
    earthGroup.add(earth);
    let lightsMesh=new THREE.Mesh(new THREE.IcosahedronGeometry(earthSize,detail),new THREE.MeshStandardMaterial({
        map         : loader.load('./images/earthlights.jpg'),
        color: "white",
        alphaMap : loader.load('./images/earthlights.jpg'),
        emissive : "#ffedb8",
        emissiveIntensity:50,
        transparent:false,
        opacity:0.4,
        blending    : THREE.AdditiveBlending,
    }))
    earthGroup.add(lightsMesh)
    
    let clouds = new THREE.Mesh(new THREE.IcosahedronGeometry(earthSize,detail),new THREE.MeshStandardMaterial({
        map         :  loader.load("./images/clouds.jpg"),
        opacity:0.4,
        blending    : THREE.AdditiveBlending,
    })
    )
    clouds.scale.setScalar(1.02)
    earthGroup.add(clouds)    
let basicSphere=new THREE.Mesh(new THREE.TorusGeometry(10, 2, 2, 6, Math.PI*2),new THREE.MeshStandardMaterial({color:"green",emissive:"red",emissiveIntensity:1}));
basicSphere.scale.setScalar(0.004)
    /*
    
    TorusGeometry(10, 2, 2, 6, Math.PI*2)
    */
    
    
    
    function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
        pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;
        
        if(pointIsWorld){
            obj.parent.localToWorld(obj.position); // compensate for world coordinate
        }
        
        obj.position.sub(point); // remove the offset
        obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
        obj.position.add(point); // re-add the offset
        
        if(pointIsWorld){
            obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
        }
        
        obj.rotateOnAxis(axis, theta); // rotate the OBJECT
    }
    
 
     
    
    
    const basicSphereLight=new THREE.PointLight( "cyan",1,0,0);
    basicSphereLight.position.set(basicSphere.position.x,basicSphere.position.y,basicSphere.position.z);
    basicSphereLight.intensity=0.7;
    basicSphere.add(basicSphereLight);
    

    const setCoordinates=(latitude, longitude)=>{
        basicSphere.position.set(0,earthSize*1.03,0);
        earthGroup.position.set(0,0,0);
        earthGroup.rotation.set(0,0,0);
        earthGroup.rotateOnAxis(new THREE.Vector3(0,0,1),0.8);
        earthGroup.rotateOnAxis(new THREE.Vector3(0,1,0),2.9);
        //earthGroup.rotation.y=(-201.72*Math.PI/180);
        //earthGroup.rotation.z=-43.1*(Math.PI/180);
        let radLat=(-latitude+90)*Math.PI/180;
        let radLong=(longitude)*Math.PI/180;
        rotateAboutPoint(basicSphere, new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,1), radLat, false);
        rotateAboutPoint(basicSphere, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), radLong, false);
        rotateAboutPoint(basicSphereLight, new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,1), radLat, false);
        rotateAboutPoint(basicSphereLight, new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0), radLong, false);
        



        let actualRadLat=(latitude*Math.PI/180)
        // earthGroup.rotation.y+=-radLong;
        //earthGroup.rotation.z+=(latitude*Math.PI/180)

        //earthGroup.rotation.setFromVector3(new THREE.Vector3(0,Math.PI-radLong, (latitude*Math.PI/180)));
        //earthGroup.rotation.setFromVector3(new THREE.Vector3(0,(-201.72*Math.PI/180)-radLong,-43.1*(Math.PI/180)+actualRadLat));
        earthGroup.rotateOnAxis(new THREE.Vector3(0,0,1),(latitude*Math.PI/180));
        earthGroup.rotateOnAxis(new THREE.Vector3(0,1,0),(-radLong));

        


    }
    setCoordinates(40,-73);
    setCoordinates(48.4,-4.48);
    
    let formLat=document.getElementById("latitude");
    let formLong=document.getElementById("longitude");
    let buttonCoordinates=document.getElementById("buttonCoordinates");
    //buttonCoordinates.onclick=()=>setCoordinates(formLat.value,formLong.value);
    
    
    
    earthGroup.add(basicSphere);
    
    
    
    basicSphere.rotation.x+=3.6;
    const loop=()=>{
        controlEarth.update();
        controlLight.update();   
        renderer.render(scene,camera)
        clouds.rotation.y+=0.0005
        window.requestAnimationFrame(loop);
        basicSphere.rotation.z+=0.05
        basicSphere.rotation.y+=0.05
    }
    loop();



    /*
    weather request code
    */


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
        
        let request=await fetch(baseUrl+"/forecast.json"+keyParameter+"&days=3"+"&q="+location,{mode:"cors"});
        
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
        

        console.log(response);
        setCoordinates(response.location.lat,response.location.lon);
        

        /*forecast*/
        const allDays=[
            new Date(response.forecast.forecastday[1].date),
            new Date(response.forecast.forecastday[2].date),
        ]
        for(let i=1;i<3;i++){
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
console.log(getCurrentWeather("Tel-Aviv"));



    

    
    //const timeline=gsap.timeline({defaults:{duration:3}});
    //timeline.fromTo(earthGroup.scale,{z:0,x:0,y:1,},{z:1,x:1,y:1});
    
    
