'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  AI Radiology Chat
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Professional Imaging Assistant
                </p>
              </div>
            </div>
            <Link href="/chat">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Consulting
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Advanced AI Assistant for
              <span className="text-blue-600 dark:text-blue-400"> Radiology</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Enhance your diagnostic workflow with specialized AI support for medical imaging interpretation, 
              case analysis, and clinical decision-making. Designed by radiologists, for radiologists.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/chat">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  Launch Chat Interface
                </Button>
              </Link>
              <Link href="/cases">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Manage Cases
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white/30 dark:bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Professional Radiology Features
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Comprehensive AI support tailored to radiology workflows and clinical practice
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <CardTitle className="text-xl">Intelligent Image Analysis</CardTitle>
                <CardDescription>
                  Advanced multimodal AI for medical image interpretation with contextual analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• CT, MRI, X-Ray support</li>
                  <li>• DICOM-ready workflow</li>
                  <li>• Structured reporting</li>
                  <li>• Differential diagnosis support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🩺</span>
                </div>
                <CardTitle className="text-xl">Specialized Prompts</CardTitle>
                <CardDescription>
                  Pre-configured AI prompts optimized for different radiology subspecialties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">CT Interpretation</Badge>
                  <Badge variant="secondary">MRI Analysis</Badge>
                  <Badge variant="secondary">X-Ray Review</Badge>
                  <Badge variant="secondary">Interventional</Badge>
                  <Badge variant="secondary">Pediatric</Badge>
                  <Badge variant="secondary">Emergency</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <CardTitle className="text-xl">Case Management</CardTitle>
                <CardDescription>
                  Organize, document, and review radiology cases with integrated AI insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Case history tracking</li>
                  <li>• Report generation</li>
                  <li>• Export capabilities</li>
                  <li>• Search and organization</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
              Built for Clinical Excellence
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-left">
                <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  AI Technology
                </h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>• Claude 3.5 Sonnet for advanced reasoning</li>
                  <li>• Multimodal image + text analysis</li>
                  <li>• Medical knowledge optimization</li>
                  <li>• Real-time response generation</li>
                </ul>
              </div>
              <div className="text-left">
                <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Clinical Features
                </h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>• HIPAA-conscious design</li>
                  <li>• Medical disclaimer integration</li>
                  <li>• Professional interface</li>
                  <li>• Evidence-based responses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="py-12 bg-amber-50 dark:bg-amber-950/20 border-t border-amber-200 dark:border-amber-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl text-amber-600 dark:text-amber-400 mr-3">⚠️</span>
              <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
                Medical Disclaimer
              </h4>
            </div>
            <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
              This AI assistant provides educational and consultative support only. All imaging interpretations 
              and clinical recommendations must be verified by qualified, licensed radiologists. Final diagnostic 
              decisions should always incorporate complete clinical context, patient history, and additional 
              imaging when appropriate. This tool does not replace professional medical judgment or clinical expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            AI Radiology Chat - Professional Medical Imaging Assistant
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
            Designed for healthcare professionals • Educational use only
          </p>
        </div>
      </footer>
    </div>
  );
}