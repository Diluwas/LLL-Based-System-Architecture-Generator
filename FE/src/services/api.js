import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000, // Increased timeout for LLM + D2 rendering
});

// ── Set MOCK_MODE = true to test UI without backend ──
const MOCK_MODE = false;

// Mock response with D2 diagram format
const MOCK_RESPONSE = {
  success: true,
  data: {
    architectural_pattern: 'microservices',
    pattern_rationale: 'Microservices architecture was selected because: 1) The system requires independent scaling of different components (inventory vs notifications), 2) Different teams can work on separate services independently, 3) Each service can use the most appropriate technology stack, 4) Failure isolation - if one service fails, others continue to operate. Alternative patterns considered: Monolithic (rejected due to scaling limitations) and Serverless (rejected due to cold start latency concerns for real-time inventory updates).',
    architectural_components: [
      { name: 'API Gateway', type: 'gateway', description: 'Acts as the entry point for all external API requests.', responsibility: 'Manages API request routing, authentication, and rate-limiting.', rationale: 'Centralizes cross-cutting concerns like authentication, rate limiting, and request routing. Provides a single entry point for clients, simplifying the client-side logic.' },
      { name: 'User Authentication Service', type: 'service', description: 'Manages user accounts, authentication, and authorization.', responsibility: 'Ensures secure access to the application for authorized users only.', rationale: 'Dedicated authentication service enables centralized security management and can be scaled independently during high login traffic periods.' },
      { name: 'Inventory Service', type: 'service', description: 'Handles all inventory-related operations such as adding, updating, and deleting items.', responsibility: 'Responsible for managing inventory data and implementing business logic for inventory operations.', rationale: 'Core business logic separated into its own service for independent scaling and deployment. This is the most frequently accessed service.' },
      { name: 'Notification Service', type: 'service', description: 'Handles notifications for low stock alerts, order updates, etc.', responsibility: 'Sends notifications to users based on inventory thresholds or other events.', rationale: 'Asynchronous notification processing prevents blocking the main inventory operations. Can handle burst notification loads independently.' },
      { name: 'PostgreSQL Database', type: 'database', description: 'Stores inventory data, user data, and transaction records.', responsibility: 'Provides persistent storage for all application data.', rationale: 'PostgreSQL chosen for ACID compliance, strong consistency for inventory counts, and excellent support for complex queries needed for reporting.' },
      { name: 'Redis Cache', type: 'cache', description: 'Provides faster access to frequently accessed data.', responsibility: 'Improves application performance by caching inventory data and reducing database queries.', rationale: 'In-memory caching dramatically reduces database load for frequently accessed inventory items. Redis provides sub-millisecond response times.' },
      { name: 'Web UI', type: 'ui', description: 'Provides a graphical user interface for shop owners to interact with the application.', responsibility: 'Allows users to view, manage, and track inventory via a web-based interface.', rationale: 'React-based SPA provides responsive user experience. Can be deployed to CDN for global low-latency access.' },
      { name: 'Mobile App', type: 'ui', description: 'Provides a mobile-friendly interface for managing inventory on the go.', responsibility: 'Enables shop owners to manage inventory and receive notifications via their mobile devices.', rationale: 'Native mobile app enables push notifications and offline capability for inventory checks when connectivity is limited.' },
    ],
    connections: [
      { from: 'Web UI', to: 'API Gateway', label: 'HTTPS' },
      { from: 'Mobile App', to: 'API Gateway', label: 'HTTPS' },
      { from: 'API Gateway', to: 'User Authentication Service', label: 'REST' },
      { from: 'API Gateway', to: 'Inventory Service', label: 'REST' },
      { from: 'Inventory Service', to: 'PostgreSQL Database', label: 'SQL' },
      { from: 'Inventory Service', to: 'Redis Cache', label: 'Cache' },
      { from: 'Inventory Service', to: 'Notification Service', label: 'Async' },
      { from: 'User Authentication Service', to: 'PostgreSQL Database', label: 'SQL' },
    ],
  }
};

/**
 * Generate architecture from user prompt
 * @param {string} userPrompt - User's requirements description
 * @param {string} diagramFormat - Output format: 'svg' (default), 'png', or 'pdf'
 * @returns {Promise<Object>} Architecture analysis with diagram
 */
export const generateArchitecture = async (userPrompt, diagramFormat = 'svg') => {
  if (MOCK_MODE) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1800));
    return MOCK_RESPONSE;
  }

  // Real API call with optional diagram format
  const response = await apiClient.post('/user/input', { 
    user_prompt: userPrompt,
    diagram_format: diagramFormat
  });
  return response.data;
};

/**
 * Render D2 diagram code to image
 * @param {string} d2Code - D2 diagram code
 * @param {string} format - Output format: 'svg', 'png', or 'pdf'
 * @returns {Promise<Object>} Rendered diagram data
 */
export const renderDiagram = async (d2Code, format = 'svg') => {
  const response = await apiClient.post('/diagram/render', {
    d2_code: d2Code,
    format: format
  });
  return response.data;
};

/**
 * Validate D2 diagram code syntax
 * @param {string} d2Code - D2 diagram code to validate
 * @returns {Promise<Object>} Validation result
 */
export const validateDiagram = async (d2Code) => {
  const response = await apiClient.post('/diagram/validate', {
    d2_code: d2Code
  });
  return response.data;
};

/**
 * Check if D2 is available on the backend
 * @returns {Promise<Object>} D2 availability status
 */
export const checkD2Health = async () => {
  const response = await apiClient.get('/health/d2');
  return response.data;
};

export default apiClient;
