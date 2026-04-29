"""
API Routes
Defines all REST API endpoints for architecture generation
"""

from flask import Blueprint, request, jsonify
from architecture_analyzer import get_analyzer
from diagram_generator import get_diagram_generator
import logging

logger = logging.getLogger(__name__)

api_bp = Blueprint('api', __name__)

# Instances
analyzer = get_analyzer()
diagram_gen = get_diagram_generator()


@api_bp.route('/user/input', methods=['POST'])
def process_user_input():
    """
    Endpoint: POST /api/user/input
    
    Process user prompt and generate architectural analysis with D2 diagram
    
    Request JSON:
    {
        "user_prompt": "I want to design an app ...",
        "diagram_format": "svg" (optional, default: svg, options: svg, png, pdf)
    }
    
    Response JSON:
    {
        "success": true,
        "data": {
            "architectural_pattern": "microservices|monolithic|serverless|...",
            "pattern_rationale": "Detailed explanation of why this pattern was selected...",
            "architectural_components": [
                {
                    "name": "component_name",
                    "type": "component_type",
                    "description": "component_description",
                    "responsibility": "what this component does",
                    "rationale": "why this component was chosen"
                },
                ...
            ],
            "connections": [
                {
                    "from": "source_component",
                    "to": "target_component",
                    "label": "connection description"
                },
                ...
            ],
            "diagram": {
                "image": "base64_encoded_image_data",
                "format": "svg",
                "mime_type": "image/svg+xml",
                "d2_code": "original D2 diagram code"
            }
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
        diagram_format = data.get('diagram_format', 'svg').lower()
        
        # Validate diagram format
        if diagram_format not in ['svg', 'png', 'pdf']:
            diagram_format = 'svg'
        
        if not user_prompt:
            return jsonify({
                'success': False,
                'error': 'user_prompt cannot be empty'
            }), 400
        
        # Analyze requirements using LLM service
        architecture = analyzer.analyze(user_prompt)
        
        # Extract D2 code from LLM response
        d2_code = architecture.get('architecture_diagram_code', '')
        
        # Generate diagram image if D2 code is available
        diagram_data = None
        diagram_error = None
        
        if d2_code:
            if diagram_gen.is_d2_available():
                try:
                    diagram_data = diagram_gen.generate_architecture_diagram(d2_code, format=diagram_format)
                except Exception as e:
                    logger.error(f"Failed to generate diagram: {str(e)}")
                    diagram_error = str(e)
            else:
                diagram_error = "D2 is not installed. Please install D2 from https://d2lang.com/tour/install"
                logger.warning(diagram_error)
        
        # Build response with enhanced rationale information
        response_data = {
            'architectural_pattern': architecture.get('pattern', 'unknown'),
            'pattern_rationale': architecture.get('pattern_rationale', ''),
            'architectural_components': architecture.get('components', []),
            'connections': architecture.get('connections', [])
        }
        
        # Add diagram if available
        if diagram_data:
            response_data['diagram'] = {
                'image': diagram_data['image'],
                'format': diagram_data['format'],
                'mime_type': diagram_data['mime_type'],
                'd2_code': diagram_data.get('d2_code', d2_code)
            }
        elif d2_code:
            # Return D2 code even if rendering failed
            response_data['diagram'] = {
                'image': None,
                'format': None,
                'mime_type': None,
                'd2_code': d2_code,
                'render_error': diagram_error
            }
        
        return jsonify({
            'success': True,
            'data': response_data
        }), 200
        
    except Exception as e:
        logger.error(f"Error processing user input: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/diagram/render', methods=['POST'])
def render_diagram():
    """
    Endpoint: POST /api/diagram/render
    
    Render D2 diagram code to image
    
    Request JSON:
    {
        "d2_code": "D2 diagram code string",
        "format": "svg" (optional, default: svg, options: svg, png, pdf)
    }
    
    Response JSON:
    {
        "success": true,
        "data": {
            "image": "base64_encoded_image_data",
            "format": "svg",
            "mime_type": "image/svg+xml"
        }
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'd2_code' not in data:
            return jsonify({
                'success': False,
                'error': 'd2_code is required'
            }), 400
        
        d2_code = data.get('d2_code', '').strip()
        diagram_format = data.get('format', 'svg').lower()
        
        if not d2_code:
            return jsonify({
                'success': False,
                'error': 'd2_code cannot be empty'
            }), 400
        
        if diagram_format not in ['svg', 'png', 'pdf']:
            diagram_format = 'svg'
        
        if not diagram_gen.is_d2_available():
            return jsonify({
                'success': False,
                'error': 'D2 is not installed. Please install D2 from https://d2lang.com/tour/install'
            }), 503
        
        diagram_data = diagram_gen.generate_architecture_diagram(d2_code, format=diagram_format)
        
        return jsonify({
            'success': True,
            'data': {
                'image': diagram_data['image'],
                'format': diagram_data['format'],
                'mime_type': diagram_data['mime_type']
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error rendering diagram: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/diagram/validate', methods=['POST'])
def validate_diagram():
    """
    Endpoint: POST /api/diagram/validate
    
    Validate D2 diagram code syntax
    
    Request JSON:
    {
        "d2_code": "D2 diagram code string"
    }
    
    Response JSON:
    {
        "success": true,
        "data": {
            "valid": true,
            "error": null
        }
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'd2_code' not in data:
            return jsonify({
                'success': False,
                'error': 'd2_code is required'
            }), 400
        
        d2_code = data.get('d2_code', '').strip()
        
        if not d2_code:
            return jsonify({
                'success': False,
                'error': 'd2_code cannot be empty'
            }), 400
        
        validation_result = diagram_gen.validate_d2_code(d2_code)
        
        return jsonify({
            'success': True,
            'data': validation_result
        }), 200
        
    except Exception as e:
        logger.error(f"Error validating diagram: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/health/d2', methods=['GET'])
def check_d2_health():
    """
    Endpoint: GET /api/health/d2
    
    Check if D2 is installed and available
    
    Response JSON:
    {
        "success": true,
        "data": {
            "d2_available": true,
            "d2_path": "/path/to/d2"
        }
    }
    """
    return jsonify({
        'success': True,
        'data': {
            'd2_available': diagram_gen.is_d2_available(),
            'd2_path': diagram_gen.d2_path
        }
    }), 200
