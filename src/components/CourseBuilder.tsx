import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CourseBlock } from '../types';
import { supabase } from '../supabaseClient';

interface BlockProps {
  block: CourseBlock;
}

const BlockItem: React.FC<BlockProps> = ({ block }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-3 mb-2 bg-white border rounded shadow-sm">
      <strong className="block text-sm">{block.type}</strong>
      <span className="text-xs text-gray-600">{block.title}</span>
    </div>
  );
};

export const CourseBuilder: React.FC = () => {
  const [blocks, setBlocks] = useState<CourseBlock[]>([
    { id: '1', type: 'lesson', title: 'New Lesson' },
  ]);
  const [selected, setSelected] = useState<CourseBlock | null>(blocks[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!selected) return;
      supabase.rpc('save_builder_draft', { data: blocks }).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [blocks, selected]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((b) => b.id === active.id);
        const newIndex = items.findIndex((b) => b.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateSelected = (field: keyof CourseBlock, value: string) => {
    if (!selected) return;
    setBlocks((prev) => prev.map((b) => (b.id === selected.id ? { ...b, [field]: value } : b)));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
            {blocks.map((block) => (
              <div key={block.id} onClick={() => setSelected(block)}>
                <BlockItem block={block} />
              </div>
            ))}
          </SortableContext>
        </DndContext>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() =>
            setBlocks((prev) => [
              ...prev,
              { id: Date.now().toString(), type: 'lesson', title: 'Untitled' },
            ])
          }
        >
          Add Block
        </button>
      </div>
      {selected && (
        <div className="p-4 bg-gray-800 text-gray-100 rounded">
          <h3 className="font-semibold mb-2">Block Properties</h3>
          <div className="space-y-2">
            <input
              value={selected.title}
              onChange={(e) => updateSelected('title', e.target.value)}
              className="w-full px-2 py-1 text-black rounded"
            />
            <input
              value={selected.description || ''}
              onChange={(e) => updateSelected('description', e.target.value)}
              placeholder="Description"
              className="w-full px-2 py-1 text-black rounded"
            />
            <input
              value={selected.resource || ''}
              onChange={(e) => updateSelected('resource', e.target.value)}
              placeholder="Resource URL"
              className="w-full px-2 py-1 text-black rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};
