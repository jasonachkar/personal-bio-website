/**
 * Resume utility functions for preview and download
 */

/**
 * Opens the resume PDF in a new browser tab for preview
 */
export function previewResume(): void {
  window.open('/resume.pdf', '_blank', 'noopener,noreferrer');
}

/**
 * Downloads the resume PDF file
 * Uses Fetch API to ensure proper download behavior across browsers
 */
export async function downloadResume(): Promise<void> {
  try {
    const response = await fetch('/resume.pdf');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch resume: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Jason_Achkar_Diab_Resume_DevSecOps_CloudSec.pdf';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Failed to download resume:', error);
    // Fallback: open in new tab if download fails
    window.open('/resume.pdf', '_blank', 'noopener,noreferrer');
  }
}
