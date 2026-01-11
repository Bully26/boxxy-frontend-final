import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CodeBox, BoxColor } from '@/types/codeBox';

const DEFAULT_CODE = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`;

export function useCodeBoxes() {
  const [boxes, setBoxes] = useState<CodeBox[]>([
    { id: uuidv4(), code: DEFAULT_CODE, color: 'blue' }
  ]);

  const addBox = useCallback((afterId: string) => {
    setBoxes(prev => {
      const index = prev.findIndex(box => box.id === afterId);
      const newBox: CodeBox = {
        id: uuidv4(),
        code: '// New code block\n',
        color: 'blue'
      };
      const newBoxes = [...prev];
      newBoxes.splice(index + 1, 0, newBox);
      return newBoxes;
    });
  }, []);

  const deleteBox = useCallback((id: string) => {
    setBoxes(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter(box => box.id !== id);
    });
  }, []);

  const updateCode = useCallback((id: string, code: string) => {
    setBoxes(prev => prev.map(box => 
      box.id === id ? { ...box, code } : box
    ));
  }, []);

  const updateColor = useCallback((id: string, color: BoxColor) => {
    setBoxes(prev => prev.map(box => 
      box.id === id ? { ...box, color } : box
    ));
  }, []);

  const reorderBoxes = useCallback((activeId: string, overId: string) => {
    setBoxes(prev => {
      const oldIndex = prev.findIndex(box => box.id === activeId);
      const newIndex = prev.findIndex(box => box.id === overId);
      
      if (oldIndex === -1 || newIndex === -1) return prev;
      
      const newBoxes = [...prev];
      const [removed] = newBoxes.splice(oldIndex, 1);
      newBoxes.splice(newIndex, 0, removed);
      return newBoxes;
    });
  }, []);

  const getBoxesByColor = useCallback((color: BoxColor) => {
    return boxes.filter(box => box.color === color);
  }, [boxes]);

  const getCombinedCode = useCallback((color: BoxColor) => {
    return boxes
      .filter(box => box.color === color)
      .map(box => box.code)
      .join('\n\n');
  }, [boxes]);

  return {
    boxes,
    addBox,
    deleteBox,
    updateCode,
    updateColor,
    reorderBoxes,
    getBoxesByColor,
    getCombinedCode
  };
}
