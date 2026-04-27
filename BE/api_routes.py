"""
API Routes
Defines all REST API endpoints for architecture generation
"""

from flask import Blueprint, request, jsonify
from architecture_analyzer import get_analyzer
from diagram_generator import get_diagram_generator
import logging
import io
import base64

logger = logging.getLogger(__name__)

api_bp = Blueprint('api', __name__)

# Instances
analyzer = get_analyzer()
diagram_gen = get_diagram_generator()


@api_bp.route('/user/input', methods=['POST'])
def process_user_input():
    """
    Endpoint: POST /api/user/input
    
    Process user prompt and generate architectural analysis
    
    Request JSON:
    {
        "user_prompt": "I want to design a app ....."
    }
    
    Response JSON:
    {
        "success": true,
        "data": {
            "architectural_pattern": "microservices|monolithic|serverless|...",
            "architectural_components": [
                {
                    "name": "component_name",
                    "type": "component_type",
                    "description": "component_description"
                },
                ...
            ],
            "rationale_for_components": [
                {
                    "component": "component_name",
                    "rationale": "reason for selecting this component"
                },
                ...
            ]
        }
    }
    """
    try:
        data = request.get_json()
        
        # Validate request
        if not data or 'user_prompt' not in data:
            return jsonify({
                'success': False,
                'error': 'User prompt is not valid'
            }), 400
        
        user_prompt = data.get('user_prompt', '').strip()
        
        if not user_prompt:
            return jsonify({
                'success': False,
                'error': 'user_prompt cannot be empty'
            }), 400
        
        # TODO: Send prompt to LLM service for analysis
        # TODO: Parse LLM response to extract architectural pattern, components, and rationale
        architecture = analyzer.analyze(user_prompt)
        
        return jsonify({
            'success': True,
            'data': {
                'architectural_pattern': architecture.get('pattern', 'unknown'),
                'architectural_components': architecture.get('components', []),
                'rationale_for_components': architecture.get('rationale', [])
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error processing user input: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
