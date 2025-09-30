export interface BuildingData {
  id: string;
  title: string;
  type: string;
  buildingId: string;
  cadastralReference: string;
  imageUrl?: string;
}

export interface BuildingCardProps {
  building: BuildingData;
  onMaintenancePress?: (buildingId: string) => void;
  onBuildingPress?: (buildingId: string) => void;
}
