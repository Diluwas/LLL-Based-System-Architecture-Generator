"""
Architecture Analysis Module
Analyzes requirements and generates architecture recommendations
"""

from typing import Dict, Any, List
from llm_service import get_llm_service
import logging

logger = logging.getLogger(__name__)

class ArchitectureAnalyzer:
    """
    Analyzes requirements and generates architecture designs
    """
    
    def __init__(self):
        self.llm_service = get_llm_service()
    
    def analyze(self, requirements: str) -> Dict[str, Any]:
        """
        Analyze requirements and generate architecture
        
        Args:
            requirements: User's high-level requirements/prompt
            
        Returns:
            Comprehensive architecture analysis with pattern, components, and rationale
        """
        try:
            # Call LLM service to analyze requirements
            architecture_analysis = self.llm_service.analyze_requirements(requirements)
            
            # Ensure all required fields are present
            if 'pattern' not in architecture_analysis:
                architecture_analysis['pattern'] = 'unknown'
            if 'components' not in architecture_analysis:
                architecture_analysis['components'] = []
            if 'rationale' not in architecture_analysis:
                architecture_analysis['rationale'] = []
            
            logger.info(f"Architecture analysis completed. Pattern: {architecture_analysis}")
            return architecture_analysis
            
        except Exception as e:
            logger.error(f"Error analyzing requirements: {str(e)}")
            # Return a fallback response in case of error
            return {
                'pattern': 'unknown',
                'components': [],
                'rationale': [],
                'error': str(e)
            }

# Singleton instance
_analyzer: ArchitectureAnalyzer = None

def get_analyzer() -> ArchitectureAnalyzer:
    """Get or create analyzer instance"""
    global _analyzer
    if _analyzer is None:
        _analyzer = ArchitectureAnalyzer()
    return _analyzer
