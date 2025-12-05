import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DollarSign, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const Fees: React.FC = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalDue: 0, totalPaid: 0, pending: 0, overdue: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [feesData, summaryData] = await Promise.all([
        api.getFees(),
        api.getFeesSummary(),
      ]);
      setFees(feesData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to load fees:', err);
    }
  };

  const handlePayFee = async (id: string) => {
    try {
      await api.updateFeeStatus(id, 'PAID');
      loadData();
    } catch (err) {
      alert('Failed to update fee');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle className="text-green-500" size={20} />;
      case 'OVERDUE': return <AlertCircle className="text-red-500" size={20} />;
      default: return <Clock className="text-yellow-500" size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-bold text-gray-900">Fee Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <DollarSign className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Paid</p>
            <p className="text-xl font-bold text-gray-900">${summary.totalPaid}</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <DollarSign className="text-red-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Due</p>
            <p className="text-xl font-bold text-gray-900">${summary.totalDue}</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 rounded-xl">
            <Clock className="text-yellow-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-bold text-gray-900">{summary.pending}</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Overdue</p>
            <p className="text-xl font-bold text-gray-900">{summary.overdue}</p>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Fee Records</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fees.map((fee) => (
                <tr key={fee.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{fee.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${fee.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      {getStatusIcon(fee.status)}
                      <span className="text-sm">{fee.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {fee.status !== 'PAID' && (
                      <Button size="sm" onClick={() => handlePayFee(fee.id)}>Pay Now</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
