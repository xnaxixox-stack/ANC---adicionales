import React, { useState, useEffect, useMemo } from 'react';
import { BaggageItem, Passenger } from '../types';

interface PurchaseDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  passengers: Passenger[];
  baggageOptions: BaggageItem[];
  grandTotal: number;
}

const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const GreenArrowIcon = () => (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
        <path d="M1 5.4C0.723858 5.4 0.5 5.62386 0.5 5.9V6.1C0.5 6.37614 0.723858 6.6 1 6.6V5.4ZM15.5121 6.51213C15.7465 6.27776 15.7465 5.89724 15.5121 5.66286L11.7029 1.85355C11.4685 1.61918 11.088 1.61918 10.8536 1.85355C10.6192 2.08792 10.6192 2.46845 10.8536 2.70282L14.2386 6.08792L10.8536 9.47303C10.6192 9.7074 10.6192 10.0879 10.8536 10.3223C11.088 10.5567 11.4685 10.5567 11.7029 10.3223L15.5121 6.51213ZM1 6.6H15.0879V5.4H1V6.6Z" fill="currentColor"/>
    </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-purple-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM5 8h10a1 1 0 110 2H5a1 1 0 010-2z" clipRule="evenodd" />
  </svg>
);

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const DetailRow: React.FC<{ label: React.ReactNode; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm text-gray-600">
        <p className="pr-4">{label}</p>
        <p className="flex-shrink-0">{value}</p>
    </div>
);


export const PurchaseDetailDrawer: React.FC<PurchaseDetailDrawerProps> = ({ isOpen, onClose, passengers, baggageOptions, grandTotal }) => {
  const [idaOpen, setIdaOpen] = useState(true);
  const [vueltaOpen, setVueltaOpen] = useState(true);
  const [taxesOpen, setTaxesOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  const formatCurrency = (value: number) => `CLP ${value.toLocaleString('es-CL')}`;

  const adicionales = [
      { adult: 1, seat: "23F (SCL-AEP)" },
      { adult: 2, seat: "10B (SCL-AEP)" },
  ];

  const { idaBaggageItems, idaBaggageCost } = useMemo(() => {
    const items: { passengerName: string, itemName: string, value: string }[] = [];
    let cost = 0;
    passengers.forEach(p => {
        // FIX: Replaced Object.entries with Object.keys to ensure `counts` is correctly typed.
        Object.keys(p.baggage).forEach((itemId) => {
            const counts = p.baggage[itemId];
            if (counts.ida > 0) {
                const itemInfo = baggageOptions.find(opt => opt.id === itemId);
                if (itemInfo) {
                    cost += counts.ida * itemInfo.price;
                    for (let i = 0; i < counts.ida; i++) {
                         items.push({
                            passengerName: p.name.replace('Pasajero', 'Adulto'),
                            itemName: itemInfo.name,
                            value: formatCurrency(itemInfo.price)
                        });
                    }
                }
            }
        });
    });
    return { idaBaggageItems: items, idaBaggageCost: cost };
  }, [passengers, baggageOptions]);

  const { vueltaBaggageItems, vueltaBaggageCost } = useMemo(() => {
    const items: { passengerName: string, itemName: string, value: string }[] = [];
    let cost = 0;
    passengers.forEach(p => {
        // FIX: Replaced Object.entries with Object.keys to ensure `counts` is correctly typed.
        Object.keys(p.baggage).forEach((itemId) => {
            const counts = p.baggage[itemId];
            if (counts.vuelta > 0) {
                const itemInfo = baggageOptions.find(opt => opt.id === itemId);
                if (itemInfo) {
                    cost += counts.vuelta * itemInfo.price;
                    for (let i = 0; i < counts.vuelta; i++) {
                         items.push({
                            passengerName: p.name.replace('Pasajero', 'Adulto'),
                            itemName: itemInfo.name,
                            value: formatCurrency(itemInfo.price)
                        });
                    }
                }
            }
        });
    });
    return { vueltaBaggageItems: items, vueltaBaggageCost: cost };
  }, [passengers, baggageOptions]);

  const baseSubtotalIda = 43480;
  const baseSubtotalVuelta = 43480;

  const subtotalIda = baseSubtotalIda + idaBaggageCost;
  const subtotalVuelta = baseSubtotalVuelta + vueltaBaggageCost;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} aria-hidden="true"></div>
        
        <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <header className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-4">
              <ShoppingCartIcon />
              <h2 id="drawer-title" className="text-2xl font-bold text-gray-800">Detalle de la compra</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-full p-1"
              aria-label="Cerrar"
            >
              <CloseIcon />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto bg-gray-100 p-4 space-y-4">
            
            {/* IDA Section */}
            <div className="bg-white rounded-lg">
              <button onClick={() => setIdaOpen(!idaOpen)} className="w-full flex justify-between items-start text-left p-4 focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-lg">
                <div>
                  <p className="text-xs text-purple-600 font-bold mb-1">IDA</p>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    Santiago (SCL) <GreenArrowIcon /> Buenos Aires (AEP)
                  </h3>
                </div>
                <ChevronIcon open={idaOpen} />
              </button>
              {idaOpen && (
                <div className="px-4 pb-4 space-y-4">
                  <div className="text-sm text-gray-600 space-y-2 pt-2">
                    <p className="flex items-center gap-2"><CalendarIcon /> Viernes, 16 de Febrero | 01:00 - 03:00</p>
                    <a href="#" className="flex items-center gap-2 text-purple-700 font-semibold hover:underline"><InfoIcon /> Ver itinerario del vuelo</a>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">Pasaje aéreo - Tarifa Light</p>
                        <p className="text-sm text-gray-500">2 Adultos</p>
                      </div>
                      <p className="font-bold">{formatCurrency(42770)}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="font-bold mb-2">Adicionales</p>
                    <div className="space-y-1">
                      {adicionales.map((item, index) => (
                          <DetailRow key={`seat-ida-${index}`} label={`Adulto ${item.adult} - Asiento ${item.seat}`} value="Incluído en tarifa" />
                      ))}
                      {idaBaggageItems.map((item, index) => (
                        <DetailRow key={`bag-ida-${index}`} label={`${item.passengerName} - ${item.itemName}`} value={item.value} />
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-4 flex justify-between items-center font-bold">
                    <p>Subtotal</p>
                    <p>{formatCurrency(subtotalIda)}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* VUELTA Section */}
            <div className="bg-white rounded-lg">
              <button onClick={() => setVueltaOpen(!vueltaOpen)} className="w-full flex justify-between items-start text-left p-4 focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-lg">
                <div>
                  <p className="text-xs text-purple-600 font-bold mb-1">VUELTA</p>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    Buenos Aires (AEP) <GreenArrowIcon /> Santiago (SCL)
                  </h3>
                </div>
                <ChevronIcon open={vueltaOpen} />
              </button>
              {vueltaOpen && (
                <div className="px-4 pb-4 space-y-4">
                  <div className="text-sm text-gray-600 space-y-2 pt-2">
                    <p className="flex items-center gap-2"><CalendarIcon /> Sábado, 24 de Febrero | 08:00 - 10:20</p>
                    <a href="#" className="flex items-center gap-2 text-purple-700 font-semibold hover:underline"><InfoIcon /> Ver itinerario del vuelo</a>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                     <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">Pasaje aéreo - Tarifa Light</p>
                        <p className="text-sm text-gray-500">2 Adultos</p>
                      </div>
                      <p className="font-bold">{formatCurrency(42770)}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="font-bold mb-2">Adicionales</p>
                     <div className="space-y-1">
                      {adicionales.map((item, index) => (
                          <DetailRow key={`seat-vuelta-${index}`} label={`Adulto ${item.adult} - Asiento ${item.seat}`} value="Incluído en tarifa" />
                      ))}
                      {vueltaBaggageItems.map((item, index) => (
                          <DetailRow key={`bag-vuelta-${index}`} label={`${item.passengerName} - ${item.itemName}`} value={item.value} />
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-4 flex justify-between items-center font-bold">
                    <p>Subtotal</p>
                    <p>{formatCurrency(subtotalVuelta)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Taxes Section */}
            <div className="bg-white rounded-lg">
              <button onClick={() => setTaxesOpen(!taxesOpen)} className="w-full flex justify-between items-center text-left p-4 focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-lg">
                  <h3 className="text-lg font-bold">Tasas e impuestos</h3>
                  <ChevronIcon open={taxesOpen} />
              </button>
              {taxesOpen && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="pt-3 flex justify-between items-center font-bold">
                         <p>Subtotal</p>
                         <p>{formatCurrency(42770)}</p>
                      </div>
                  </div>
              )}
            </div>
          </div>

          <footer className="p-6 bg-white border-t border-gray-200 flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-bold">Total a pagar:</p>
              <p className="text-2xl font-bold">{formatCurrency(grandTotal)}</p>
            </div>
            <button onClick={onClose} className="w-full bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors text-lg">
              Entendido
            </button>
          </footer>
        </div>
      </div>
    </>
  );
};