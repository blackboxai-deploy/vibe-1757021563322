'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCases } from '@/hooks/use-cases';

export default function CasesPage() {
  const { cases, isLoading, createCase, deleteCase, exportCase } = useCases();
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const handleCreateSampleCase = async () => {
    await createCase({
      title: 'Sample CT Chest Case',
      description: 'Patient presents with chest pain and shortness of breath',
      modality: 'CT',
      findings: 'Bilateral lower lobe consolidation with air bronchograms',
      impression: 'Findings consistent with bilateral pneumonia',
      status: 'Draft'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AI</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Radiology Cases
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Case Management & Documentation
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/chat">
                <Button variant="outline" size="sm">
                  Chat Interface
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Radiology Cases
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Manage and organize your radiology cases with AI-powered insights
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleCreateSampleCase}
                disabled={isLoading}
                variant="outline"
              >
                Create Sample Case
              </Button>
              <Link href="/chat">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  New Consultation
                </Button>
              </Link>
            </div>
          </div>

          {/* Cases Grid */}
          {cases.length === 0 ? (
            <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No Cases Yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  Start by creating a case or begin a new AI consultation session. Your cases will be automatically organized here.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button 
                    onClick={handleCreateSampleCase}
                    disabled={isLoading}
                    variant="outline"
                  >
                    {isLoading ? 'Creating...' : 'Create Sample Case'}
                  </Button>
                  <Link href="/chat">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Start Consultation
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((radiologyCase) => (
                <Card 
                  key={radiologyCase.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCase === radiologyCase.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedCase(radiologyCase.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 line-clamp-2">
                          {radiologyCase.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {radiologyCase.modality}
                          </Badge>
                          <Badge 
                            variant={radiologyCase.status === 'Completed' ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {radiologyCase.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-3">
                      {radiologyCase.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {/* Findings */}
                      {radiologyCase.findings && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                            Findings
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {radiologyCase.findings}
                          </p>
                        </div>
                      )}
                      
                      {/* Impression */}
                      {radiologyCase.impression && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                            Impression
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {radiologyCase.impression}
                          </p>
                        </div>
                      )}

                      {/* Images */}
                      {radiologyCase.images.length > 0 && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                          <span>📷</span>
                          <span>{radiologyCase.images.length} image{radiologyCase.images.length > 1 ? 's' : ''}</span>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Created {formatDate(radiologyCase.createdAt.toISOString())}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            exportCase(radiologyCase.id, 'json');
                          }}
                          className="text-xs"
                        >
                          Export JSON
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            exportCase(radiologyCase.id, 'pdf');
                          }}
                          className="text-xs"
                        >
                          Export Report
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this case?')) {
                              deleteCase(radiologyCase.id);
                            }
                          }}
                          className="text-xs ml-auto"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Statistics */}
          {cases.length > 0 && (
            <div className="mt-12 grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {cases.length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Total Cases
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {cases.filter(c => c.status === 'Completed').length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Completed
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {cases.filter(c => c.status === 'In Progress').length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    In Progress
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                    {cases.reduce((sum, c) => sum + c.images.length, 0)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Images
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}