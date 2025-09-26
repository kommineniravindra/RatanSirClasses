// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import gsap from 'gsap';
// import { FaHtml5, FaCss3Alt, FaJs, FaJava, FaPython, FaDatabase, FaNetworkWired } from 'react-icons/fa';
// import { SiMicrodotblog } from 'react-icons/si'; // for microservices
// import { MdApi } from 'react-icons/md';

// const Globe = () => {
//   const mountRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     let scene, camera, renderer, globe, cardGroup, stars;

//     const font = new FontFace('Roboto', `url(https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2)`);
//     font.load().then(() => init()).catch(() => init());

//     const init = () => {
//       // Scene & Camera
//       scene = new THREE.Scene();
//       scene.background = new THREE.Color(0x010026); // Deep blue
//       camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//       camera.position.z = 9;

//       renderer = new THREE.WebGLRenderer({ antialias: true });
//       renderer.setSize(window.innerWidth, window.innerHeight);
//       renderer.setPixelRatio(window.devicePixelRatio);
//       mountRef.current.appendChild(renderer.domElement);

//       // Stars
//       const starGeometry = new THREE.BufferGeometry();
//       const starCount = 1500;
//       const positions = [];
//       for (let i = 0; i < starCount; i++) {
//         positions.push((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300);
//       }
//       starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
//       const starMaterial = new THREE.PointsMaterial({ color: 0xcccccc, size: 0.25, transparent: true, opacity: 0.8 });
//       stars = new THREE.Points(starGeometry, starMaterial);
//       scene.add(stars);

//       // Technologies with React Icons
//       const technologies = [
//         { name: "HTML5", icon: FaHtml5, color: "#FF6F61", type: "Frontend", description: "Structure for web content.", useCase: "Building web page layouts." },
//         { name: "CSS3", icon: FaCss3Alt, color: "#6FA3EF", type: "Frontend", description: "Styling and visual design.", useCase: "Creating responsive and modern UIs." },
//         { name: "JavaScript", icon: FaJs, color: "#FFD93B", type: "Frontend", description: "Client-side interactivity.", useCase: "Dynamic user experiences." },
//         { name: "Java", icon: FaJava, color: "#FFB347", type: "Backend", description: "Robust backend.", useCase: "Enterprise applications." },
//         { name: "REST API", icon: MdApi, color: "#4DB6AC", type: "Architecture", description: "Web service architecture.", useCase: "System communication." },
//         { name: "Microservices", icon: SiMicrodotblog, color: "#A569BD", type: "Architecture", description: "Independent services.", useCase: "Scaling applications." },
//         { name: "Python", icon: FaPython, color: "#82CA9C", type: "Backend", description: "Automation & data science.", useCase: "Machine learning." },
//         { name: "SQL & DBs", icon: FaDatabase, color: "#F4A261", type: "Database", description: "Structured data management.", useCase: "Querying relational data." }
//       ];

//       // Globe
//       cardGroup = new THREE.Group();
//       scene.add(cardGroup);

//       const globeGeometry = new THREE.SphereGeometry(3.5, 64, 64);
//       const textureLoader = new THREE.TextureLoader();

//       textureLoader.load(
//         'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
//         (texture) => {
//           const globeMaterial = new THREE.MeshLambertMaterial({ map: texture });
//           globe = new THREE.Mesh(globeGeometry, globeMaterial);
//           scene.add(globe);
//           setIsLoading(false);
//           createCards(technologies);
//         },
//         undefined,
//         () => {
//           const fallbackMaterial = new THREE.MeshLambertMaterial({ color: 0x1e3a5f });
//           globe = new THREE.Mesh(globeGeometry, fallbackMaterial);
//           scene.add(globe);
//           setIsLoading(false);
//           createCards(technologies);
//         }
//       );

//       // Lights
//       const ambientLight = new THREE.AmbientLight(0x777777, 1);
//       scene.add(ambientLight);
//       const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
//       directionalLight.position.set(5, 5, 5).normalize();
//       scene.add(directionalLight);

//       // Draw Card Content with Icon
//       const drawCardContent = (ctx, tech, scale) => {
//         const { width, height } = ctx.canvas;
//         const padding = 40 * scale;
//         const lineHeight = 50 * scale;
//         const iconSize = 60 * scale;

//         // Gradient background
//         const gradient = ctx.createLinearGradient(0, 0, width, height);
//         gradient.addColorStop(0, tech.color + "33");
//         gradient.addColorStop(1, tech.color + "11");
//         ctx.fillStyle = gradient;
//         ctx.fillRect(0, 0, width, height);

//         // Border
//         ctx.strokeStyle = tech.color + "77";
//         ctx.lineWidth = 4 * scale;
//         ctx.shadowColor = tech.color + "55";
//         ctx.shadowBlur = 15 * scale;
//         ctx.strokeRect(0, 0, width, height);

//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'top';
//         ctx.fillStyle = "#fff";

//         // Icon rendered as text
//         ctx.font = `bold ${iconSize}px Roboto, sans-serif`;
//         ctx.fillText("★", width / 2, padding / 2); // placeholder star

//         const textStartY = padding / 2 + iconSize + 10;

//         // Name
//         ctx.font = `bold ${36 * scale}px Roboto, sans-serif`;
//         ctx.fillText(tech.name, width / 2, textStartY);

//         // Type, Description, Use Case
//         ctx.textAlign = 'left';
//         ctx.font = `${28 * scale}px Roboto, sans-serif`;
//         ctx.fillText(`Type: ${tech.type}`, padding, textStartY + lineHeight * 1);
//         ctx.font = `italic ${22 * scale}px Roboto, sans-serif`;
//         ctx.fillText(tech.description, padding, textStartY + lineHeight * 2);
//         ctx.font = `${18 * scale}px Roboto, sans-serif`;
//         ctx.fillText(`Use Case: ${tech.useCase}`, padding, textStartY + lineHeight * 3);
//       };

//       // Create Cards
//       const createCards = (techData) => {
//         const cardCount = techData.length;
//         const radius = 4.5;

//         techData.forEach((tech, i) => {
//           const canvas = document.createElement('canvas');
//           const scale = 5;
//           canvas.width = 400 * scale;
//           canvas.height = 300 * scale;
//           const ctx = canvas.getContext('2d');
//           drawCardContent(ctx, tech, scale);

//           const texture = new THREE.CanvasTexture(canvas);
//           texture.minFilter = THREE.LinearFilter;

//           const cardMaterial = new THREE.MeshBasicMaterial({
//             map: texture,
//             transparent: true,
//             opacity: 0,
//             side: THREE.DoubleSide,
//             depthWrite: false
//           });

//           const angle = (i / cardCount) * Math.PI * 2;
//           const x = radius * Math.cos(angle);
//           const z = radius * Math.sin(angle);

//           const cardGeometry = new THREE.PlaneGeometry(3.2, 2.4);
//           const card = new THREE.Mesh(cardGeometry, cardMaterial);
//           card.position.set(x, 0, z);
//           card.lookAt(camera.position);

//           gsap.to(card.material, { duration: 1, opacity: 1, delay: i * 0.3 });

//           cardGroup.add(card);
//         });
//       };

//       // Animate
//       const animate = () => {
//         requestAnimationFrame(animate);
//         if (globe) {
//           globe.rotation.y += 0.0015;
//           cardGroup.rotation.y += 0.0015;
//           if (stars) {
//             stars.rotation.y += 0.0005;
//             stars.rotation.x += 0.0002;
//           }
//           cardGroup.children.forEach(card => card.lookAt(camera.position));
//         }
//         renderer.render(scene, camera);
//       };

//       animate();

//       const onWindowResize = () => {
//         camera.aspect = window.innerWidth / window.innerHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(window.innerWidth, window.innerHeight);
//       };
//       window.addEventListener('resize', onWindowResize);

//       return () => {
//         window.removeEventListener('resize', onWindowResize);
//         if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
//       };
//     };
//   }, []);

//   return <div ref={mountRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />;
// };

// export default Globe;




// import React, { useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { EffectCoverflow, Autoplay, Pagination, Navigation } from "swiper/modules";
// import { FaPython, FaDatabase, FaReact, FaCloud, FaProjectDiagram ,FaServer,FaJava} from "react-icons/fa";

// import "swiper/css";
// import "swiper/css/effect-coverflow";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "../css/globe.css";

// const Globe = () => {
//   const [selectedCourse, setSelectedCourse] = useState(null);

//   const courses = [
   
//     { 
//       icon: <FaPython size={50} color="orange" />, 
//       title: "Python", 
//       text: "Unlock Python for backend and web development.", 
//       details: "Python is versatile: Web Dev, Data Science, AI, Scripting. Popular frameworks: Django, Flask." 
//     },
     
//     { 
//       icon: <FaDatabase size={50} color="orange" />, 
//       title: "SQL & Databases", 
//       text: "Master SQL for backend and analytics.", 
//       details: "Learn MySQL, PostgreSQL, MongoDB. Master queries, indexing, transactions, and optimizations." 
//     },
//     { 
//       icon: <FaReact size={50} color="orange" />, 
//       title: "React.js Frontend", 
//       text: "Build modern, interactive UIs with React.", 
//       details: "React with hooks, state management, and routing. Learn how to build fast and scalable SPAs." 
//     },
//     { 
//       icon: <FaCloud size={50} color="orange" />, 
//       title: "Cloud & DevOps", 
//       text: "AWS + Docker + Kubernetes.", 
//       details: "Deploy apps on AWS, use CI/CD pipelines, containerization, orchestration, and serverless." 
//     },
//     { 
//       icon: <FaProjectDiagram size={50} color="orange" />, 
//       title: "Microservices", 
//       text: "Design and build distributed systems.", 
//       details: "Learn microservices architecture, APIs, message queues, scaling strategies, and fault tolerance." 
//     },
//      {
//     icon: <FaJava size={50} color="orange" />,
//     title: "Java & Spring Framework",
//     text: "Develop robust backend applications.",
//     details: "Master Java and the Spring Framework to create secure and scalable applications using both MVC and RESTful API patterns."
//   },
//   {
//     icon: <FaServer size={50} color="orange" />,
//     title: "RESTful Microservices",
//     text: "Design and build distributed systems.",
//     details: "Learn to architect, develop, and deploy scalable, distributed services using Java, Spring Boot, and REST principles."
//   },
//   ];

//   return (
//     <div className="globe-container">
//       {/* <h2 className="globe-title">Courses</h2> */}

//       <Swiper
//         effect="coverflow"
//         grabCursor={true}
//         centeredSlides={true}
//         slidesPerView={3}
//         loop={true}
//         autoplay={{ delay: 1000, disableOnInteraction: false }}
//         pagination={{ clickable: true }}
//         navigation={true}
//         coverflowEffect={{
//           rotate: 30,
//           stretch: 0,
//           depth: 150,
//           modifier: 2,
//           slideShadows: true,
//         }}
//         modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
//         className="globe-swiper"
//       >
//         {courses.map((course, idx) => (
//           <SwiperSlide key={idx} className="globe-slide">
//             <div className="card">
//               {course.icon}
//               <h3>{course.title}</h3>
//               <p>{course.text}</p>
//               <button 
//                 className="explore-btn" 
//                 onClick={() => setSelectedCourse(course)}
//               >
//                 Explore Me
//               </button>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       {/* Related Data Section */}
//       {selectedCourse && (
//         <div className="course-details">
//           <h3>{selectedCourse.title} – Details</h3>
//           <p>{selectedCourse.details}</p>
//           <button 
//             className="close-btn" 
//             onClick={() => setSelectedCourse(null)}
//           >
//             Close
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Globe;



import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination, Navigation } from "swiper/modules";
import { FaPython, FaDatabase, FaReact, FaCloud, FaProjectDiagram, FaServer, FaJava } from "react-icons/fa";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../css/globe.css";

const Globe = () => {
    const [selectedCourse, setSelectedCourse] = useState(null);

    const courses = [
        {
            icon: <FaPython size={50} color="orange" />,
            title: "Python",
            text: "Unlock Python for backend and web development.",
            details: "Python is versatile: Web Dev, Data Science, AI, Scripting. Popular frameworks: Django, Flask."
        },
        {
            icon: <FaDatabase size={50} color="orange" />,
            title: "SQL & Databases",
            text: "Master SQL for backend and analytics.",
            details: "Learn MySQL, PostgreSQL, MongoDB. Master queries, indexing, transactions, and optimizations."
        },
        {
            icon: <FaReact size={50} color="orange" />,
            title: "React.js Frontend",
            text: "Build modern, interactive UIs with React.",
            details: "React with hooks, state management, and routing. Learn how to build fast and scalable SPAs."
        },
        {
            icon: <FaCloud size={50} color="orange" />,
            title: "Cloud & DevOps",
            text: "AWS + Docker + Kubernetes.",
            details: "Deploy apps on AWS, use CI/CD pipelines, containerization, orchestration, and serverless."
        },
        {
            icon: <FaProjectDiagram size={50} color="orange" />,
            title: "Microservices",
            text: "Design and build distributed systems.",
            details: "Learn microservices architecture, APIs, message queues, scaling strategies, and fault tolerance."
        },
        {
            icon: <FaJava size={50} color="orange" />,
            title: "Java & Spring Framework",
            text: "Develop robust backend applications.",
            details: "Master Java and the Spring Framework to create secure and scalable applications using both MVC and RESTful API patterns."
        },
        {
            icon: <FaServer size={50} color="orange" />,
            title: "RESTful Microservices",
            text: "Design and build distributed systems.",
            details: "Learn to architect, develop, and deploy scalable, distributed services using Java, Spring Boot, and REST principles."
        },
    ];

    return (
        <div className="globe-container">
            <Swiper
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                autoplay={{ delay: 1500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
                coverflowEffect={{
                    rotate: 30,
                    stretch: 0,
                    depth: 150,
                    modifier: 2,
                    slideShadows: true,
                }}
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
                className="globe-swiper"
                breakpoints={{
                    1200: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    0: {
                        slidesPerView: 1,
                    },
                }}
            >
                {courses.map((course, idx) => (
                    <SwiperSlide key={idx} className="globe-slide">
                        <div className="card">
                            {course.icon}
                            <h3>{course.title}</h3>
                            <p>{course.text}</p>
                            <button
                                className="explore-btn"
                                onClick={() => setSelectedCourse(course)}
                            >
                                Explore Me
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {selectedCourse && (
                <div className="modal-backdrop" onClick={() => setSelectedCourse(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="course-details">
                            <h3>{selectedCourse.title} – Details</h3>
                            <p>{selectedCourse.details}</p>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedCourse(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Globe;