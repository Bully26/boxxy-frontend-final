import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import { CodeBox, BoxColor } from '@/types/codeBox';
import { CodeBoxItem } from './CodeBoxItem';
import { EditorNavBar } from './EditorNavBar';

interface CodeEditorAreaProps {
  boxes: CodeBox[];
  filterColor: BoxColor | null;
  isLoading: boolean;
  onCodeChange: (id: string, code: string) => void;
  onColorChange: (id: string, color: BoxColor) => void;
  onAddBox: (id: string) => void;
  onDeleteBox: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  onShowAll: () => void;
  onFilterByColor: (color: BoxColor) => void;
  onSubmitByColor: (color: BoxColor) => void;
}

export function CodeEditorArea({
  boxes,
  filterColor,
  isLoading,
  onCodeChange,
  onColorChange,
  onAddBox,
  onDeleteBox,
  onReorder,
  onShowAll,
  onFilterByColor,
  onSubmitByColor
}: CodeEditorAreaProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredBoxes = useMemo(() => {
    if (filterColor === null) return boxes;
    return boxes.filter(box => box.color === filterColor);
  }, [boxes, filterColor]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <EditorNavBar
        filterColor={filterColor}
        submitColor={null}
        isLoading={isLoading}
        onShowAll={onShowAll}
        onFilterByColor={onFilterByColor}
        onSubmitByColor={onSubmitByColor}
      />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredBoxes.map(box => box.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              {filteredBoxes.map(box => (
                <CodeBoxItem
                  key={box.id}
                  box={box}
                  canDelete={boxes.length > 1}
                  onCodeChange={onCodeChange}
                  onColorChange={onColorChange}
                  onAddBox={onAddBox}
                  onDeleteBox={onDeleteBox}
                />
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
        
        {filteredBoxes.length === 0 && (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <p>No code boxes match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
