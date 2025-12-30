// src/technologies/microservices/microservicesData.js

import React from "react";

export const microservicesData = {
  Introduction: (
    <div>
      <p>
        Microservices is an architectural style that structures an application
        into a collection of small, loosely coupled, and independently
        deployable services.
      </p>
    </div>
  ),
  Advantages: (
    <div>
      <ul>
        <li>Scalability: Each service can scale independently.</li>
        <li>Flexibility: Technology stack can vary by service.</li>
        <li>Faster Development: Teams work in parallel.</li>
        <li>Fault Isolation: Failures are contained within a service.</li>
      </ul>
    </div>
  ),
  Challenges: (
    <div>
      <ul>
        <li>Complexity in communication and monitoring.</li>
        <li>Distributed data management issues.</li>
        <li>Requires robust DevOps practices.</li>
      </ul>
    </div>
  ),
  "Tools & Frameworks": (
    <div>
      <ul>
        <li>Spring Boot & Spring Cloud (Java)</li>
        <li>Docker & Kubernetes</li>
        <li>API Gateway (Zuul, Kong, NGINX)</li>
        <li>Service Mesh (Istio, Linkerd)</li>
      </ul>
    </div>
  ),
};
