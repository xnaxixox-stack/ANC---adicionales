
import { BaggageItem, Passenger } from './types';

export const baggageOptions: BaggageItem[] = [
  {
    id: 'cabin-10',
    name: 'Equipaje en cabina 10 kg',
    weight: '',
    price: 12345,
    oldPrice: 16990,
    discount: '-20%',
    details: 'Detalles equipaje en cabina',
    image: 'https://i.imgur.com/SAfxfdE.png',
    category: 'main',
  },
  {
    id: 'hold-23',
    name: 'Equipaje en bodega 23 kg',
    weight: '',
    price: 22323,
    oldPrice: 29990,
    discount: '-20%',
    details: 'Detalles equipaje en bodega',
    image: 'https://i.imgur.com/mcwhcUi.png',
    category: 'main',
  },
  {
    id: 'pet-cabin-10',
    name: 'Mascota en cabina 10 kg',
    weight: '',
    price: 12345,
    oldPrice: 16990,
    discount: '-20%',
    details: 'Requisitos mascota en cabina',
    image: 'https://i.imgur.com/PoNRhs4.png',
    category: 'pet',
  },
  {
    id: 'pet-hold-45',
    name: 'Mascota en bodega 45 kg*',
    weight: '',
    price: 12345,
    oldPrice: 16990,
    discount: '-20%',
    details: 'Requisitos mascota en bodega',
    image: 'https://i.imgur.com/vfUlebZ.png',
    category: 'pet',
  },
  {
    id: 'special-23',
    name: 'Equipaje especial en bodega 23 kg',
    weight: '',
    price: 12345,
    oldPrice: 16990,
    discount: '-20%',
    details: 'Detalles equipaje especial',
    image: 'https://i.imgur.com/sm2myCl.png',
    category: 'special',
  },
];

export const passengersData: Passenger[] = [
  {
    id: 'p1',
    name: 'Pasajero 1',
    baggage: {},
  },
  {
    id: 'p2',
    name: 'Pasajero 2',
    baggage: {},
  },
];
