import { useState, useCallback } from 'react';
import { ExecutionResult } from '@/types/codeBox';

export function useExecution() {
  const [isLoading, setIsLoading] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [outputPanelText, setOutputPanelText] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  const executeCode = useCallback(async (code: string, input: string): Promise<ExecutionResult> => {
    setIsLoading(true);
    setTerminalOutput('');
    setOutputPanelText('');
    setHasError(false);

    try {
      // Simulated API call - replace with actual API endpoint
      // For demo purposes, we'll simulate compilation and execution
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate successful execution
      const simulatedOutput = `$ g++ -o program main.cpp
$ ./program
Hello, World!

Process finished with exit code 0`;

      setTerminalOutput(simulatedOutput);
      setOutputPanelText('Hello, World!');
      
      return {
        output: 'Hello, World!',
        success: true,
        compilationOutput: 'Compilation successful'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorOutput = `$ g++ -o program main.cpp
error: ${errorMessage}

Process finished with exit code 1`;
      
      setTerminalOutput(errorOutput);
      setOutputPanelText(errorMessage);
      setHasError(true);
      
      return {
        output: '',
        error: errorMessage,
        success: false
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearOutput = useCallback(() => {
    setTerminalOutput('');
    setOutputPanelText('');
    setHasError(false);
  }, []);

  return {
    isLoading,
    terminalOutput,
    outputPanelText,
    hasError,
    executeCode,
    clearOutput
  };
}
