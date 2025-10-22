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

export interface BaggageDetailSection {
  title: string;
  preListText?: string;
  points: string[];
}

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
  sections?: BaggageDetailSection[];
}

export const baggageDetailsContent: { [key: string]: BaggageDetail } = {
  'hand-bag': {
    title: 'Artículo personal',
    description: [
      'Está incluido de forma gratuita en todas las tarifas. Puede ser una mochila, cartera, maletín o cualquier artículo personal que cumpla con las dimensiones permitidas.',
      'Cualquier elemento extra será cobrado como equipaje adicional.',
    ],
    dimensions: { height: 45, width: 35, depth: 25, note: 'Incluyendo ruedas, bolsillos y asas.' },
    sections: [
      {
        title: 'Reglas y ubicación a bordo',
        points: [
          'Se permite un solo bolso de mano por pasajero. Si necesitas llevar un segundo, deberás pagar por él y será enviado a la bodega.',
          'Debe ser guardado bajo el asiento delantero. Si viajas en primera fila o en una salida de emergencia, deberás colocarlo en los compartimientos superiores.',
          'Además de tu bolso de mano, puedes llevar una chaqueta o abrigo sin costo adicional.',
        ],
      },
    ],
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
    dimensions: { height: 158, width: 0, depth: 0, note: 'La suma de largo + ancho + alto no debe exceder los 158 cm lineales.'},
    weight: { limit: 23, note: 'Su peso no debe superar los 23 kg.' },
    sections: [
      {
          title: 'Exceso de Equipaje y Límites por País',
          preListText: 'Recuerda que por ley de cada país no podrás exceder el peso de un equipaje en bodega de acuerdo con la siguiente información:',
          points: [
              'Si tu equipaje pesa más de 23 kg, estará sujeto a cargos por exceso de equipaje.',
              'Chile y Perú: Hasta 45 kg.',
              'Argentina y Uruguay: Hasta 32 kg.',
          ]
      },
      {
          title: 'Equipaje Sobredimensionado',
          points: [
              'Si tu equipaje mide más de 158 cms. lineales, no podrás llevarlo en bodega y deberás llevarlo como equipaje de carga.',
          ]
      },
      {
          title: 'Equipajes no Convencionales',
          points: [
              'En caso de equipajes no convencionales (televisores, cajas, etc), se recibirán siempre que vengan con un embalaje de material especial y resistente, diseñado para su transporte y que cumplan con el peso y medidas establecidas.',
          ]
      }
  ]
  },
  'pet-cabin-10': {
    title: 'Mascota en cabina',
    description: [
      'Tu mascota puede viajar contigo en la cabina en un contenedor adecuado que quepa debajo del asiento delantero.',
      'Es indispensable cumplir con todos los requisitos para asegurar un viaje tranquilo y seguro para tu mascota y los demás pasajeros.',
    ],
    dimensions: { height: 20, width: 33, depth: 40, note: 'Medidas máximas del contenedor blando (alto x ancho x largo).' },
    weight: { limit: 10, note: 'El peso máximo de la mascota, incluyendo el contenedor, es de 10 kg.' },
    sections: [
      {
        title: 'Requisitos y restricciones',
        points: [
          'En cabina sólo puedes llevar perros y gatos.',
          'Tu mascota debe tener al menos 12 semanas de edad (3 meses).',
          'El peso total (mascota + canil) no debe exceder los 10 kg.',
          'Cada pasajero puede viajar con una sola mascota en cabina.',
          'Se aceptan un máximo de 4 mascotas en cabina por vuelo.',
          'Debes presentar un carnet de vacunas y un certificado veterinario (emitido hasta 10 días antes del viaje) que acredite la edad y buena salud de tu mascota. Ambos en formato original, más una fotocopia del certificado para entregar en counter.',
          'Para rutas internacionales, considera la normativa de cada país. Consulta más información en www.iatatravelcentre.com.',
          'Las mascotas braquicéfalas (nariz chata) solo pueden viajar en cabina, cumpliendo todos los requisitos.',
          'No se aceptan razas consideradas peligrosas ni sus mestizajes.',
          'Debes realizar tu check-in directamente en el aeropuerto y serás ubicado en un asiento de ventana.',
          'Debes solicitar el servicio con un mínimo de 48 horas antes del vuelo. La mascota debe estar confirmada en la reserva.',
        ],
      },
      {
        title: 'Contenedor o canil',
        preListText: 'Tu mascota deberá ir en un contenedor apropiado para su tamaño, el que debe cumplir con las siguientes características:',
        points: [
          'Debe ser de material blando y resistente, con cierre, ventilación adecuada, suelo absorbente e impermeable, y sin ruedas.',
          'No se permiten mochilas, "bolsos canguro" o carteras donde la cabeza o extremidades de la mascota queden afuera.',
          'El canil debe tener al menos 10 cm de espacio entre la cabeza de tu mascota y el techo, permitiéndole estar de pie y moverse.',
          'Si no cumple los requisitos, no podrá ser embarcada en bodega, ya que allí no se permiten caniles blandos.',
        ]
      },
      {
        title: 'Consideraciones durante el vuelo',
        points: [
          'Tu mascota debe permanecer dentro de su canil en todo momento, ubicado a tus pies o bajo el asiento delantero.',
          'No puedes alimentar a tu mascota ni sacarla de su contenedor durante el vuelo.',
          'No se admitirán mascotas que puedan causar molestias (mal olor, ruido, etc.) a otros pasajeros.',
          'Revisa el costo del servicio en nuestro tarifario de productos.',
        ]
      },
      {
        title: 'Casos especiales',
        points: [
          'Ruta a Miami: El servicio de transporte de mascotas en cabina no está disponible en vuelos con origen o destino Miami.',
          'Otras especies: Para viajar con otro tipo de mascotas (conejos, hurones, hámsters, etc.) debes contactar a SKY Carga al correo cargasky@skyairline.com.',
        ]
      }
    ]
  },
  'pet-hold-45': {
    title: 'Mascota en bodega',
    description: ['Tu mascota puede viajar segura en la bodega del avión, en un ambiente presurizado y con control de temperatura.'],
    dimensions: { height: 230, width: 0, depth: 0, note: 'La suma del ancho, alto y largo no debe exceder los 230 cm lineales.' },
    weight: { limit: 45, note: 'El peso total, incluyendo el contenedor, no debe superar los 45 kg (*puede variar por ruta).' },
    sections: [
      {
        title: 'Requisitos y restricciones',
        points: [
          'En bodega sólo puedes llevar perros, gatos o aves ornamentales.',
          'Tu mascota debe tener al menos 12 semanas de edad (3 meses).',
          'Debes presentar un carnet de vacunas y un certificado veterinario (emitido hasta 10 días antes del viaje) que acredite la edad y buena salud de tu mascota. Ambos en formato original, más una fotocopia del certificado para entregar en counter. Consulta normativas internacionales en www.iatatravelcentre.com.',
          'No se aceptarán mascotas violentas, muertas, enfermas ni hembras preñadas.',
          'Las mascotas braquicéfalas (nariz chata) no pueden viajar en bodega por riesgo de dificultades respiratorias.',
          'No se permiten razas consideradas peligrosas (mayores de 9 meses) ni sus mestizajes.',
          'Debes solicitar el servicio con un mínimo de 48 horas antes del vuelo. La mascota debe estar confirmada en la reserva.',
          'El cobro del servicio es por tramo.',
          'Se aceptan un máximo de 12 mascotas en bodega por vuelo.',
        ],
      },
      {
        title: 'Contenedor o canil',
        preListText: 'Cada mascota debe ir en su propio canil, el cual debe cumplir con las siguientes características:',
        points: [
          'Debe ser rígido, de material resistente, a prueba de filtraciones y con piso absorbente.',
          'El canil debe estar en buen estado, limpio y seguro, impidiendo que la mascota pueda sacar sus extremidades.',
          'Peso máximo (mascota + canil): 45 kg para rutas en Chile y Perú. 32 kg para rutas en Argentina, Brasil, México, Colombia, Rep. Dominicana y Uruguay.',
          'Tamaño máximo: La suma de ancho, alto y largo no debe exceder los 230 cm lineales.',
          'Se acepta solo un perro o gato por canil. Para aves, se permiten hasta 2 en la misma jaula (diseñada para su transporte).',
          'No se aceptan contenedores con ruedas ni de elaboración artesanal.',
          'Como medida de seguridad, el canil será asegurado por personal del counter para impedir su apertura durante el transporte.',
          'Revisa el costo del servicio en nuestro Tarifario de Productos.',
        ]
      },
      {
        title: 'Guía de tamaño del canil',
        preListText: 'Para asegurar la comodidad de tu mascota, el canil debe tener el tamaño ideal:',
        points: [
          'Altura: Mínimo 10 cm de espacio libre entre la cabeza de la mascota y el techo.',
          'Ancho: Espacio suficiente para que pueda girar sobre sí misma.',
          'Largo: Permitir que el animal pueda recostarse en una posición natural.',
          'Ventilación: Un extremo completamente abierto (puerta) y agujeros de ventilación en los otros tres lados.',
        ]
      },
      {
        title: 'Casos especiales',
        points: [
          'Ruta a Miami: El servicio de transporte de mascotas en bodega no está disponible en vuelos con origen o destino Miami.',
          'Otras especies: Para viajar con otro tipo de mascotas (conejos, hurones, hámsters, etc.) debes contactar a SKY Carga al correo cargasky@skyairline.com.',
        ]
      }
    ]
  },
  'special-23': {
    title: 'Equipaje especial en bodega',
    description: ['Puedes llevar instrumentos musicales, equipo deportivo o artículos audiovisuales como equipaje especial. Deben estar debidamente embalados para su transporte seguro en bodega.'],
    dimensions: { height: 230, width: 0, depth: 0, note: 'La suma de las dimensiones no debe superar los 230 cm lineales.'},
    weight: { limit: 23, note: 'El peso máximo permitido es de 23 kg por pieza.' },
    extraNotes: ['Algunos artículos pueden requerir aprobación previa. Contacta al centro de atención al cliente.'],
  },
};