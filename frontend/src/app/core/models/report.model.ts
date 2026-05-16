export type ReportStatus = 'LOST' | 'FOUND';
export type AnimalType  = 'DOG' | 'CAT' | 'BIRD' | 'OTHER';
export type AnimalSize  = 'SMALL' | 'MEDIUM' | 'LARGE';

export interface Report {
  id:                  number;
  status:              ReportStatus;
  animalType:          AnimalType;
  name:                string | null;
  breed:               string | null;
  color:               string | null;
  size:                AnimalSize | null;
  eventDate:           string;
  description:         string | null;
  distinctiveFeatures: string | null;
  locationText:        string | null;
  city:                string | null;
  province:            string | null;
  contactName:         string;
  contactPhone:        string;
  contactEmail:        string | null;
  publishedById:       number | null;
  publishedByUsername: string | null;
  imageUrls:           string[];
  primaryImageUrl:     string | null;
  createdAt:           string;
  updatedAt:           string;
}

export interface ReportFilter {
  status?:     ReportStatus;
  animalType?: AnimalType;
  city?:       string;
  q?:          string;
  page:        number;
  size:        number;
}

export interface ReportFormData {
  status:              ReportStatus;
  animalType:          AnimalType;
  name?:               string;
  breed?:              string;
  color?:              string;
  size?:               AnimalSize;
  eventDate:           string;
  description?:        string;
  distinctiveFeatures?: string;
  locationText?:       string;
  city?:               string;
  province?:           string;
  contactName:         string;
  contactPhone:        string;
  contactEmail?:       string;
  image?:              File;
}

export const STATUS_LABELS: Record<ReportStatus, string> = {
  LOST:  'PERDIDO',
  FOUND: 'ENCONTRADO',
};

export const ANIMAL_TYPE_LABELS: Record<AnimalType, string> = {
  DOG:   'Perro',
  CAT:   'Gato',
  BIRD:  'Ave',
  OTHER: 'Otro',
};

export const ANIMAL_SIZE_LABELS: Record<AnimalSize, string> = {
  SMALL:  'Pequeño',
  MEDIUM: 'Mediano',
  LARGE:  'Grande',
};

export const ANIMAL_TYPE_ICONS: Record<AnimalType, string> = {
  DOG:   '🐶',
  CAT:   '🐱',
  BIRD:  '🐦',
  OTHER: '🐾',
};
