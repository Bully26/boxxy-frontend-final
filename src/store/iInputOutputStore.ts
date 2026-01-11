import { create } from 'zustand';



// interface InputOutputPanelProps {
//   input: string;
//   output: string;
//   hasError: boolean;
//   onInputChange: (value: string) => void;
// }

type InputOutputStore = {
  input: string;
  output: string;
  hasError: boolean;
  onInputChange: (value: string) => void;
  onOutputChange: (value: string) => void;
};

const useInputOutputStore = create<InputOutputStore>((set) => ({
  input: 'something here',
  output: 'bruh this is hard as fuck ',
  hasError: false,
  onInputChange: (value: string) => set((input) => ({ input: value })),
  onOutputChange: (value: string) => set((output) => ({ output: value })),
}));



function Input() {
  return useInputOutputStore((state) => state.input);
}
function Output() {
  return useInputOutputStore((state) => state.output);
}
function InputChange() {
  return useInputOutputStore((state) => state.onInputChange);
}
function OutputChange() {
  return useInputOutputStore((state) => state.onOutputChange);
}
function HasError() {
  return useInputOutputStore((state) => state.hasError);
}
export { Input, Output, InputChange, OutputChange, HasError, useInputOutputStore };
