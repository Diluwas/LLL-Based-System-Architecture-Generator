"""
Diagram Generation Module
Generates visual representations of architecture using D2
"""

from typing import Dict, Any, Optional
from config import Config
import logging
import subprocess
import tempfile
import base64
import os
import re
import shutil

logger = logging.getLogger(__name__)


class DiagramGenerator:
    """
    Generates architectural diagrams from D2 code
    Supports multiple formats: PNG, SVG, PDF
    """
    
    def __init__(self):
        self.d2_path = self._find_d2_executable()
        if not self.d2_path:
            logger.warning("D2 executable not found. Please install D2: https://d2lang.com/tour/install")
    
    def _find_d2_executable(self) -> Optional[str]:
        """Find D2 executable in system PATH"""
        d2_path = shutil.which('d2')
        if d2_path:
            logger.info(f"D2 executable found at: {d2_path}")
            return d2_path
        
        # Check common installation paths on Windows
        common_paths = [
            os.path.expanduser('~/.local/bin/d2'),
            os.path.expanduser('~/go/bin/d2'),
            'C:\\Program Files\\d2\\d2.exe',
            'C:\\d2\\d2.exe',
        ]
        
        for path in common_paths:
            if os.path.isfile(path):
                logger.info(f"D2 executable found at: {path}")
                return path
        
        return None
    
    def is_d2_available(self) -> bool:
        """Check if D2 is available for diagram generation"""
        return self.d2_path is not None
    
    def _strip_icon_lines(self, d2_code: str, urls_to_remove: list = None) -> str:
        """
        Remove icon lines from D2 code.
        If urls_to_remove is provided, only strip those specific URLs.
        Otherwise strip ALL icon lines with remote URLs.
        """
        lines = d2_code.split('\n')
        filtered = []
        for line in lines:
            stripped = line.strip()
            if stripped.startswith('icon:'):
                if urls_to_remove is None:
                    # Strip all remote icon lines
                    if 'http://' in stripped or 'https://' in stripped:
                        continue
                else:
                    # Strip only specific failing URLs
                    if any(url in stripped for url in urls_to_remove):
                        continue
            filtered.append(line)
        return '\n'.join(filtered)

    def _extract_failed_urls(self, stderr: str) -> list:
        """Extract failing icon URLs from D2 stderr output."""
        return re.findall(r'failed to bundle (https?://\S+):', stderr)

    def _run_d2(self, d2_code: str, input_path: str, output_path: str, format: str) -> bytes:
        """Run D2 CLI and return generated image bytes."""
        # Write code to input file
        with open(input_path, 'w', encoding='utf-8') as f:
            f.write(d2_code)

        cmd = [
            self.d2_path,
            '--theme', '0',
            '--layout', 'dagre',
            '--pad', '80',
            input_path,
            output_path
        ]
        if format == 'png':
            cmd.extend(['--scale', '2'])

        logger.debug(f"Running D2 command: {' '.join(cmd)}")

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=60
        )

        if result.returncode != 0:
            raise RuntimeError(result.stderr)

        with open(output_path, 'rb') as f:
            return f.read()

    def generate_architecture_diagram(self, d2_code: str, format: str = "svg") -> Dict[str, Any]:
        """
        Generate architecture diagram from D2 code and return as base64.
        Automatically retries with failing icon URLs stripped if D2 fails
        to fetch remote icons (403 / network errors).
        """
        if not self.d2_path:
            raise RuntimeError("D2 is not installed. Please install D2 from https://d2lang.com/tour/install")

        output_ext = format if format in ['svg', 'png', 'pdf'] else 'svg'
        input_path = None
        output_path = None

        try:
            input_path = tempfile.mktemp(suffix='.d2')
            output_path = tempfile.mktemp(suffix=f'.{output_ext}')
            current_code = d2_code

            # Attempt 1: original code
            try:
                image_data = self._run_d2(current_code, input_path, output_path, format)
            except RuntimeError as e:
                stderr = str(e)
                failed_urls = self._extract_failed_urls(stderr)
                if not failed_urls:
                    raise  # Not an icon-fetch issue

                # Attempt 2: strip only the failing URLs
                logger.warning(f"D2 icon fetch failed for {len(failed_urls)} URL(s). Retrying without them.")
                current_code = self._strip_icon_lines(d2_code, failed_urls)
                try:
                    image_data = self._run_d2(current_code, input_path, output_path, format)
                except RuntimeError:
                    # Attempt 3: strip ALL remote icon URLs
                    logger.warning("Still failing. Retrying with all remote icons stripped.")
                    current_code = self._strip_icon_lines(d2_code)
                    image_data = self._run_d2(current_code, input_path, output_path, format)

            image_base64 = base64.b64encode(image_data).decode('utf-8')
            mime_types = {
                'svg': 'image/svg+xml',
                'png': 'image/png',
                'pdf': 'application/pdf'
            }
            mime_type = mime_types.get(output_ext, 'image/svg+xml')

            logger.info(f"Successfully generated D2 diagram in {output_ext} format")

            return {
                "image": image_base64,
                "format": output_ext,
                "mime_type": mime_type,
                "d2_code": d2_code
            }

        except subprocess.TimeoutExpired:
            logger.error("D2 diagram generation timed out")
            raise RuntimeError("Diagram generation timed out")
        except Exception as e:
            logger.error(f"Error generating D2 diagram: {str(e)}")
            raise
        finally:
            for path in [input_path, output_path]:
                if path and os.path.exists(path):
                    os.unlink(path)
    
    def validate_d2_code(self, d2_code: str) -> Dict[str, Any]:
        """
        Validate D2 code without generating output
        
        Args:
            d2_code: D2 diagram code to validate
            
        Returns:
            Dict with 'valid' boolean and 'error' message if invalid
        """
        if not self.d2_path:
            return {"valid": False, "error": "D2 is not installed"}
        
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.d2', delete=False, encoding='utf-8') as f:
                f.write(d2_code)
                input_path = f.name
            
            try:
                # Use --dry-run to validate without generating output
                result = subprocess.run(
                    [self.d2_path, '--dry-run', input_path],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                if result.returncode == 0:
                    return {"valid": True, "error": None}
                else:
                    return {"valid": False, "error": result.stderr}
                    
            finally:
                if os.path.exists(input_path):
                    os.unlink(input_path)
                    
        except Exception as e:
            return {"valid": False, "error": str(e)}

# Singleton instance
_generator: DiagramGenerator = None

def get_diagram_generator() -> DiagramGenerator:
    """Get or create diagram generator instance"""
    global _generator
    if _generator is None:
        _generator = DiagramGenerator()
    return _generator
