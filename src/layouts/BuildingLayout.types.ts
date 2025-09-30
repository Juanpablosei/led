import { BuildingData } from '../components/home/building-card/BuildingCard.types';

export interface BuildingLayoutProps {
  building: BuildingData;
  children: React.ReactNode;
}
