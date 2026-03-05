import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { 
  MoreHorizontal, 
  Plus, 
  DollarSign, 
  Calendar, 
  GripVertical,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Lead, LeadStatus } from '../types';

const COLUMNS: { id: LeadStatus; title: string; color: string }[] = [
  { id: 'new', title: 'New Leads', color: 'border-t-blue-500' },
  { id: 'contacted', title: 'Contacted', color: 'border-t-purple-500' },
  { id: 'qualified', title: 'Qualified', color: 'border-t-cyan-500' },
  { id: 'proposal', title: 'Proposal', color: 'border-t-yellow-500' },
  { id: 'negotiation', title: 'Negotiation', color: 'border-t-orange-500' },
];

export const Pipelines = () => {
  const { leads, updateLead } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeLead = leads.find(l => l.id === activeId);
    if (!activeLead) return;

    // Find if we are over a column container or a specific card
    const isOverAColumn = COLUMNS.some(col => col.id === overId);
    let newStatus: LeadStatus | undefined;

    if (isOverAColumn) {
      newStatus = overId as LeadStatus;
    } else {
      const overLead = leads.find(l => l.id === overId);
      newStatus = overLead?.status;
    }

    // Only update if the status actually changed to prevent infinite loops
    if (newStatus && activeLead.status !== newStatus) {
      updateLead(activeId, { status: newStatus });
    }
  }, [leads, updateLead]);

  const handleDragEnd = useCallback(() => {
    setActiveId(null);
  }, []);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  const getColumnStats = (status: LeadStatus) => {
    const columnLeads = leads.filter(l => l.status === status);
    const totalValue = columnLeads.reduce((sum, l) => sum + l.value, 0);
    return { count: columnLeads.length, value: totalValue };
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sales Pipeline</h1>
          <p className="text-textSecondary">Visual deal flow and stage management</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-textSecondary">
            <Filter size={16} />
            <span>All Industries</span>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus size={16} />
            Add Deal
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto pb-4 -mx-8 px-8">
        <div className="flex gap-6 h-full min-w-max">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {COLUMNS.map((column) => (
              <div key={column.id} className="w-80 flex flex-col">
                <div className={`mb-4 p-3 glass-panel border-t-2 ${column.color} flex justify-between items-center`}>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider">{column.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-textSecondary">{getColumnStats(column.id).count} Deals</span>
                      <span className="text-[10px] text-textSecondary">•</span>
                      <span className="text-xs font-semibold text-success">{formatCurrency(getColumnStats(column.id).value)}</span>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-white/5 rounded-md transition-colors">
                    <MoreHorizontal size={16} className="text-textSecondary" />
                  </button>
                </div>

                <div className="flex-1 bg-surface/10 rounded-xl border border-dashed border-border/50 p-2">
                  <SortableContext
                    id={column.id}
                    items={leads.filter(l => l.status === column.id).map(l => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3 min-h-[150px]">
                      {leads
                        .filter((lead) => lead.status === column.id)
                        .map((lead) => (
                          <SortableCard key={lead.id} lead={lead} />
                        ))}
                    </div>
                  </SortableContext>
                </div>
              </div>
            ))}
            
            <DragOverlay dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: { active: { opacity: '0.5' } },
              }),
            }}>
              {activeId ? (
                <div className="w-80 rotate-3 scale-105 pointer-events-none">
                  <LeadCard lead={leads.find(l => l.id === activeId)!} isOverlay />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

const SortableCard = ({ lead }: { lead: Lead }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LeadCard lead={lead} />
    </div>
  );
};

const LeadCard = ({ lead, isOverlay = false }: { lead: Lead; isOverlay?: boolean }) => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <motion.div
      layout
      className={`group glass-panel p-4 border border-border/50 hover:border-primary/40 transition-all cursor-grab active:cursor-grabbing ${
        isOverlay ? 'shadow-2xl border-primary/50 bg-surface' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/10">
            {lead.company.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-1">{lead.company}</h4>
            <p className="text-[10px] text-textSecondary">{lead.name}</p>
          </div>
        </div>
        <GripVertical size={14} className="text-textSecondary opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 text-success font-bold text-sm">
          <DollarSign size={14} />
          {formatCurrency(lead.value)}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-medium text-textSecondary bg-surface/50 px-2 py-0.5 rounded-full border border-border">
          <TrendingUp size={10} className="text-primary" />
          {lead.score}% Fit
        </div>
      </div>

      <div className="pt-3 border-t border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-textSecondary">
          <Calendar size={12} />
          {new Date(lead.contactDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
        <div className="flex -space-x-2">
          <div className="w-5 h-5 rounded-full border border-background bg-primary/20 flex items-center justify-center text-[8px] font-bold">JS</div>
          <div className="w-5 h-5 rounded-full border border-background bg-accent/20 flex items-center justify-center text-[8px] font-bold">MC</div>
        </div>
      </div>
    </motion.div>
  );
};
