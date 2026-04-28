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
            # Create system prompt for architecture design
            system_prompt = """You are an expert software architect AI assistant. 
            Analyze the user's requirements and provide a comprehensive architecture design.
            Return a JSON response with the following structure:
            {
                "pattern": "microservices|monolithic|serverless|event-driven|hybrid|etc.",
                "components": [
                    {
                        "name": "component_name",
                        "type": "service|database|cache|queue|ui|gateway|etc.",
                        "description": "brief description of the component",
                        "responsibility": "what this component is responsible for"
                    }
                ],
                "rationale": [
                    {
                        "component": "component_name",
                        "rationale": "detailed reason why this component is selected"
                    }
                ],
                "architechure_diagram_code": "PlantUML diagram code"
            }

            Ensure the response is valid JSON and returns a well-thought-out architecture design."""

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
