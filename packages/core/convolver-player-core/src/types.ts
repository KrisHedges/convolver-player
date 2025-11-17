export interface TestSound {
  label: string;
  type: "sample";
  path: string;
}

export interface ConvolverPlayerProps {
  irFilePath: string;
  audioContext?: AudioContext | null;
}
