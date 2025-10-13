
export interface BaggageItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  details: string;
  image: string;
  category: 'main' | 'pet' | 'special';
}

export interface BaggageCounts {
  ida: number;
  vuelta: number;
}

export interface Passenger {
  id: string;
  name: string;
  baggage: {
    [itemId: string]: BaggageCounts;
  };
}
