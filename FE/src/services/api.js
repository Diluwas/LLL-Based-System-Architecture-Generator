import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

// ── Set MOCK_MODE = true to test UI without backend ──
const MOCK_MODE = true;

const MOCK_RESPONSE = {
  success: true,
  data: {
    architectural_pattern: 'microservices',
    architechure_diagram_code: `@startuml
!theme plain
skinparam backgroundColor #ffffff
skinparam componentBackgroundColor #eef2ff
skinparam componentBorderColor #6366f1
skinparam componentFontColor #1e1e3f
skinparam arrowColor #6366f1
skinparam databaseBackgroundColor #dcfce7
skinparam databaseBorderColor #16a34a

actor "Web UI" as webui
actor "Mobile App" as mobile
boundary "API Gateway" as gateway
component "User Auth Service" as auth
component "Inventory Service" as inventory
component "Notification Service" as notify
database "Database" as db
storage "Cache" as cache

webui --> gateway
mobile --> gateway
gateway --> auth
gateway --> inventory
inventory --> db
inventory --> cache
inventory --> notify
auth --> db
@enduml`,
    architectural_components: [
      { name: 'Inventory Management Service', type: 'service',  description: 'Handles all inventory-related operations such as adding, updating, and deleting items.', responsibility: 'Responsible for managing inventory data and implementing business logic for inventory operations.' },
      { name: 'User Authentication Service', type: 'service',  description: 'Manages user accounts, authentication, and authorization.', responsibility: 'Ensures secure access to the application for authorized users only.' },
      { name: 'Database',                    type: 'database', description: 'Stores inventory data, user data, and transaction records.', responsibility: 'Provides persistent storage for all application data.' },
      { name: 'Cache',                       type: 'cache',    description: 'Provides faster access to frequently accessed data.', responsibility: 'Improves application performance by caching inventory data and reducing database queries.' },
      { name: 'Notification Service',        type: 'service',  description: 'Handles notifications for low stock alerts, order updates, etc.', responsibility: 'Sends notifications to users based on inventory thresholds or other events.' },
      { name: 'API Gateway',                 type: 'gateway',  description: 'Acts as the entry point for all external API requests.', responsibility: 'Manages API request routing, authentication, and rate-limiting.' },
      { name: 'Web UI',                      type: 'ui',       description: 'Provides a graphical user interface for shop owners to interact with the application.', responsibility: 'Allows users to view, manage, and track inventory via a web-based interface.' },
      { name: 'Mobile App',                  type: 'ui',       description: 'Provides a mobile-friendly interface for managing inventory on the go.', responsibility: 'Enables shop owners to manage inventory and receive notifications via their mobile devices.' },
    ],
    rationale_for_components: [
      { component: 'Inventory Management Service', rationale: 'This is the core of the application, responsible for managing inventory operations efficiently. A dedicated service ensures scalability and separation of concerns.' },
      { component: 'User Authentication Service',  rationale: 'Authentication is crucial for securing the application and ensuring that only authorized users can access sensitive inventory data.' },
      { component: 'Database',                     rationale: 'A relational database is chosen to store structured inventory data, user accounts, and transaction logs for consistent data storage and querying.' },
      { component: 'Cache',                        rationale: 'Caching frequently accessed inventory data improves performance and reduces the load on the database, especially during peak usage.' },
      { component: 'Notification Service',         rationale: 'Notifications are important for keeping shop owners informed about critical events like low stock levels or order updates.' },
      { component: 'API Gateway',                  rationale: 'An API Gateway centralizes request routing, authentication, and rate-limiting, simplifying the client-server interaction.' },
      { component: 'Web UI',                       rationale: 'A web interface provides an accessible platform for shop owners to manage inventory from any device with a browser.' },
      { component: 'Mobile App',                   rationale: 'A mobile app enables shop owners to manage inventory on the go and receive real-time push notifications.' },
    ]
  }
};

export const generateArchitecture = async (userPrompt) => {
  if (MOCK_MODE) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1800));
    return MOCK_RESPONSE;
  }

  // Real API call — backend maps pattern -> architectural_pattern
  const response = await apiClient.post('/user/input', { user_prompt: userPrompt });
  return response.data;
};

export default apiClient;
