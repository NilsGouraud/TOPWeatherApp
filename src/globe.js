import * as THREE from 'three';
//import gsap from "gsap";
import{OrbitControls} from "three/examples/js/controls/OrbitControls.js";
    /*
    3d earth code */
    const displayEarthInCanvas=()=>{
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
    }
    export{displayEarthInCanvas};