"""
Configuration Settings for Backend
All environment variables are loaded from .env file and stored in Config class
"""

import os
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger(__name__)


class Config:
    """
    Centralized configuration class
    Loads all environment variables at startup
    """
    
    # ==============================================================================
    # FLASK CONFIGURATION
    # ==============================================================================
    FLASK_ENV = os.getenv('FLASK_ENV', 'production')
    FLASK_HOST = os.getenv('FLASK_HOST', '0.0.0.0')
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    JSON_SORT_KEYS = False
    DEBUG = FLASK_ENV == 'development'
    TESTING = False
    
    # ==============================================================================
    # LLM PROVIDER CONFIGURATION
    # ==============================================================================
    LLM_PROVIDER = os.getenv('LLM_PROVIDER', 'azure')
    LLM_MODEL = os.getenv('LLM_MODEL', 'gpt-4o')
    LLM_TEMPERATURE = float(os.getenv('LLM_TEMPERATURE', 0.7))
    LLM_MAX_TOKENS = int(os.getenv('LLM_MAX_TOKENS', 2000))
    
    # ==============================================================================
    # AZURE OPENAI CONFIGURATION
    # ==============================================================================
    AZURE_OPENAI_API_KEY = os.getenv('AZURE_OPENAI_API_KEY')
    AZURE_OPENAI_API_VERSION = os.getenv('AZURE_OPENAI_API_VERSION', '2024-12-01-preview')
    AZURE_OPENAI_ENDPOINT = os.getenv('AZURE_OPENAI_ENDPOINT')
    AZURE_DEPLOYMENT_NAME = os.getenv('AZURE_DEPLOYMENT_NAME', 'gpt-4o')
    
    # ==============================================================================
    # DIAGRAM GENERATION CONFIGURATION
    # ==============================================================================
    DIAGRAM_FORMAT = os.getenv('DIAGRAM_FORMAT', 'png')
    DIAGRAM_DPI = int(os.getenv('DIAGRAM_DPI', 300))
    DIAGRAM_STYLE = os.getenv('DIAGRAM_STYLE', 'default')
    
    # ==============================================================================
    # REQUEST CONFIGURATION
    # ==============================================================================
    REQUEST_TIMEOUT = int(os.getenv('REQUEST_TIMEOUT', 30))
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))
    
    # ==============================================================================
    # LOGGING CONFIGURATION
    # ==============================================================================
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT = os.getenv('LOG_FORMAT', 'json')
    LOG_FILE_PATH = os.getenv('LOG_FILE_PATH', 'logs/app.log')
    LOG_FILE_MAX_BYTES = int(os.getenv('LOG_FILE_MAX_BYTES', 10 * 1024 * 1024))  # 10MB
    LOG_FILE_BACKUP_COUNT = int(os.getenv('LOG_FILE_BACKUP_COUNT', 5))
    
    @classmethod
    def initialize(cls):
        """
        Initialize configuration at startup:
        1. Log all loaded configuration values
        2. Validate critical configuration
        """
        cls._log_all_config()
        cls.validate_config()
        logger.info("Configuration initialization completed successfully")
    
    @classmethod
    def _log_all_config(cls):
        """Log all configuration values to the log file"""
        logger.info("=" * 80)
        logger.info("LOADED CONFIGURATION VALUES")
        logger.info("=" * 80)
        
        # Flask Configuration
        logger.info("FLASK CONFIGURATION:")
        logger.info(f"  FLASK_ENV: {cls.FLASK_ENV}")
        logger.info(f"  FLASK_HOST: {cls.FLASK_HOST}")
        logger.info(f"  FLASK_PORT: {cls.FLASK_PORT}")
        logger.info(f"  FLASK_DEBUG: {cls.FLASK_DEBUG}")
        logger.info(f"  DEBUG: {cls.DEBUG}")
        logger.info(f"  TESTING: {cls.TESTING}")
        
        # LLM Configuration
        logger.info("LLM PROVIDER CONFIGURATION:")
        logger.info(f"  LLM_PROVIDER: {cls.LLM_PROVIDER}")
        logger.info(f"  LLM_MODEL: {cls.LLM_MODEL}")
        logger.info(f"  LLM_TEMPERATURE: {cls.LLM_TEMPERATURE}")
        logger.info(f"  LLM_MAX_TOKENS: {cls.LLM_MAX_TOKENS}")
        
        # Azure OpenAI Configuration
        logger.info("AZURE OPENAI CONFIGURATION:")
        logger.info(f"  AZURE_OPENAI_API_VERSION: {cls.AZURE_OPENAI_API_VERSION}")
        logger.info(f"  AZURE_OPENAI_ENDPOINT: {cls.AZURE_OPENAI_ENDPOINT}")
        logger.info(f"  AZURE_DEPLOYMENT_NAME: {cls.AZURE_DEPLOYMENT_NAME}")
        logger.info(f"  AZURE_OPENAI_API_KEY: {'***SET***' if cls.AZURE_OPENAI_API_KEY else 'NOT SET'}")
        
        # Diagram Generation Configuration
        logger.info("DIAGRAM GENERATION CONFIGURATION:")
        logger.info(f"  DIAGRAM_FORMAT: {cls.DIAGRAM_FORMAT}")
        logger.info(f"  DIAGRAM_DPI: {cls.DIAGRAM_DPI}")
        logger.info(f"  DIAGRAM_STYLE: {cls.DIAGRAM_STYLE}")
        
        # Request Configuration
        logger.info("REQUEST CONFIGURATION:")
        logger.info(f"  REQUEST_TIMEOUT: {cls.REQUEST_TIMEOUT} seconds")
        logger.info(f"  MAX_CONTENT_LENGTH: {cls.MAX_CONTENT_LENGTH} bytes")
        
        # Logging Configuration
        logger.info("LOGGING CONFIGURATION:")
        logger.info(f"  LOG_LEVEL: {cls.LOG_LEVEL}")
        logger.info(f"  LOG_FORMAT: {cls.LOG_FORMAT}")
        logger.info(f"  LOG_FILE_PATH: {cls.LOG_FILE_PATH}")
        logger.info(f"  LOG_FILE_MAX_BYTES: {cls.LOG_FILE_MAX_BYTES}")
        logger.info(f"  LOG_FILE_BACKUP_COUNT: {cls.LOG_FILE_BACKUP_COUNT}")
        
        logger.info("=" * 80)
    
    @classmethod
    def validate_config(cls):
        """
        Validate critical configuration at startup
        Raises error if required configs are missing
        """
        errors = []
        
        if cls.LLM_PROVIDER == 'azure':
            if not cls.AZURE_OPENAI_API_KEY:
                errors.append("AZURE_OPENAI_API_KEY is required when LLM_PROVIDER=azure")
            if not cls.AZURE_OPENAI_ENDPOINT:
                errors.append("AZURE_OPENAI_ENDPOINT is required when LLM_PROVIDER=azure")
        
        if errors:
            error_msg = "\n".join(errors)
            logger.error(f"Configuration validation failed:\n{error_msg}")
            raise ValueError(f"Invalid configuration:\n{error_msg}")
        
        logger.info("Configuration validated successfully")

