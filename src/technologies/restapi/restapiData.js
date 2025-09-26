// src/technologies/restapi/restApiData.js
export const restApiData = {
  'What is REST API?': (
    <div>
      <p>A REST API (Representational State Transfer API) is an architectural style for building web services that interact over HTTP.</p>
      <pre dangerouslySetInnerHTML={{ __html: `
        REST APIs use HTTP methods to perform operations on resources.
        Key features:
        - Stateless communication
        - Client-server architecture
        - Uniform interface
        - Cacheable responses
        - Layered system
      ` }} />
    </div>
  ),

  'Importance of REST API': `REST APIs are essential because they:
    ✓ Enable communication between different applications
    ✓ Allow integration across multiple platforms (web, mobile, IoT)
    ✓ Support scalability with stateless design
    ✓ Use standard HTTP methods (GET, POST, PUT, DELETE)
    ✓ Are lightweight and easy to implement
  `,

  'REST vs SOAP': (
    <div>
      <p>SOAP and REST are two popular API design styles. REST is simpler and more lightweight compared to SOAP.</p>
      <pre dangerouslySetInnerHTML={{ __html: `
        REST:
        - Uses JSON or XML
        - Lightweight and fast
        - Simple to implement
        - Works over HTTP only

        SOAP:
        - Uses only XML
        - Heavier, more complex
        - Built-in error handling and security
        - Can work over multiple protocols (HTTP, SMTP, etc.)
      ` }} />
    </div>
  ),

  'HTTP Methods': (
    <div>
      <p>REST APIs rely on standard HTTP methods for communication.</p>
      <pre dangerouslySetInnerHTML={{ __html: `
        Common HTTP Methods:
        - GET    → Retrieve data
        - POST   → Create new data
        - PUT    → Update existing data
        - DELETE → Remove data
        - PATCH  → Partially update data
      ` }} />
    </div>
  ),

  'HTTP Status Codes': `REST APIs return status codes to indicate the result of an operation:
    ✓ 200 - OK (Request successful)
    ✓ 201 - Created (New resource created)
    ✓ 400 - Bad Request (Invalid input)
    ✓ 401 - Unauthorized (Authentication required)
    ✓ 403 - Forbidden (No permission)
    ✓ 404 - Not Found (Resource missing)
    ✓ 500 - Internal Server Error (Server crashed)
  `,

  'Authentication in REST': (
    <div>
      <p>Authentication ensures only authorized users can access resources.</p>
      <pre dangerouslySetInnerHTML={{ __html: `
        Common methods:
        - Basic Auth (username & password in headers)
        - Token-based Auth (JWT tokens)
        - OAuth 2.0 (secure delegated access)
        - API Keys (simple but less secure)
      ` }} />
    </div>
  ),

  'REST API Best Practices': `Some best practices for designing REST APIs:
    ✓ Use nouns for endpoints (e.g., /users, /orders)
    ✓ Use plural form for resources (/products not /product)
    ✓ Handle errors with proper status codes
    ✓ Implement versioning (/api/v1/)
    ✓ Secure APIs with HTTPS
    ✓ Provide pagination for large datasets
  `,

  'REST API Quiz': (
    <div>
      <p>Quick REST API Quiz:</p>
      <ol>
        <li>Which HTTP method is used to create a new resource?</li>
        <li>What does status code 404 mean?</li>
        <li>Difference between PUT and PATCH?</li>
        <li>Is REST API stateful or stateless?</li>
        <li>What format is most commonly used for REST responses?</li>
      </ol>
    </div>
  ),
};
