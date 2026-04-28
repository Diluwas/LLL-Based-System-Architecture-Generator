"""
Diagram Generation Module
Generates visual representations of architecture
"""

from typing import Dict, Any, Tuple
# from config import DIAGRAM_CONFIG
import logging
import requests
import zlib
import base64

logger = logging.getLogger(__name__)

class DiagramGenerator:
    """
    Generates architectural diagrams from architecture analysis
    Supports multiple formats: PNG, SVG, PDF
    """
    
    def __init__(self):
        # self.format = DIAGRAM_CONFIG['format']
        # self.dpi = DIAGRAM_CONFIG['dpi']
        # self.style = DIAGRAM_CONFIG['style']
        pass
    
    def generate_architecture_diagram(self, plantuml_code: str, format: str = "png") -> Dict[str, Any]:
        """
        Generate architecture diagram from PlantUML code and return as base64
        
        Args:
            plantuml_code: PlantUML diagram code
            format: Image format - png, svg, pdf, etc. (default: png)
            
        Returns:
            Dict containing:
                - image: Base64-encoded image data
                - format: Image format used
                - mime_type: MIME type of the image
        """
        try:
            # Compress PlantUML code
            compressed = zlib.compress(plantuml_code.encode('utf-8'))
            encoded = base64.b64encode(compressed).decode('utf-8')

            # Call PlantUML server
            url = f"https://www.plantuml.com/plantuml/{format}/{encoded}"
            response = requests.get(url)
            
            if response.status_code != 200:
                logger.error(f"PlantUML server returned status code {response.status_code}")
                raise Exception(f"Failed to generate diagram: HTTP {response.status_code}")
            
            # Convert image bytes to base64
            image_base64 = base64.b64encode(response.content).decode('utf-8')
            
            # Determine MIME type
            mime_types = {
                'png': 'image/png',
                'svg': 'image/svg+xml',
                'pdf': 'application/pdf',
                'eps': 'application/postscript'
            }
            mime_type = mime_types.get(format, 'image/png')
            
            logger.info(f"Successfully generated diagram in {format} format")
            
            return {
                "image": image_base64,
                "format": format,
                "mime_type": mime_type
            }
            
        except Exception as e:
            logger.error(f"Error generating diagram: {str(e)}")
            raise

# Singleton instance
_generator: DiagramGenerator = None

def get_diagram_generator() -> DiagramGenerator:
    """Get or create diagram generator instance"""
    global _generator
    if _generator is None:
        _generator = DiagramGenerator()
    return _generator
