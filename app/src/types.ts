export interface Hotspot {
  id: number;
  yaw: number;
  pitch: number;
}

export interface Pose {
  yaw: number;
  pitch: number;
  roll: number;
}

export interface CaptureRecord {
  id: number;
  hotspotId: number;
  yaw: number;
  pitch: number;
  roll: number;
  timestamp: number;
  data: Blob;
}

export interface Session {
  id: string;
  mode: 24 | 36;
  captures: CaptureRecord[];
  completed: boolean;
  createdAt: number;
}

export type AlignmentState =
  | 'idle'
  | 'approaching'
  | 'aligned'
  | 'level'
  | 'capturing';

export type AppScreen =
  | 'splash'
  | 'permissions'
  | 'mode_select'
  | 'capture'
  | 'review'
  | 'export';
