import React, { useEffect, useRef } from 'react';

interface AdProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
}

const AdComponent: React.FC<AdProps> = ({ adSlot, adFormat = 'auto', style = {} }) => {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Apenas tenta carregar anúncios se estiver em um ambiente de navegador
    if (typeof window !== 'undefined' && adRef.current) {
      try {
        // Limpa o anúncio anterior se houver
        if (adRef.current.childNodes.length > 0) {
          adRef.current.innerHTML = '';
        }
        
        // Cria um novo elemento ins para o anúncio
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.style.textAlign = 'center';
        adElement.setAttribute('data-ad-client', 'ca-pub-8356792861759837');
        adElement.setAttribute('data-ad-slot', adSlot);
        adElement.setAttribute('data-ad-format', adFormat);
        adElement.setAttribute('data-full-width-responsive', 'true');
        
        // Anexa o anúncio ao nosso ref
        adRef.current.appendChild(adElement);
        
        // Executa o código do anúncio
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error('Erro ao executar o código do anúncio:', error);
        }
      } catch (error) {
        console.error('Erro ao carregar o anúncio:', error);
      }
    }
    
    // Função de limpeza
    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [adSlot, adFormat]);
  
  return (
    <div 
      ref={adRef} 
      style={{ 
        minHeight: '100px', 
        margin: '20px 0',
        overflow: 'hidden',
        ...style 
      }}
      className="ad-container"
      data-testid="ad-component"
    />
  );
};

export default AdComponent; 