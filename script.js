// Stars
const starsContainer = document.querySelector('.stars');
for(let i=0;i<200;i++){
  const s=document.createElement('div');
  s.className='star';
  s.style.left=Math.random()*100+'%';
  s.style.top=Math.random()*100+'%';
  s.style.animationDelay=Math.random()*3+'s';
  starsContainer.appendChild(s);
}

// THREE.js scene
const canvas=document.getElementById('bg');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.z=5;

// Wireframe ring
const wireMaterial=new THREE.MeshBasicMaterial({color:0xec4899,wireframe:true,opacity:0.6,transparent:true});
const wireSphere=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5,1),wireMaterial);
scene.add(wireSphere);

// Particles
const pGeo=new THREE.BufferGeometry();
const count=1000;
const pos=new Float32Array(count*3);
for(let i=0;i<count*3;i++) pos[i]=(Math.random()-0.5)*20;
pGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
const pMat=new THREE.PointsMaterial({size:0.02,color:0x06b6d4,opacity:0.8,transparent:true});
const particles=new THREE.Points(pGeo,pMat);
scene.add(particles);

// Lights
const light1=new THREE.PointLight(0xa78bfa,2); light1.position.set(5,5,5);
const light2=new THREE.PointLight(0xec4899,2); light2.position.set(-5,-5,5);
scene.add(light1,light2,new THREE.AmbientLight(0x404040,0.5));

// Mouse interaction
let mouseX=0,mouseY=0;
document.addEventListener('mousemove',(e)=>{mouseX=(e.clientX/window.innerWidth)*2-1; mouseY=-(e.clientY/window.innerHeight)*2+1;});

function animate(){
  requestAnimationFrame(animate);
  wireSphere.rotation.y+=0.003; wireSphere.rotation.x+=0.001;
  particles.rotation.y+=0.0005;
  wireSphere.rotation.x+=(mouseY*0.5-wireSphere.rotation.x)*0.05;
  wireSphere.rotation.y+=(mouseX*0.5-wireSphere.rotation.y)*0.05;
  renderer.render(scene,camera);
}
animate();

window.addEventListener('resize',()=>{
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);
gsap.from(".navbar",{y:-100,opacity:0,duration:1.2,ease:"power4.out"});
gsap.from(".hero-content h1",{opacity:0,y:100,duration:1.5,delay:0.5});
gsap.from(".hero-content p",{opacity:0,y:50,duration:1.2,delay:0.8});
gsap.from(".hero-content .cta",{opacity:0,scale:0.8,duration:1,delay:1.1,ease:"back.out(1.7)"});
gsap.utils.toArray("section").forEach(sec=>{
  gsap.from(sec.children,{scrollTrigger:{trigger:sec,start:"top 80%"},opacity:0,y:80,duration:1.2,stagger:0.2});
});

// Contact form
const form=document.getElementById("contactForm");
const status=document.getElementById("formStatus");
form.addEventListener("submit",async e=>{
  e.preventDefault();
  status.textContent="Transmitting...";
  status.className="";
  const formData={name:form.name.value.trim(),email:form.email.value.trim(),message:form.message.value.trim()};
  if(!formData.name||!formData.email||!formData.message){status.textContent="Please fill in all fields.";status.className="error"; return;}
  try{
    await new Promise(res=>setTimeout(res,1500));
    status.textContent="Message transmitted successfully! 🌌";
    status.className="success";
    form.reset();
    gsap.to(status,{opacity:1,duration:0.5});
    setTimeout(()=>gsap.to(status,{opacity:0,duration:0.5}),4000);
  }catch{
    status.textContent="Transmission failed. Try again later.";
    status.className="error";
  }
});
