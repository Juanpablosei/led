import { BuildingData } from '../components/home/building-card/BuildingCard.types';

export interface BuildingLayoutProps {
  building: BuildingData | null;
  children: React.ReactNode;
}
