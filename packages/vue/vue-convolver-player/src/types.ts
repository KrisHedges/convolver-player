export interface TestSound {
  label: string;
  type: "sample";
  path: string;
}

export interface Props {
  irFilePath: string;
  audioContext?: AudioContext | null;
}
