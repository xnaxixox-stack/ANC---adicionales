import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200">
      <div className="w-full max-w-[1312px] mx-auto px-4 md:px-8 py-10 text-gray-500 text-xs">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="flex-shrink-0">
            <img 
              src="https://cdn.buttercms.com/cache=expiry:31506000/5BuxVeYzSYqPXTTLPI4A" 
              alt="SKY Logo" 
              className="h-8 w-auto" 
            />
          </div>
          <div className="text-center md:text-right flex flex-col gap-4">
            <p>© 1999-2025 SKY Airline. Todos los derechos reservados. SKY Airline S.A. - Av. Del Valle Sur 765, Huechuraba, Santiago, Chile</p>
            <nav className="flex flex-wrap justify-center md:justify-end gap-x-4 sm:gap-x-6 gap-y-2">
              <a href="#" className="underline hover:text-gray-900 transition-colors">Contrato de transporte</a>
              <a href="#" className="underline hover:text-gray-900 transition-colors">Términos y condiciones</a>
              <a href="#" className="underline hover:text-gray-900 transition-colors">Políticas de privacidad</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
