import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Loader2 
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import api from '../services/api';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ImportResult {
  success: boolean;
  message: string;
  imported: number;
  total: number;
  errors?: string[];
}

export default function CSVImportModal({ isOpen, onClose, onSuccess }: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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

  const uploadCSV = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await api.post('/api/csv/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
      if (response.data.success) {
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      }

    } catch (error: any) {
      console.error('CSV upload error:', error);
      setResult({
        success: false,
        message: error.response?.data?.error || 'Failed to upload CSV file',
        imported: 0,
        total: 0,
        errors: error.response?.data?.details ? [error.response.data.details] : undefined,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Import Transactions from CSV</h2>
            <p className="text-sm text-gray-600 mt-1">Upload a CSV file from your bank or financial institution</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
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
                    Drop your CSV file here, or browse
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Supports CSV files up to 5MB
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
                    <Button onClick={uploadCSV} disabled={uploading}>
                      {uploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Importing...
                        </>
                      ) : (
                        'Import Transactions'
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setFile(null)}
                      disabled={uploading}
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
                    {result.success ? 'Import Successful!' : 'Import Failed'}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message}
                  </p>
                  
                  {result.success && (
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>✅ Imported: {result.imported} transactions</p>
                      <p>📄 Total rows processed: {result.total}</p>
                    </div>
                  )}

                  {result.errors && result.errors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Issues found:</h4>
                      <div className="text-sm text-gray-700 space-y-1 max-h-32 overflow-y-auto">
                        {result.errors.slice(0, 10).map((error, index) => (
                          <p key={index} className="text-red-600">• {error}</p>
                        ))}
                        {result.errors.length > 10 && (
                          <p className="text-gray-500">... and {result.errors.length - 10} more</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* CSV Format Help */}
          <Card className="p-4 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-3">Supported CSV Formats</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>✅ Bank CSV (no headers):</strong> Date, Amount, Flag, Empty, Description</p>
              <p><strong>✅ Standard CSV (with headers):</strong> Date, Description, Amount, Category</p>
              <p><strong>Amount format:</strong> Positive for income, negative for expenses</p>
              <p><strong>Date format:</strong> MM/DD/YYYY, DD/MM/YYYY, or YYYY-MM-DD</p>
              <p><strong>Auto-categorization:</strong> Transactions are automatically categorized based on description</p>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <strong>Bank CSV Example:</strong><br/>
              "08/21/2025","-200.00","*","","VENMO PAYMENT 250821 1044319145258 YUVAL LAVI"<br/>
              "08/15/2025","1193.04","*","","DUBBING DIR DEP 081525 00002118 LAVI YUVAL"
            </div>
          </Card>

          {/* Action Buttons */}
          {result && (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              {result.success && (
                <Button onClick={() => { onSuccess(); handleClose(); }}>
                  View Dashboard
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}