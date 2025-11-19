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