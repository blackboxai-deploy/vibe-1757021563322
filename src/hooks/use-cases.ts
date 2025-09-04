'use client';

import { useState, useCallback, useEffect } from 'react';
import { RadiologyCase } from '@/lib/types';

export function useCases() {
  const [cases, setCases] = useState<RadiologyCase[]>([]);
  const [currentCase, setCurrentCase] = useState<RadiologyCase | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cases from localStorage on mount
  useEffect(() => {
    const savedCases = localStorage.getItem('radiology-cases');
    if (savedCases) {
      try {
        const parsedCases = JSON.parse(savedCases).map((caseData: any) => ({
          ...caseData,
          createdAt: new Date(caseData.createdAt),
          updatedAt: new Date(caseData.updatedAt)
        }));
        setCases(parsedCases);
      } catch (err) {
        console.error('Failed to load cases:', err);
      }
    }
  }, []);

  // Save cases to localStorage whenever cases change
  useEffect(() => {
    if (cases.length > 0) {
      localStorage.setItem('radiology-cases', JSON.stringify(cases));
    }
  }, [cases]);

  const createCase = useCallback(async (caseData: Partial<RadiologyCase>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newCase: RadiologyCase = {
        id: `case-${Date.now()}`,
        patientId: caseData.patientId || '',
        title: caseData.title || 'Untitled Case',
        description: caseData.description || '',
        modality: caseData.modality || 'Other',
        findings: caseData.findings || '',
        impression: caseData.impression || '',
        chatSessionId: caseData.chatSessionId || '',
        images: caseData.images || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        status: caseData.status || 'Draft'
      };

      setCases(prev => [...prev, newCase]);
      setCurrentCase(newCase);
    } catch (err) {
      console.error('Failed to create case:', err);
      setError(err instanceof Error ? err.message : 'Failed to create case');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCase = useCallback(async (caseId: string, updates: Partial<RadiologyCase>) => {
    setIsLoading(true);
    setError(null);

    try {
      setCases(prev => prev.map(caseItem => 
        caseItem.id === caseId 
          ? { ...caseItem, ...updates, updatedAt: new Date() }
          : caseItem
      ));

      if (currentCase?.id === caseId) {
        setCurrentCase(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
      }
    } catch (err) {
      console.error('Failed to update case:', err);
      setError(err instanceof Error ? err.message : 'Failed to update case');
    } finally {
      setIsLoading(false);
    }
  }, [currentCase]);

  const deleteCase = useCallback(async (caseId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      setCases(prev => prev.filter(caseItem => caseItem.id !== caseId));
      
      if (currentCase?.id === caseId) {
        setCurrentCase(null);
      }
    } catch (err) {
      console.error('Failed to delete case:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete case');
    } finally {
      setIsLoading(false);
    }
  }, [currentCase]);

  const loadCase = useCallback(async (caseId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const caseToLoad = cases.find(c => c.id === caseId);
      if (caseToLoad) {
        setCurrentCase(caseToLoad);
      } else {
        throw new Error('Case not found');
      }
    } catch (err) {
      console.error('Failed to load case:', err);
      setError(err instanceof Error ? err.message : 'Failed to load case');
    } finally {
      setIsLoading(false);
    }
  }, [cases]);

  const exportCase = useCallback(async (caseId: string, format: 'pdf' | 'json') => {
    setIsLoading(true);
    setError(null);

    try {
      const caseToExport = cases.find(c => c.id === caseId);
      if (!caseToExport) {
        throw new Error('Case not found');
      }

      if (format === 'json') {
        const dataStr = JSON.stringify(caseToExport, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `${caseToExport.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      } else if (format === 'pdf') {
        // For now, create a formatted text export
        // In production, you'd want to use a PDF library
        const reportText = generateCaseReport(caseToExport);
        const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportText);
        
        const exportFileDefaultName = `${caseToExport.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.txt`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      }
    } catch (err) {
      console.error('Failed to export case:', err);
      setError(err instanceof Error ? err.message : 'Failed to export case');
    } finally {
      setIsLoading(false);
    }
  }, [cases]);

  return {
    cases,
    currentCase,
    isLoading,
    error,
    createCase,
    updateCase,
    deleteCase,
    loadCase,
    exportCase
  };
}

function generateCaseReport(radiologyCase: RadiologyCase): string {
  const formattedDate = radiologyCase.createdAt.toLocaleDateString();
  const formattedTime = radiologyCase.createdAt.toLocaleTimeString();
  
  return `
RADIOLOGY CASE REPORT
=====================

Case ID: ${radiologyCase.id}
Patient ID: ${radiologyCase.patientId || 'Not specified'}
Date Created: ${formattedDate} ${formattedTime}
Status: ${radiologyCase.status}

CASE DETAILS
------------
Title: ${radiologyCase.title}
Modality: ${radiologyCase.modality}

Description:
${radiologyCase.description}

FINDINGS
--------
${radiologyCase.findings || 'No findings recorded'}

IMPRESSION
----------
${radiologyCase.impression || 'No impression recorded'}

IMAGES
------
${radiologyCase.images.length} image(s) associated with this case

METADATA
--------
Created: ${radiologyCase.createdAt.toISOString()}
Last Updated: ${radiologyCase.updatedAt.toISOString()}
Chat Session ID: ${radiologyCase.chatSessionId}

---
Report generated by AI Radiology Chat App
Generated on: ${new Date().toISOString()}

DISCLAIMER: This report is generated by an AI assistant for educational 
and consultative purposes only. All interpretations should be verified 
by qualified radiologists and incorporated with complete clinical context.
`;
}