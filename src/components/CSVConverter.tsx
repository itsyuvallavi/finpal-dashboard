import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  ArrowRight,
  CheckCircle, 
  AlertCircle, 
  X,
  Loader2 
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface CSVConverterProps {
  isOpen: boolean;
  onClose: () => void;
  onConversionComplete: (convertedFile: File) => void;
}

interface ConversionResult {
  success: boolean;
  message: string;
  processedRows: number;
  downloadUrl?: string;
  fileName?: string;
}

export default function CSVConverter({ isOpen, onClose, onConversionComplete }: CSVConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Auto-categorization logic (same as backend)
  const categorizeTransaction = (description: string): string => {
    const desc = description.toLowerCase();
    
    // Income/Deposits
    if (desc.includes('deposit') || desc.includes('payroll') || desc.includes('salary') || 
        desc.includes('refund') || desc.includes('dir dep') || desc.includes('direct deposit') ||
        desc.includes('venmo cashout') || desc.includes('cash out') || desc.includes('zelle from') ||
        desc.includes('bill_pay') && desc.includes('igloo') || desc.includes('treas 310')) {
      return 'Income';
    }
    
    // Subscriptions & Digital Services
    if (desc.includes('apple.com') || desc.includes('netflix') || desc.includes('spotify') || 
        desc.includes('amazon prime') || desc.includes('subscription') || desc.includes('recurring payment') ||
        desc.includes('windscribe') || desc.includes('adobe') || desc.includes('microsoft') ||
        desc.includes('distrokid')) {
      return 'Subscriptions';
    }
    
    // Insurance
    if (desc.includes('insurance') || desc.includes('lemonade') || desc.includes('geico') || 
        desc.includes('state farm') || desc.includes('progressive')) {
      return 'Insurance';
    }
    
    // Transfers & Payments
    if (desc.includes('venmo payment') || desc.includes('zelle') || desc.includes('paypal') || 
        desc.includes('online pymt') || desc.includes('online payment') || desc.includes('transfer') ||
        desc.includes('bilt') || desc.includes('rent pmt') || desc.includes('credit card') ||
        desc.includes('auto pay') || desc.includes('applecard') || desc.includes('wells fargo card')) {
      return 'Transfers';
    }
    
    // Food & Dining
    if (desc.includes('restaurant') || desc.includes('mcdonalds') || desc.includes('starbucks') || 
        desc.includes('pizza') || desc.includes('food') || desc.includes('dining') || 
        desc.includes('cafe') || desc.includes('burger') || desc.includes('coffee') ||
        desc.includes('doordash') || desc.includes('uber eats') || desc.includes('grubhub')) {
      return 'Food & Dining';
    }
    
    // Transportation
    if (desc.includes('gas') || desc.includes('fuel') || desc.includes('uber') || 
        desc.includes('lyft') || desc.includes('taxi') || desc.includes('parking') ||
        desc.includes('metro') || desc.includes('bus') || desc.includes('train')) {
      return 'Transportation';
    }
    
    // Groceries
    if (desc.includes('grocery') || desc.includes('market') || desc.includes('safeway') || 
        desc.includes('walmart') || desc.includes('target') || desc.includes('kroger') ||
        desc.includes('whole foods') || desc.includes('costco')) {
      return 'Groceries';
    }
    
    // Utilities
    if (desc.includes('electric') || desc.includes('gas bill') || desc.includes('water') || 
        desc.includes('internet') || desc.includes('phone') || desc.includes('utility')) {
      return 'Utilities';
    }
    
    // Entertainment
    if (desc.includes('movie') || desc.includes('theater') || desc.includes('entertainment') || 
        desc.includes('game') || desc.includes('steam') || desc.includes('xbox') ||
        desc.includes('playstation') || desc.includes('nintendo')) {
      return 'Entertainment';
    }
    
    // Shopping
    if (desc.includes('amazon') || desc.includes('shopping') || desc.includes('store') || 
        desc.includes('retail') || desc.includes('purchase authorized')) {
      return 'Shopping';
    }
    
    // Healthcare
    if (desc.includes('pharmacy') || desc.includes('medical') || desc.includes('doctor') || 
        desc.includes('hospital') || desc.includes('health') || desc.includes('cvs') ||
        desc.includes('walgreens')) {
      return 'Healthcare';
    }
    
    // ATM/Cash
    if (desc.includes('atm') || desc.includes('cash') || desc.includes('withdrawal')) {
      return 'Cash';
    }
    
    return 'Other';
  };

  // Extract location from description
  const extractLocation = (description: string): string => {
    const desc = description.toLowerCase();
    
    // Extract location patterns from common transaction descriptions
    if (desc.includes(' ca ') || desc.includes(' california ')) {
      const match = description.match(/\s([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+CA\s/i);
      if (match) return match[1];
    }
    
    if (desc.includes(' ny ') || desc.includes(' new york ')) {
      const match = description.match(/\s([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+NY\s/i);
      if (match) return match[1];
    }
    
    // ATM locations
    if (desc.includes('atm')) {
      const match = description.match(/ATM.*?(\d+\s+[^0-9]+(?:[A-Z][a-z]+\s+)*[A-Z][a-z]+)/i);
      if (match) return match[1];
    }
    
    return '';
  };

  // Determine payment method from description
  const getPaymentMethod = (description: string): string => {
    const desc = description.toLowerCase();
    
    if (desc.includes('card 9185') || desc.includes('purchase authorized') || desc.includes('recurring payment authorized')) {
      return 'Credit Card';
    }
    if (desc.includes('atm')) return 'ATM';
    if (desc.includes('venmo')) return 'Venmo';
    if (desc.includes('zelle')) return 'Zelle';
    if (desc.includes('dir dep') || desc.includes('direct deposit') || desc.includes('payroll')) return 'Direct Deposit';
    if (desc.includes('online pymt') || desc.includes('auto pay')) return 'Online Payment';
    if (desc.includes('mobile deposit')) return 'Mobile Deposit';
    
    return 'Bank Transfer';
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }
    
    setFile(selectedFile);
    setResult(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const convertCSV = async () => {
    if (!file) return;

    setConverting(true);
    setResult(null);

    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      
      if (lines.length === 0) {
        throw new Error('CSV file is empty');
      }

      // Check if it's bank format (no headers, 5 columns with quotes)
      const firstLine = lines[0];
      const isWellsFargoFormat = firstLine.startsWith('"') && firstLine.split('","').length === 5;

      if (!isWellsFargoFormat) {
        throw new Error('This converter is designed for Wells Fargo CSV format (5 columns with quotes)');
      }

      // Convert each line
      const convertedLines = ['Date,Description,Amount,Category,Location,Payment Method']; // Header
      let processedCount = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        try {
          // Parse Wells Fargo format: "Date","Amount","Flag","Empty","Description"
          const columns = line.split('","');
          if (columns.length !== 5) continue;

          // Clean up the columns (remove quotes)
          const date = columns[0].replace(/^"|"$/g, '');
          const amount = columns[1].replace(/^"|"$/g, '');
          const description = columns[4].replace(/^"|"$/g, '');

          // Skip if essential data is missing
          if (!date || !amount || !description) continue;

          // Auto-categorize
          const category = categorizeTransaction(description);
          const location = extractLocation(description);
          const paymentMethod = getPaymentMethod(description);

          // Format the converted line
          const convertedLine = [
            date,
            `"${description}"`,
            amount,
            category,
            location ? `"${location}"` : '',
            paymentMethod
          ].join(',');

          convertedLines.push(convertedLine);
          processedCount++;

        } catch (error) {
          console.warn(`Skipping line ${i + 1}: ${error}`);
        }
      }

      if (processedCount === 0) {
        throw new Error('No valid transactions found in the CSV file');
      }

      // Create the converted CSV content
      const convertedContent = convertedLines.join('\n');
      
      // Create a blob and download URL
      const blob = new Blob([convertedContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const fileName = `converted-${file.name}`;

      // Create a File object for upload
      const convertedFile = new File([blob], fileName, { type: 'text/csv' });

      setResult({
        success: true,
        message: `Successfully converted ${processedCount} transactions!`,
        processedRows: processedCount,
        downloadUrl: url,
        fileName: fileName
      });

      // Automatically trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();

      // Also pass the converted file to parent for immediate upload
      setTimeout(() => {
        onConversionComplete(convertedFile);
      }, 1000);

    } catch (error: any) {
      console.error('Conversion error:', error);
      setResult({
        success: false,
        message: error.message || 'Failed to convert CSV file',
        processedRows: 0
      });
    } finally {
      setConverting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setConverting(false);
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Convert Bank CSV</h2>
            <p className="text-sm text-gray-600 mt-1">Transform your bank's CSV format into a standard format</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Conversion Flow Diagram */}
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="text-center">
              <FileText size={24} className="mx-auto text-red-500 mb-1" />
              <span className="text-gray-600">Bank CSV</span>
              <p className="text-xs text-gray-500">5 columns, quoted</p>
            </div>
            <ArrowRight size={20} className="text-gray-400" />
            <div className="text-center">
              <FileText size={24} className="mx-auto text-green-500 mb-1" />
              <span className="text-gray-600">Standard CSV</span>
              <p className="text-xs text-gray-500">With headers & categories</p>
            </div>
          </div>

          {/* File Upload Area */}
          {!result && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              {!file ? (
                <>
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Drop your bank CSV file here, or browse
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Wells Fargo format: Date, Amount, Flag, Empty, Description
                  </p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Browse Files
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <FileText size={48} className="mx-auto text-blue-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">{file.name}</h3>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={convertCSV} disabled={converting}>
                      {converting ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Converting...
                        </>
                      ) : (
                        'Convert to Standard Format'
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setFile(null)}
                      disabled={converting}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {result && (
            <Card className="p-6">
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className={`font-medium mb-2 ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {result.success ? 'Conversion Successful!' : 'Conversion Failed'}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message}
                  </p>
                  
                  {result.success && (
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>✅ Processed: {result.processedRows} transactions</p>
                      <p>📁 File: {result.fileName}</p>
                      <p>🎯 Auto-categorized with location and payment method detection</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Format Information */}
          <Card className="p-4 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-3">What this converter does:</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>✨ Auto-categorization:</strong> Venmo → Transfers, Payroll → Income, Apple → Subscriptions</p>
              <p><strong>📍 Location extraction:</strong> Finds store/city names from descriptions</p>
              <p><strong>💳 Payment method detection:</strong> Credit Card, ATM, Venmo, etc.</p>
              <p><strong>📊 Standard format:</strong> Date, Description, Amount, Category, Location, Payment Method</p>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <strong>Result format:</strong> 01/25/2025,"VENMO PAYMENT",-200.00,Transfers,"",Venmo
            </div>
          </Card>

          {/* Action Buttons */}
          {result && (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              {result.success && result.downloadUrl && (
                <Button asChild>
                  <a href={result.downloadUrl} download={result.fileName}>
                    <Download size={16} className="mr-2" />
                    Download Again
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}