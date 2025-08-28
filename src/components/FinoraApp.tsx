import React, { useState } from 'react';
import FinoraSidebar from './FinoraSidebar';
import FinoraSpendingPage from './FinoraSpendingPage';
import './ui/finora-theme.css';

export default function FinoraApp() {
  const [currentPage, setCurrentPage] = useState('analytics');

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background-primary)' }}>
      {/* Sidebar */}
      <FinoraSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      {/* Main Content */}
      <div className="flex-1 ml-20">
        {currentPage === 'analytics' && <FinoraSpendingPage />}
        {currentPage === 'dashboard' && (
          <div className="p-8">
            <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Dashboard
            </h1>
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
              Coming soon...
            </p>
          </div>
        )}
        {currentPage === 'transactions' && (
          <div className="p-8">
            <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Transactions
            </h1>
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
              Coming soon...
            </p>
          </div>
        )}
        {currentPage === 'products' && (
          <div className="p-8">
            <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Products
            </h1>
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
              Coming soon...
            </p>
          </div>
        )}
        {currentPage === 'customers' && (
          <div className="p-8">
            <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Customers
            </h1>
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
              Coming soon...
            </p>
          </div>
        )}
        {currentPage === 'calendar' && (
          <div className="p-8">
            <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Calendar
            </h1>
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
              Coming soon...
            </p>
          </div>
        )}
        {currentPage === 'favorites' && (
          <div className="p-8">
            <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Favorites
            </h1>
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
              Coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}