// src/technologies/microservices/microservicesData.js

export const microservicesData = [
  {
    name: "Introduction",
    content: `Microservices is an architectural style that structures an application 
into a collection of small, loosely coupled, and independently deployable services.`
  },
  {
    name: "Advantages",
    content: `- Scalability: Each service can scale independently.
- Flexibility: Technology stack can vary by service.
- Faster Development: Teams work in parallel.
- Fault Isolation: Failures are contained within a service.`
  },
  {
    name: "Challenges",
    content: `- Complexity in communication and monitoring.
- Distributed data management issues.
- Requires robust DevOps practices.`
  },
  {
    name: "Tools & Frameworks",
    content: `- Spring Boot & Spring Cloud (Java)
- Docker & Kubernetes
- API Gateway (Zuul, Kong, NGINX)
- Service Mesh (Istio, Linkerd)`
  }
];
