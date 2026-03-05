import { useState } from 'react';
import type { ReactNode, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shallow } from 'zustand/shallow';
import {
  Plus, Search, Filter, Mail, Phone, Calendar,
  MoreVertical, Edit2, Trash2, TrendingUp, CheckCircle2,
  XCircle, FileText, Target, AlertCircle
} from 'lucide-react';
import { useStore, selectFilteredLeads } from '../store/useStore.ts';
import { Lead, LeadStatus } from '../types';

const statusConfig: Record<LeadStatus, { label: string; color: string; icon: ReactNode }> = {
  new: { label: 'New Lead', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: <AlertCircle size={14} /> },
  contacted: { label: 'Contacted', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: <Phone size={14} /> },
  qualified: { label: 'Qualified', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', icon: <Target size={14} /> },
  proposal: { label: 'Proposal Sent', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: <FileText size={14} /> },
  negotiation: { label: 'Negotiation', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: <TrendingUp size={14} /> },
  won: { label: 'Won', color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: <CheckCircle2 size={14} /> },
  lost: { label: 'Lost', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: <XCircle size={14} /> },
};

export const Leads = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Correctly use the selector and actions from the store
  const filteredLeads = useStore(selectFilteredLeads, shallow);
  const {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    deleteLead,
  } = useStore((state) => ({
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
    filterStatus: state.filterStatus,
    setFilterStatus: state.setFilterStatus,
    deleteLead: state.deleteLead,
  }), shallow);

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const handleDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDeleteConfirm(true);
    setActiveDropdown(null);
  };

  const confirmDelete = () => {
    if (selectedLead) {
      deleteLead(selectedLead.id);
      setShowDeleteConfirm(false);
      setSelectedLead(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lead Management</h1>
          <p className="text-textSecondary">
            Manage your customer pipeline and track opportunities
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Lead
        </button>
      </header>

      {/* Filters and Search */}
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 flex items-center gap-3 bg-surface/50 px-4 py-2.5 rounded-lg border border-border">
            <Search size={18} className="text-textSecondary" />
            <input
              type="text"
              placeholder="Search by name, company, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-textSecondary" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as LeadStatus | 'all')}
              className="bg-surface border border-border rounded-lg px-4 py-2.5 text-sm outline-none cursor-pointer hover:border-primary/30 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="new">New Leads</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal Sent</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-textSecondary">
          Showing {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-semibold text-textSecondary">Contact</th>
                <th className="text-left p-4 text-sm font-semibold text-textSecondary">Company</th>
                <th className="text-left p-4 text-sm font-semibold text-textSecondary">Value</th>
                <th className="text-left p-4 text-sm font-semibold text-textSecondary">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-textSecondary">Score</th>
                <th className="text-left p-4 text-sm font-semibold text-textSecondary">Last Contact</th>
                <th className="text-right p-4 text-sm font-semibold text-textSecondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-surface/30 transition-colors group"
                  >
                    {/* Contact */}
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-sm">{lead.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail size={12} className="text-textSecondary" />
                          <span className="text-xs text-textSecondary">{lead.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-sm">{lead.company}</div>
                        <div className="text-xs text-textSecondary mt-1">{lead.industry}</div>
                      </div>
                    </td>

                    {/* Value */}
                    <td className="p-4">
                      <div className="font-semibold text-sm text-success">
                        {formatCurrency(lead.value)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          statusConfig[lead.status].color
                        }`}
                      >
                        {statusConfig[lead.status].icon}
                        {statusConfig[lead.status].label}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-border rounded-full overflow-hidden w-16">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-textSecondary">
                          {lead.score}%
                        </span>
                      </div>
                    </td>

                    {/* Last Contact */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-textSecondary">
                        <Calendar size={14} />
                        {formatDate(lead.contactDate)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex justify-end relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === lead.id ? null : lead.id)}
                          className="p-2 hover:bg-surface rounded-lg transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeDropdown === lead.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveDropdown(null)}
                            />
                            <div className="absolute right-0 top-10 z-20 w-48 glass-panel border border-border rounded-lg shadow-xl overflow-hidden">
                              <button
                                onClick={() => handleEdit(lead)}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-surface/50 transition-colors flex items-center gap-3"
                              >
                                <Edit2 size={16} className="text-primary" />
                                Edit Lead
                              </button>
                              <button
                                onClick={() => handleDelete(lead)}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-surface/50 transition-colors flex items-center gap-3 text-error"
                              >
                                <Trash2 size={16} />
                                Delete Lead
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-surface/50 flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-textSecondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No leads found</h3>
              <p className="text-sm text-textSecondary mb-6">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first lead'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add New Lead
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <LeadModal
          mode="add"
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && selectedLead && (
        <LeadModal
          mode="edit"
          lead={selectedLead}
          onClose={() => {
            setShowEditModal(false);
            setSelectedLead(null);
          }}
        />
      )}

      {showDeleteConfirm && selectedLead && (
        <DeleteConfirmModal
          leadName={selectedLead.name}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setSelectedLead(null);
          }}
        />
      )}
    </div>
  );
};

// Lead Modal Component (Add/Edit)
interface LeadModalProps {
  mode: 'add' | 'edit';
  lead?: Lead;
  onClose: () => void;
}

const LeadModal = ({ mode, lead, onClose }: LeadModalProps) => {
  const { addLead, updateLead } = useStore();
  const [formData, setFormData] = useState({
    name: lead?.name || '',
    company: lead?.company || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    value: lead?.value || 0,
    status: lead?.status || 'new' as LeadStatus,
    score: lead?.score || 50,
    contactDate: lead?.contactDate || new Date().toISOString().split('T')[0],
    industry: lead?.industry || '',
    notes: lead?.notes || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'add') {
      addLead(formData);
    } else if (lead) {
      updateLead(lead.id, formData);
    }
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold">
            {mode === 'add' ? 'Add New Lead' : 'Edit Lead'}
          </h2>
          <p className="text-sm text-textSecondary mt-1">
            {mode === 'add'
              ? 'Enter the details for your new lead'
              : 'Update the lead information'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Contact Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="john@acme.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Deal Value ($) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.value}
                onChange={(e) => handleChange('value', parseFloat(e.target.value) || 0)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal Sent</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                placeholder="Technology"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contact Date</label>
              <input
                type="date"
                value={formData.contactDate}
                onChange={(e) => handleChange('contactDate', e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lead Score (0-100)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={(e) => handleChange('score', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">{formData.score}%</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none"
              placeholder="Add any additional notes or comments..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {mode === 'add' ? 'Add Lead' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Delete Confirmation Modal
interface DeleteConfirmModalProps {
  leadName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal = ({
  leadName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel border border-border rounded-2xl w-full max-w-md p-6"
      >
        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-error" />
        </div>
        <h2 className="text-xl font-bold text-center mb-2">Delete Lead</h2>
        <p className="text-sm text-textSecondary text-center mb-6">
          Are you sure you want to delete <span className="text-white font-medium">{leadName}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-border transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};
