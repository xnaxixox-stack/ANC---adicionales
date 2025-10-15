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

export const BAGGAGE_ITEM_LIMITS: { [key: string]: number } = {
  'cabin-10': 1,
  'hold-23': 5,
  'pet-cabin-10': 1,
  'pet-hold-45': 2,
  'special-23': 5,
};

interface BaggageDetail {
  title: string;
  description: string[];
  dimensions?: {
    height: number;
    width: number;
    depth: number;
    note: string;
  };
  weight?: {
    limit: number;
    note: string;
  };
  extraNotes?: string[];
}

export const baggageDetailsContent: { [key: string]: BaggageDetail } = {
  'hand-bag': {
    title: 'Bolso de mano',
    description: [
      'Tu bolso de mano viaja contigo en la cabina, debajo del asiento delantero. Debe ser lo suficientemente pequeño para no obstruir el paso.',
      'Todas nuestras tarifas incluyen un bolso de mano sin costo por pasajero en cada vuelo.'
    ],
    dimensions: { height: 45, width: 35, depth: 25, note: 'Incluyendo ruedas, bolsillos y asas.' },
    weight: { limit: 10, note: 'El peso combinado con tus pertenencias no debe superar los 10 kg.'},
  },
  'cabin-10': {
    title: 'Equipaje en cabina',
    description: [
      'Tu equipaje de mano lo llevas contigo en la cabina. Deberás guardarlo en los compartimientos superiores de equipaje (bins) que están al interior del avión.',
      'Si compraste Tarifa Zero puedes sumar un equipaje de mano, el cual debe cumplir las dimensiones especificadas arriba.'
    ],
    dimensions: { height: 55, width: 35, depth: 25, note: 'Incluyendo las ruedas, bolsillos y asas.' },
    weight: { limit: 10, note: 'Su peso no debe superar los 10 kg.' },
  },
  'hold-23': {
    title: 'Equipaje en bodega',
    description: ['El equipaje en bodega, también conocido como equipaje facturado, se transporta en la bodega de carga del avión. Debes entregarlo en el mostrador de check-in antes de tu vuelo.'],
    dimensions: { height: 158, width: 0, depth: 0, note: 'La suma de alto + ancho + largo no debe exceder los 158 cm lineales.'},
    weight: { limit: 23, note: 'El peso máximo permitido es de 23 kg. Se pueden aplicar cargos por sobrepeso.' },
  },
  'pet-cabin-10': {
    title: 'Mascota en cabina',
    description: [
      'Tu mascota puede viajar contigo en la cabina en un contenedor adecuado que quepa debajo del asiento delantero.',
      'Es indispensable presentar certificado de un médico veterinario, emitido hasta 10 días antes del vuelo, que acredite que el estado de salud de tu mascota es apto para realizar el viaje.'
    ],
    dimensions: { height: 18, width: 30, depth: 33, note: 'Medidas máximas del contenedor (kennel blando).'},
    weight: { limit: 10, note: 'El peso máximo de la mascota, incluyendo el contenedor, es de 10 kg.' },
    extraNotes: ['Solo se permite el transporte de perros y gatos.'],
  },
  'pet-hold-45': {
    title: 'Mascota en bodega',
    description: ['Tu mascota puede viajar segura en la bodega del avión, en un ambiente presurizado y con control de temperatura.'],
    dimensions: { height: 300, width: 0, depth: 0, note: 'La suma de las dimensiones del contenedor no debe superar los 300 cm lineales.' },
    weight: { limit: 45, note: 'El peso total, incluyendo el contenedor, no debe superar los 45 kg.' },
    extraNotes: ['Debes cumplir con toda la documentación sanitaria requerida por el origen y destino.'],
  },
  'special-23': {
    title: 'Equipaje especial en bodega',
    description: ['Puedes llevar instrumentos musicales, equipo deportivo o artículos audiovisuales como equipaje especial. Deben estar debidamente embalados para su transporte seguro en bodega.'],
    dimensions: { height: 230, width: 0, depth: 0, note: 'La suma de las dimensiones no debe superar los 230 cm lineales.'},
    weight: { limit: 23, note: 'El peso máximo permitido es de 23 kg por pieza.' },
    extraNotes: ['Algunos artículos pueden requerir aprobación previa. Contacta al centro de atención al cliente.'],
  },
};