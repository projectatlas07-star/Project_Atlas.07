'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter, useParams } from 'next/navigation';
import { 
  STATUS_LABELS, 
  STATUS_COLORS, 
  SupplementStatus, 
  LineItem,
  LINE_ITEM_CATEGORIES,
  LINE_ITEM_UNITS 
} from '@/lib/supplements-workflow';

interface Supplement {
  id: string;
  supplementNumber: string;
  version: number;
  status: SupplementStatus;
  carrier: string | null;
  requestedAmount: number | null;
  approvedAmount: number | null;
  difference: number | null;
  lineItems: LineItem[];
  internalNotes: string | null;
  submissionDate: string | null;
  responseDate: string | null;
  approvalDate: string | null;
  denialReason: string | null;
  statusHistory: any[];
  revisionHistory: any[];
  createdAt: string;
  updatedAt: string;
  claimId: string;
  adjusterId: string | null;
  financialSummary?: any;
}

interface TransitionsResponse {
  currentStatus: SupplementStatus;
  currentStatusLabel: string;
  nextStatuses: Array<{
    value: SupplementStatus;
    label: string;
    color: string;
  }>;
}

export default function SupplementDetailPage() {
  const { session, loading } = useSupabase();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [supplement, setSupplement] = useState<Supplement | null>(null);
  const [transitions, setTransitions] = useState<TransitionsResponse | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showLineItemEditor, setShowLineItemEditor] = useState(false);
  const [status, setStatus] = useState('');
  const [reason, setReason] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    loadSupplement();
    loadTransitions();
  }, [session, router, id]);

  const loadSupplement = async () => {
    try {
      const data = await apiFetch<Supplement>(`/supplements/${id}`);
      setSupplement(data);
      setLineItems(data.lineItems || []);
    } catch (e: any) {
      setStatus(`Error loading: ${e.message}`);
    }
  };

  const loadTransitions = async () => {
    try {
      const data = await apiFetch<TransitionsResponse>(`/supplements/${id}/transitions`);
      setTransitions(data);
    } catch (e: any) {
      console.error('Error loading transitions:', e);
    }
  };

  const handleStatusChange = async () => {
    try {
      await apiFetch(`/supplements/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, reason }),
      });
      setStatus('Status updated');
      setShowStatusDialog(false);
      setStatus('');
      setReason('');
      loadSupplement();
      loadTransitions();
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const calculateLineItemTotal = (item: LineItem): number => {
    const subtotal = item.quantity * item.unitPrice;
    const tax = subtotal * (item.tax / 100);
    const depreciation = subtotal * (item.depreciation / 100);
    return subtotal + tax - depreciation;
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let tax = 0;
    let depreciation = 0;

    lineItems.forEach(item => {
      const itemSubtotal = item.quantity * item.unitPrice;
      subtotal += itemSubtotal;
      tax += itemSubtotal * (item.tax / 100);
      depreciation += itemSubtotal * (item.depreciation / 100);
    });

    const requestedAmount = subtotal + tax - depreciation;

    return {
      subtotal,
      tax,
      depreciation,
      requestedAmount,
    };
  };

  const handleSaveLineItems = async () => {
    try {
      const totals = calculateTotals();
      await apiFetch(`/supplements/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          lineItems,
          requestedAmount: totals.requestedAmount,
        }),
      });
      setStatus('Line items saved');
      setShowLineItemEditor(false);
      loadSupplement();
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: crypto.randomUUID(),
        description: '',
        category: 'Other',
        quantity: 1,
        unit: 'Each',
        unitPrice: 0,
        total: 0,
        depreciation: 0,
        tax: 0,
      },
    ]);
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    
    // Recalculate total
    if (field === 'quantity' || field === 'unitPrice' || field === 'tax' || field === 'depreciation') {
      updated[index].total = calculateLineItemTotal(updated[index]);
    }
    
    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleGenerateAISupplement = async () => {
    try {
      setIsGenerating(true);
      const data = await apiFetch<{ recommendations: any; draft: any }>('/ai-supplements/generate', {
        method: 'POST',
        body: JSON.stringify({ supplementId: id }),
      });
      if (data && data.recommendations) {
        setAiRecommendations(data.recommendations);
        setShowAIDialog(true);
      }
    } catch (e: any) {
      setStatus(`Error generating AI supplement: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptAIRecommendations = async () => {
    try {
      // Convert AI recommendations to line items
      const newLineItems = aiRecommendations.recommendedLineItems.map((item: any) => ({
        id: crypto.randomUUID(),
        description: item.description,
        category: item.category,
        quantity: item.suggestedQuantity,
        unit: item.suggestedUnit,
        unitPrice: item.suggestedUnitPrice,
        total: item.suggestedTotalPrice,
        depreciation: 0,
        tax: 0,
      }));

      setLineItems(newLineItems);
      setShowAIDialog(false);
      setStatus('AI recommendations applied. Review and save.');
    } catch (e: any) {
      setStatus(`Error applying recommendations: ${e.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!session) return null;
  if (!supplement) return <p>Loading supplement...</p>;

  const totals = calculateTotals();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {supplement.supplementNumber} (v{supplement.version})
          </h1>
          <p className="text-sm text-gray-600">
            Created: {new Date(supplement.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGenerateAISupplement}
            disabled={isGenerating}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate AI Supplement'}
          </button>
          <button
            onClick={() => setShowLineItemEditor(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Line Items
          </button>
          <button
            onClick={() => setShowStatusDialog(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Change Status
          </button>
        </div>
      </div>

      {status && <p className="mb-4 text-sm text-gray-600">{status}</p>}

      {/* Status and Carrier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <span className={`px-3 py-2 rounded text-sm font-medium ${STATUS_COLORS[supplement.status]}`}>
            {STATUS_LABELS[supplement.status]}
          </span>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Carrier</h2>
          <p className="text-gray-900">{supplement.carrier || 'Not specified'}</p>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Claim ID</h2>
          <a 
            href={`/admin/claims/${supplement.claimId}`}
            className="text-blue-600 hover:text-blue-800"
          >
            {supplement.claimId}
          </a>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Financial Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="text-xl font-bold">${totals.subtotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tax</p>
            <p className="text-xl font-bold">${totals.tax.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Depreciation</p>
            <p className="text-xl font-bold text-red-600">-${totals.depreciation.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Requested Amount</p>
            <p className="text-xl font-bold text-green-600">${totals.requestedAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Approved Amount</p>
            <p className="text-xl font-bold">${supplement.approvedAmount?.toFixed(2) || '0.00'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Difference</p>
            <p className={`text-xl font-bold ${supplement.difference && supplement.difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${supplement.difference?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Outstanding</p>
            <p className="text-xl font-bold text-orange-600">
              ${(supplement.requestedAmount || 0) - (supplement.approvedAmount || 0) > 0 
                ? ((supplement.requestedAmount || 0) - (supplement.approvedAmount || 0)).toFixed(2)
                : '0.00'}
            </p>
          </div>
        </div>
      </div>

      {/* Important Dates */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Important Dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Submission Date</p>
            <p className="text-gray-900">
              {supplement.submissionDate ? new Date(supplement.submissionDate).toLocaleDateString() : 'Not submitted'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Response Date</p>
            <p className="text-gray-900">
              {supplement.responseDate ? new Date(supplement.responseDate).toLocaleDateString() : 'Pending'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Approval Date</p>
            <p className="text-gray-900">
              {supplement.approvalDate ? new Date(supplement.approvalDate).toLocaleDateString() : 'Not approved'}
            </p>
          </div>
        </div>
        {supplement.denialReason && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Denial Reason</p>
            <p className="text-red-600">{supplement.denialReason}</p>
          </div>
        )}
      </div>

      {/* Line Items */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Line Items ({lineItems.length})</h2>
        {lineItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax %</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Depr %</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lineItems.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.unit}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.tax}%</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.depreciation}%</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No line items added yet</p>
        )}
      </div>

      {/* Status History */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Status History</h2>
        {supplement.statusHistory && supplement.statusHistory.length > 0 ? (
          <div className="space-y-3">
            {supplement.statusHistory.map((entry: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[entry.status as SupplementStatus]}`}>
                      {STATUS_LABELS[entry.status as SupplementStatus]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {entry.userName && (
                    <p className="text-xs text-gray-600 mt-1">by {entry.userName}</p>
                  )}
                  {entry.reason && (
                    <p className="text-xs text-gray-600 mt-1">Reason: {entry.reason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No status history available</p>
        )}
      </div>

      {/* Internal Notes */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Internal Notes</h2>
        <p className="text-gray-900 whitespace-pre-wrap">
          {supplement.internalNotes || 'No internal notes'}
        </p>
      </div>

      {/* Status Change Dialog */}
      {showStatusDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Change Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded"
                  aria-label="Select new status"
                >
                  <option value="">Select status...</option>
                  {transitions?.nextStatuses.map((transition) => (
                    <option key={transition.value} value={transition.value}>
                      {transition.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Enter reason for status change..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowStatusDialog(false);
                    setStatus('');
                    setReason('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  disabled={!status}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Change Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Line Item Editor Dialog */}
      {showLineItemEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 my-8">
            <h3 className="text-lg font-semibold mb-4">Edit Line Items</h3>
            <div className="mb-4">
              <button
                onClick={addLineItem}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Line Item
              </button>
            </div>
            <div className="overflow-x-auto mb-4 max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tax %</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Depr %</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lineItems.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          className="w-full p-1 border rounded text-sm"
                          placeholder="Description"
                          aria-label={`Line item ${index + 1} description`}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <select
                          value={item.category}
                          onChange={(e) => updateLineItem(index, 'category', e.target.value)}
                          className="w-full p-1 border rounded text-sm"
                          aria-label={`Line item ${index + 1} category`}
                        >
                          {LINE_ITEM_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full p-1 border rounded text-sm"
                          min="0"
                          placeholder="Qty"
                          aria-label={`Line item ${index + 1} quantity`}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <select
                          value={item.unit}
                          onChange={(e) => updateLineItem(index, 'unit', e.target.value)}
                          className="w-full p-1 border rounded text-sm"
                          aria-label={`Line item ${index + 1} unit`}
                        >
                          {LINE_ITEM_UNITS.map((unit) => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full p-1 border rounded text-sm"
                          min="0"
                          step="0.01"
                          placeholder="Price"
                          aria-label={`Line item ${index + 1} unit price`}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={item.tax}
                          onChange={(e) => updateLineItem(index, 'tax', parseFloat(e.target.value) || 0)}
                          className="w-full p-1 border rounded text-sm"
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="Tax %"
                          aria-label={`Line item ${index + 1} tax percentage`}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={item.depreciation}
                          onChange={(e) => updateLineItem(index, 'depreciation', parseFloat(e.target.value) || 0)}
                          className="w-full p-1 border rounded text-sm"
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="Depr %"
                          aria-label={`Line item ${index + 1} depreciation percentage`}
                        />
                      </td>
                      <td className="px-2 py-2 text-sm font-medium">
                        ${item.total.toFixed(2)}
                      </td>
                      <td className="px-2 py-2">
                        <button
                          onClick={() => removeLineItem(index)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 p-4 rounded mb-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="font-bold">${totals.subtotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tax</p>
                  <p className="font-bold">${totals.tax.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Depreciation</p>
                  <p className="font-bold text-red-600">-${totals.depreciation.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-bold text-green-600">${totals.requestedAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowLineItemEditor(false);
                  setLineItems(supplement.lineItems || []);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLineItems}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Line Items
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations Dialog */}
      {showAIDialog && aiRecommendations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">AI Supplement Recommendations</h2>
              <button
                onClick={() => setShowAIDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Confidence and Risk Scores */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-gray-600">Confidence Score</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(aiRecommendations.confidenceScore * 100)}%
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded">
                <p className="text-sm text-gray-600">Risk Score</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(aiRecommendations.riskScore * 100)}%
                </p>
              </div>
            </div>

            {/* Supporting Justification */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Supporting Justification</h3>
              <p className="text-gray-700">{aiRecommendations.supportingJustification}</p>
            </div>

            {/* Recommended Line Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Recommended Line Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {aiRecommendations.recommendedLineItems.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">{item.description}</td>
                        <td className="px-4 py-2 text-sm">{item.category}</td>
                        <td className="px-4 py-2 text-sm">{item.suggestedQuantity}</td>
                        <td className="px-4 py-2 text-sm">{item.suggestedUnit}</td>
                        <td className="px-4 py-2 text-sm">${item.suggestedUnitPrice.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm font-medium">${item.suggestedTotalPrice.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.confidence > 0.8 ? 'bg-green-100 text-green-800' :
                            item.confidence > 0.5 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {Math.round(item.confidence * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Missing Damage Observations */}
            {aiRecommendations.missingDamageObservations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Missing Damage Observations</h3>
                <ul className="space-y-2">
                  {aiRecommendations.missingDamageObservations.map((obs: any, index: number) => (
                    <li key={index} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">{obs.location}</p>
                      <p className="text-sm text-gray-600">{obs.description}</p>
                      <p className="text-xs text-gray-500">Severity: {obs.severity} | Confidence: {Math.round(obs.confidence * 100)}%</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Information */}
            {aiRecommendations.missingInformation.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Missing Information</h3>
                <ul className="space-y-2">
                  {aiRecommendations.missingInformation.map((item: any, index: number) => (
                    <li key={index} className="bg-yellow-50 p-3 rounded">
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-gray-600">Impact: {item.impact} | Source: {item.source}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Documentation Checklist */}
            {aiRecommendations.documentationChecklist.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Documentation Checklist</h3>
                <ul className="space-y-2">
                  {aiRecommendations.documentationChecklist.map((item: any, index: number) => (
                    <li key={index} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-gray-600">Type: {item.type} | Status: {item.status}</p>
                      <p className="text-xs text-gray-500">{item.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {aiRecommendations.warnings.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Warnings</h3>
                <ul className="space-y-2">
                  {aiRecommendations.warnings.map((warning: string, index: number) => (
                    <li key={index} className="bg-red-50 p-3 rounded text-red-800">
                      ⚠️ {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Explanation */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">AI Explanation</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p className="mb-2"><strong>Overall Approach:</strong> {aiRecommendations.aiExplanation.overallApproach}</p>
                <p className="mb-2"><strong>Data Sources Analyzed:</strong> {aiRecommendations.aiExplanation.dataSourcesAnalyzed.join(', ')}</p>
                <p className="mb-2"><strong>Confidence Factors:</strong> {aiRecommendations.aiExplanation.confidenceFactors.join(', ')}</p>
                <p className="mb-2"><strong>Limitations:</strong> {aiRecommendations.aiExplanation.limitations.join(', ')}</p>
                <p><strong>Recommendations:</strong> {aiRecommendations.aiExplanation.recommendations.join(', ')}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAIDialog(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Reject
              </button>
              <button
                onClick={handleAcceptAIRecommendations}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Accept & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
