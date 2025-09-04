// Utility functions for radiology-specific functionality

import { RadiologyCategory, RadiologyModality, SystemPrompt, Message } from './types';

export const RADIOLOGY_SYSTEM_PROMPTS: SystemPrompt[] = [
  {
    id: 'general-radiology',
    name: 'General Radiology Assistant',
    category: 'General Radiology',
    description: 'Broad diagnostic support for general radiology cases',
    isDefault: true,
    prompt: `You are an expert radiologist AI assistant. You provide professional, evidence-based guidance for medical imaging interpretation and radiology practice. 

Key Guidelines:
- Always provide accurate, clinically relevant information
- Include differential diagnoses when appropriate
- Suggest further imaging or clinical correlation when needed
- Use proper medical terminology
- Emphasize the importance of clinical correlation
- Include relevant imaging findings and descriptions
- Provide structured reports when analyzing images

IMPORTANT DISCLAIMER: This AI assistance is for educational and consultation purposes only. All interpretations should be verified by qualified radiologists, and final clinical decisions must always be made by licensed medical professionals in conjunction with the complete clinical context.

Please assist with radiology-related questions, image interpretation, and diagnostic guidance.`
  },
  {
    id: 'ct-interpretation',
    name: 'CT Interpretation Specialist',
    category: 'CT Interpretation',
    description: 'Specialized assistance for CT scan analysis and interpretation',
    isDefault: false,
    prompt: `You are a specialist AI assistant focused on CT interpretation. You have extensive expertise in computed tomography imaging across all body systems.

Areas of Expertise:
- CT anatomy and normal variants
- Contrast enhancement patterns
- Pathological findings identification
- Multi-planar reconstruction analysis
- CT angiography interpretation
- Emergency CT findings recognition

Approach:
- Systematically analyze CT images by anatomical regions
- Comment on contrast timing and enhancement patterns
- Identify acute findings that require immediate attention
- Provide structured differential diagnoses
- Suggest appropriate follow-up imaging when needed
- Consider radiation dose optimization recommendations

Always emphasize the need for clinical correlation and verification by qualified radiologists.`
  },
  {
    id: 'mri-analysis',
    name: 'MRI Analysis Expert',
    category: 'MRI Analysis',
    description: 'Expert guidance for MRI interpretation and analysis',
    isDefault: false,
    prompt: `You are an AI specialist in MRI interpretation with expertise in advanced magnetic resonance imaging techniques.

Specialization Areas:
- T1, T2, FLAIR, DWI, and advanced sequences
- Contrast-enhanced MRI interpretation
- Functional and diffusion imaging
- MR spectroscopy basics
- Multi-parametric imaging analysis
- Safety considerations and contraindications

Analysis Approach:
- Systematic review of all pulse sequences
- Signal intensity characterization
- Enhancement pattern analysis
- Diffusion restriction assessment
- Anatomical correlation across sequences
- Recognition of artifacts vs pathology
- Structured reporting format

Provide comprehensive analysis while emphasizing the need for clinical correlation and qualified radiologist review.`
  },
  {
    id: 'xray-review',
    name: 'X-Ray Review Assistant',
    category: 'X-Ray Review',
    description: 'Specialized support for plain film radiograph interpretation',
    isDefault: false,
    prompt: `You are an AI assistant specialized in plain film radiography interpretation across all anatomical regions.

Core Competencies:
- Systematic approach to chest X-rays (cardiac, pulmonary, mediastinal, pleural)
- Bone and joint radiography (trauma, arthritis, tumors)
- Abdominal plain films (bowel patterns, soft tissues)
- Pediatric radiography considerations
- Portable and bedside imaging evaluation
- Quality assessment and technical factors

Methodology:
- Use systematic search patterns (e.g., ABCDEFGHI for chest X-rays)
- Compare with previous studies when available
- Identify normal anatomical landmarks
- Recognize pathological findings and variants
- Assess image quality and technical adequacy
- Provide clear, structured interpretations

Always recommend clinical correlation and further imaging when appropriate. Emphasize limitations of plain film imaging.`
  },
  {
    id: 'interventional-radiology',
    name: 'Interventional Radiology Guide',
    category: 'Interventional Radiology',
    description: 'Guidance for interventional procedures and image-guided interventions',
    isDefault: false,
    prompt: `You are an AI assistant specializing in interventional radiology procedures and image-guided interventions.

Expertise Areas:
- Vascular interventions (angioplasty, stenting, embolization)
- Non-vascular interventions (biopsies, drainages, ablations)
- Pre-procedure planning and imaging assessment
- Post-procedure monitoring and complications
- Radiation safety and dose optimization
- Patient selection criteria

Guidance Approach:
- Review pre-procedure imaging and indications
- Discuss technical approaches and equipment selection
- Identify potential complications and management
- Suggest post-procedure imaging protocols
- Emphasize safety protocols and contraindications
- Provide evidence-based recommendations

All recommendations must be verified by qualified interventional radiologists and appropriate clinical teams.`
  },
  {
    id: 'pediatric-radiology',
    name: 'Pediatric Radiology Specialist',
    category: 'Pediatric Radiology',
    description: 'Age-specific imaging considerations and pediatric radiology expertise',
    isDefault: false,
    prompt: `You are an AI assistant specializing in pediatric radiology with expertise in age-specific imaging considerations.

Pediatric Specializations:
- Age-appropriate normal anatomy and variants
- Growth and development imaging
- Pediatric trauma and non-accidental trauma
- Congenital anomalies and syndromes
- Pediatric oncology imaging
- Radiation dose optimization in children

Special Considerations:
- Age-specific protocols and techniques
- Sedation and motion artifact management
- Family-centered care approaches
- Growth chart correlations
- Developmental milestones assessment
- Child-specific pathology recognition

Always emphasize:
- ALARA principle (As Low As Reasonably Achievable) for radiation
- Age-appropriate imaging protocols
- Need for pediatric radiology subspecialty review
- Family communication considerations
- Multidisciplinary team coordination

Require verification by qualified pediatric radiologists for all recommendations.`
  }
];

export const RADIOLOGY_MODALITIES: { value: RadiologyModality; label: string }[] = [
  { value: 'CT', label: 'Computed Tomography (CT)' },
  { value: 'MRI', label: 'Magnetic Resonance Imaging (MRI)' },
  { value: 'X-Ray', label: 'Plain Radiography (X-Ray)' },
  { value: 'Ultrasound', label: 'Ultrasound' },
  { value: 'Nuclear Medicine', label: 'Nuclear Medicine' },
  { value: 'Interventional', label: 'Interventional Radiology' },
  { value: 'Mammography', label: 'Mammography' },
  { value: 'Other', label: 'Other Modality' }
];

export function getSystemPromptByCategory(category: RadiologyCategory): SystemPrompt {
  return RADIOLOGY_SYSTEM_PROMPTS.find(prompt => prompt.category === category) 
    || RADIOLOGY_SYSTEM_PROMPTS[0]; // Default to general radiology
}

export function getDefaultSystemPrompt(): SystemPrompt {
  return RADIOLOGY_SYSTEM_PROMPTS.find(prompt => prompt.isDefault) 
    || RADIOLOGY_SYSTEM_PROMPTS[0];
}

export function formatMessageForDisplay(message: Message): string {
  const timestamp = new Date(message.timestamp).toLocaleString();
  return `[${timestamp}] ${message.role === 'user' ? 'You' : 'AI Assistant'}: ${message.content}`;
}

export function generateCaseTitle(modality: RadiologyModality, description: string): string {
  const shortDesc = description.length > 50 
    ? description.substring(0, 50) + '...' 
    : description;
  return `${modality} - ${shortDesc}`;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Please upload a valid image file (JPEG, PNG, WebP, or TIFF)' 
    };
  }
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: 'Image file size must be less than 10MB' 
    };
  }
  
  return { valid: true };
}

export async function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function extractImageDataFromBase64(base64String: string): string {
  // Remove the data:image/[type];base64, prefix
  return base64String.split(',')[1] || base64String;
}

export function createImagePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function cleanupImagePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}

// Medical disclaimer text
export const MEDICAL_DISCLAIMER = `
⚠️ MEDICAL DISCLAIMER: This AI assistant provides educational and consultative support only. 
All imaging interpretations and clinical recommendations must be verified by qualified, 
licensed radiologists. Final diagnostic decisions should always incorporate complete clinical 
context, patient history, and additional imaging when appropriate. This tool does not 
replace professional medical judgment or clinical expertise.
`;

export function sanitizePatientData(text: string): string {
  // Basic sanitization - in production, implement comprehensive PHI removal
  return text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN-REDACTED]')
             .replace(/\b\d{10,}\b/g, '[ID-REDACTED]');
}