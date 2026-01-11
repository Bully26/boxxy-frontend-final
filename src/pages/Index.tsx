import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { BoxColor } from '@/types/codeBox';
import { useCodeBoxes } from '@/hooks/useCodeBoxes';
import { useExecution } from '@/hooks/useExecution';
import { CodeEditorArea } from '@/components/CodeEditor/CodeEditorArea';
import { TerminalPanel } from '@/components/Terminal/TerminalPanel';
import { InputOutputPanel } from '@/components/InputOutput/InputOutputPanel';

const Index = () => {
  const {
    boxes,
    addBox,
    deleteBox,
    updateCode,
    updateColor,
    reorderBoxes,
    getCombinedCode
  } = useCodeBoxes();

  const {
    isLoading,
    terminalOutput,
    outputPanelText,
    hasError,
    executeCode,
    clearOutput
  } = useExecution();

  const [filterColor, setFilterColor] = useState<BoxColor | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [input, setInput] = useState('');

  const handleShowAll = useCallback(() => {
    setFilterColor(null);
  }, []);

  const handleFilterByColor = useCallback((color: BoxColor) => {
    setFilterColor(color);
  }, []);

  const handleSubmitByColor = useCallback(async (color: BoxColor) => {
    const code = getCombinedCode(color);
    if (!code.trim()) {
      return;
    }
    setIsTerminalOpen(true);
    await executeCode(code, input);
  }, [getCombinedCode, input, executeCode]);

  const handleToggleTerminal = useCallback(() => {
    setIsTerminalOpen(prev => !prev);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">C++ Playground</h1>
            <p className="text-xs text-muted-foreground">Write, compile, and run C++ code</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {boxes.length} block{boxes.length !== 1 ? 's' : ''}
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Code Editor + Terminal */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-hidden">
            <CodeEditorArea
              boxes={boxes}
              filterColor={filterColor}
              isLoading={isLoading}
              onCodeChange={updateCode}
              onColorChange={updateColor}
              onAddBox={addBox}
              onDeleteBox={deleteBox}
              onReorder={reorderBoxes}
              onShowAll={handleShowAll}
              onFilterByColor={handleFilterByColor}
              onSubmitByColor={handleSubmitByColor}
            />
          </div>
          
          <TerminalPanel
            isOpen={isTerminalOpen}
            output={terminalOutput}
            isLoading={isLoading}
            onToggle={handleToggleTerminal}
            onClear={clearOutput}
          />
        </div>

        {/* Right: Input/Output Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 flex-shrink-0"
        >
          <InputOutputPanel
            input={input}
            output={outputPanelText}
            hasError={hasError}
            onInputChange={setInput}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
