"""
LLM Service Module
Handles integration with Language Models for architecture analysis
"""

from config import Config
from typing import Dict, Any, Optional
import logging
import json

logger = logging.getLogger(__name__)

class LLMService:
    """
    Service class for LLM interactions
    Supports multiple LLM providers (Azure OpenAI, OpenAI, Anthropic, etc.)
    """
    
    def __init__(self):
        self.provider = Config.LLM_PROVIDER
        self.model = Config.LLM_MODEL
        self.temperature = Config.LLM_TEMPERATURE
        self.max_tokens = Config.LLM_MAX_TOKENS
        self.deployment_name = Config.AZURE_DEPLOYMENT_NAME
        self.client = None
        
        # Initialize provider-specific client
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize LLM client based on provider"""
        if self.provider == 'azure':
            self._initialize_azure_client()
        else:
            raise ValueError(f"Unsupported LLM provider: {self.provider}")
    
    def _initialize_azure_client(self):
        """Initialize Azure OpenAI client"""
        try:
            from openai import AzureOpenAI
            
            api_key = Config.AZURE_OPENAI_API_KEY
            api_version = Config.AZURE_OPENAI_API_VERSION
            azure_endpoint = Config.AZURE_OPENAI_ENDPOINT
            
            if not all([api_key, azure_endpoint]):
                raise ValueError("Azure OpenAI credentials not configured. Set AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT in .env")
            
            self.client = AzureOpenAI(
                api_key=api_key,
                api_version=api_version,
                azure_endpoint=azure_endpoint
            )
            logger.info("Azure OpenAI client initialized successfully")
        except ImportError:
            raise ImportError("azure-openai package is required. Install it using: pip install azure-openai")
        except Exception as e:
            logger.error(f"Failed to initialize Azure OpenAI client: {str(e)}")
            raise
    
    
    def analyze_requirements(self, requirements: str) -> Dict[str, Any]:
        """
        Analyze user requirements and generate architecture design using LLM
        
        Args:
            requirements: User's high-level requirements/prompt
            
        Returns:
            Dict containing architecture analysis, components, pattern, and rationale
        """
        try:
            # Create system prompt for architecture design with D2 diagram support
            system_prompt = """You are an expert software architect AI assistant. 
            Analyze the user's requirements and provide a comprehensive architecture design.
            Return a JSON response with the following structure:
            {
                "pattern": "microservices|monolithic|serverless|event-driven|layered|pipe-and-filter|client-server|mvc|cqrs|hexagonal|etc.",
                "pattern_rationale": "Detailed explanation of WHY this architecture pattern was selected. Include: 1) How it addresses the specific requirements, 2) Key benefits for this use case, 3) Trade-offs considered, 4) Alternatives that were considered and why they were not chosen.",
                "components": [
                    {
                        "name": "component_name",
                        "type": "service|database|cache|queue|ui|gateway|load_balancer|cdn|storage|container|serverless_function|message_broker|search_engine|monitoring|logging|auth|etc.",
                        "description": "brief description of the component",
                        "responsibility": "what this component is responsible for",
                        "rationale": "detailed reason why this specific component is needed and why this technology/approach was chosen"
                    }
                ],
                "connections": [
                    {
                        "from": "source_component_name",
                        "to": "target_component_name",
                        "label": "connection description (e.g., REST API, gRPC, async messages)",
                        "style": "solid|dashed"
                    }
                ],
                "architecture_diagram_code": "D2 diagram code - see format below"
            }

            For the D2 diagram code, use this format with proper icons:
            - Use Terrastruct icons from: https://icons.terrastruct.com/
            - Common icon URLs:
              * API Gateway: https://icons.terrastruct.com/aws%2FNetworking%20&%20Content%20Delivery%2FAmazon-API-Gateway.svg
              * Load Balancer: https://icons.terrastruct.com/aws%2FNetworking%20&%20Content%20Delivery%2FElastic-Load-Balancing.svg
              * EC2/Server: https://icons.terrastruct.com/aws%2FCompute%2FAmazon-EC2.svg
              * Lambda/Function: https://icons.terrastruct.com/aws%2FCompute%2FAWS-Lambda.svg
              * Database (RDS): https://icons.terrastruct.com/aws%2FDatabase%2FAmazon-RDS.svg
              * DynamoDB: https://icons.terrastruct.com/aws%2FDatabase%2FAmazon-DynamoDB.svg
              * PostgreSQL: https://icons.terrastruct.com/dev%2Fpostgresql.svg
              * MongoDB: https://icons.terrastruct.com/dev%2Fmongodb.svg
              * MySQL: https://icons.terrastruct.com/dev%2Fmysql.svg
              * Redis: https://icons.terrastruct.com/dev%2Fredis.svg
              * S3/Storage: https://icons.terrastruct.com/aws%2FStorage%2FAmazon-Simple-Storage-Service-S3.svg
              * CloudFront/CDN: https://icons.terrastruct.com/aws%2FNetworking%20&%20Content%20Delivery%2FAmazon-CloudFront.svg
              * SQS/Queue: https://icons.terrastruct.com/aws%2FApp%20Integration%2FAmazon-Simple-Queue-Service-SQS.svg
              * SNS: https://icons.terrastruct.com/aws%2FApp%20Integration%2FAmazon-Simple-Notification-Service-SNS.svg
              * Kafka: https://icons.terrastruct.com/dev%2Fapache.svg
              * Docker: https://icons.terrastruct.com/dev%2Fdocker.svg
              * Kubernetes: https://icons.terrastruct.com/dev%2Fkubernetes.svg
              * React: https://icons.terrastruct.com/dev%2Freact.svg
              * Node.js: https://icons.terrastruct.com/dev%2Fnodejs.svg
              * Python: https://icons.terrastruct.com/dev%2Fpython.svg
              * Java: https://icons.terrastruct.com/dev%2Fjava.svg
              * User: https://icons.terrastruct.com/essentials%2F359-users.svg
              * Cloud: https://icons.terrastruct.com/aws%2F_General%2FAWS-Cloud.svg
              * Mobile: https://icons.terrastruct.com/aws%2FMobile%2FAmazon-Pinpoint.svg
              * Browser: https://icons.terrastruct.com/dev%2Fchrome.svg
              * Auth/Cognito: https://icons.terrastruct.com/aws%2FSecurity%2C%20Identity%2C%20&%20Compliance%2FAmazon-Cognito.svg
              * Elasticsearch: https://icons.terrastruct.com/dev%2Felasticsearch.svg
              * Monitoring: https://icons.terrastruct.com/aws%2FManagement%20&%20Governance%2FAmazon-CloudWatch.svg
              * Nginx: https://icons.terrastruct.com/dev%2Fnginx.svg

            D2 Diagram Example:
            ```
            direction: right

            users: Users {
              icon: https://icons.terrastruct.com/essentials%2F359-users.svg
            }

            api_gateway: API Gateway {
              icon: https://icons.terrastruct.com/aws%2FNetworking%20&%20Content%20Delivery%2FAmazon-API-Gateway.svg
            }

            services: Microservices {
              user_service: User Service {
                icon: https://icons.terrastruct.com/aws%2FCompute%2FAmazon-EC2.svg
              }
              order_service: Order Service {
                icon: https://icons.terrastruct.com/aws%2FCompute%2FAmazon-EC2.svg
              }
            }

            database: PostgreSQL {
              icon: https://icons.terrastruct.com/dev%2Fpostgresql.svg
              shape: cylinder
            }

            cache: Redis Cache {
              icon: https://icons.terrastruct.com/dev%2Fredis.svg
            }

            users -> api_gateway: HTTPS
            api_gateway -> services.user_service: REST
            api_gateway -> services.order_service: REST
            services.user_service -> database: SQL
            services.order_service -> database: SQL
            services.user_service -> cache: Cache queries
            ```

            Important D2 rules:
            1. Use snake_case for component IDs (no spaces or special chars)
            2. Use descriptive labels after colon for display names
            3. Use shape: cylinder for databases
            4. Group related components using nested blocks
            5. Add meaningful connection labels
            6. Use 'direction: right' or 'direction: down' for layout
            7. ALWAYS include icons for visual clarity

            Ensure the response is valid JSON and returns a well-thought-out architecture design with clear rationales."""

            if self.provider == 'azure':
                return self._call_azure_api(system_prompt, requirements)
        except Exception as e:
            logger.error(f"Error analyzing requirements: {str(e)}")
            raise
    
    def _call_azure_api(self, system_prompt: str, user_message: str) -> Dict[str, Any]:
        """Call Azure OpenAI API"""
        try:
            response = self.client.chat.completions.create(
                model=self.deployment_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                response_format={"type": "json_object"}
            )
            
            # Extract response content
            response_text = response.choices[0].message.content
            
            # Parse JSON response
            architecture = json.loads(response_text)
            
            logger.info("Successfully analyzed requirements using Azure OpenAI")
            logger.debug(f"Response: {response_text}")
            return architecture
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Azure OpenAI response as JSON: {str(e)}")
            raise ValueError("Invalid JSON response from LLM")
        except Exception as e:
            logger.error(f"Azure OpenAI API call failed: {str(e)}")
            raise

# Singleton instance
_llm_service: Optional[LLMService] = None

def get_llm_service() -> LLMService:
    """Get or create LLM service instance"""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
