
export enum LocationType {
  CITY = 'Ville',
  RURAL = 'Village/Rural'
}

export enum GamePhase {
  PHASE_1 = 'L\'Esquisse',
  PHASE_2 = 'Les Fondations',
  PHASE_3 = 'L\'Architecture',
  PHASE_4 = 'La Reliure'
}

export interface Participant {
  name: string;
  rhythm: 'Chill' | 'Action' | 'Mixte';
  preferences: string[];
  avatarColor: string;
}

export interface DuoContext {
  id: string;
  duoName: string;
  p1: Participant;
  p2: Participant;
  budget: 'Étudiant' | 'Confort' | 'No Limit';
  currentPhase: GamePhase;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface MissionFormData {
  city: string;
  locationType: LocationType;
  weather: string;
  phase: GamePhase;
  vibe: string;
}

export interface MissionRequest extends MissionFormData {
  duo: DuoContext;
}

export interface MissionResponse {
  titre_episode: string;
  vibe_generale: string;
  lieu_type: string;
  instruction_coffret: string; // Lien avec le matériel physique
  mission_description: string;
  defi_bonus: string;
  mission_secrete_a: string;
  mission_secrete_b: string;
  dress_code: string;
  icebreaker_audio: string;
  specific_place_name?: string;
  sources?: GroundingSource[];
}

export interface Memory {
  id: string;
  date: string;
  title: string;
  imageUrl: string;
  phase: GamePhase;
}
