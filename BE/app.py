"""
Backend Flask Application Entry Point
Architecture Design Automation System
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import os

# Import configuration
from config import Config

# Create logs directory if it doesn't exist
log_dir = os.path.dirname(Config.LOG_FILE_PATH)
if log_dir:
    os.makedirs(log_dir, exist_ok=True)

# Configure logging
def setup_logging():
    """Configure logging with file and console handlers"""
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)  # Capture all levels
    
    # File handler - logs everything at DEBUG level and above
    file_handler = logging.FileHandler(Config.LOG_FILE_PATH, mode="w")
    file_handler.setLevel(logging.DEBUG)
    file_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    file_handler.setFormatter(file_formatter)
    
    # Console handler - only logs WARNING level and above
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.WARNING)
    console_formatter = logging.Formatter(
        '%(levelname)s - %(name)s - %(message)s'
    )
    console_handler.setFormatter(console_formatter)
    
    # Add handlers
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

logger = setup_logging()

# Validate configuration at startup
try:
    Config.initialize()
except ValueError as e:
    logger.error(f"Configuration error: {str(e)}")
    raise

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Apply configuration to Flask app
app.config['DEBUG'] = Config.DEBUG
app.config['MAX_CONTENT_LENGTH'] = Config.MAX_CONTENT_LENGTH
app.config['JSON_SORT_KEYS'] = Config.JSON_SORT_KEYS

# Import routes
from api_routes import api_bp

# Register blueprints
app.register_blueprint(api_bp, url_prefix='/api')

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info(f"Starting application in {Config.FLASK_ENV} mode")
    app.run(
        host=Config.FLASK_HOST,
        port=Config.FLASK_PORT,
        debug=Config.FLASK_DEBUG
    )
