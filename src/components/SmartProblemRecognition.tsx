import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { HiCamera, HiUpload } from 'react-icons/hi';

interface RecognizedProblem {
  text: string;
  confidence: number;
}

const SmartProblemRecognition: React.FC<{
  onProblemRecognized: (problem: string) => void;
}> = ({ onProblemRecognized }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState<RecognizedProblem | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<any>(null);

  const initializeWorker = async () => {
    if (!workerRef.current) {
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      workerRef.current = worker;
    }
    return workerRef.current;
  };

  const processImage = async (file: File) => {
    try {
      setIsProcessing(true);
      setError('');

      // Inicializa worker se não estiver inicializado
      const worker = await initializeWorker();

      // Converte o arquivo para base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          if (e.target?.result) {
            // Pré-processa a imagem
            const image = new Image();
            image.src = e.target.result as string;
            
            await new Promise((resolve) => {
              image.onload = resolve;
            });

            // Cria um canvas para processamento de imagem
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              // Define o tamanho do canvas
              canvas.width = image.width;
              canvas.height = image.height;

              // Aplica pré-processamento
              ctx.drawImage(image, 0, 0);
              ctx.filter = 'contrast(1.2) brightness(1.1)'; // Melhora o contraste e brilho
              ctx.drawImage(image, 0, 0);

              // Converte para preto e branco
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              
              for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                const threshold = 128;
                const value = avg > threshold ? 255 : 0;
                data[i] = data[i + 1] = data[i + 2] = value;
              }
              
              ctx.putImageData(imageData, 0, 0);

              // Configura as opções do Tesseract para melhor reconhecimento de matemática
              const { data: { text, confidence } } = await worker.recognize(canvas.toDataURL(), {
                tessedit_char_whitelist: '0123456789xy+-=*/',  // Limita os caracteres reconhecidos
                tessedit_pageseg_mode: '6',  // Assume bloco de texto uniforme
                preserve_interword_spaces: '0',
                language: 'eng',
                init_config: JSON.stringify({
                  tessedit_ocr_engine_mode: 2,  // Use o modo de rede neural
                  textord_heavy_nr: 0,  // Reduz a remoção de ruído
                  textord_min_linesize: 2.5  // Melhora o tratamento de texto pequeno
                })
              });

              // Processa o texto reconhecido
              const cleanedText = cleanMathExpression(text);
              setRecognizedText({ text: cleanedText, confidence });
              onProblemRecognized(cleanedText);
            }
          }
        } catch (err) {
          console.error('Recognition Error:', err);
          setError('Erro ao processar imagem. Tente novamente.');
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        setError('Erro ao ler o arquivo. Tente novamente.');
        setIsProcessing(false);
      };

      reader.readAsDataURL(file);

    } catch (err) {
      console.error('OCR Error:', err);
      setError('Erro ao inicializar o reconhecimento. Tente novamente.');
      setIsProcessing(false);
    }
  };

  // Limpa o worker ao descarregar o componente
  React.useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const cleanMathExpression = (text: string): string => {
    return text
      .replace(/[×]/g, '*')  // Substitui × por *
      .replace(/[÷]/g, '/')  // Substitui ÷ por /
      .replace(/[\n\r]/g, '=') // Substitui quebras de linha por separador de equação
      .replace(/\s+/g, '') // Remove todos os espaços em branco
      .replace(/(\d)([xy])/g, '$1*$2') // Adiciona símbolo de multiplicação entre números e variáveis
      .replace(/([xy])(\d)/g, '$1*$2') // Adiciona símbolo de multiplicação entre variáveis e números
      .replace(/={2,}/g, '=') // Substitui múltiplos = por um único =
      .replace(/=+$/g, '') // Remove sinais de igualdade finais
      .replace(/([+-])\s*([+-])/g, '$2') // Limpa sinais duplos
      .trim();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImage(URL.createObjectURL(file));
        processImage(file);
      } else {
        setError('Por favor, envie apenas arquivos de imagem.');
      }
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Cria um elemento de vídeo para mostrar o fluxo da câmera
      const videoElement = document.createElement('video');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Preferencia a câmera traseira no celular
      });
      
      // Cria um modal/diálogo para mostrar o fluxo da câmera
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
      
      // Cria um contêiner para o vídeo e o botão
      const container = document.createElement('div');
      container.className = 'relative max-w-lg w-full mx-4';
      
      // Estiliza o elemento de vídeo
      videoElement.className = 'w-full h-auto rounded-lg';
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.srcObject = stream;
      
      // Cria o botão de captura
      const captureButton = document.createElement('button');
      captureButton.className = 'absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-6 py-2 rounded-full shadow-lg flex items-center gap-2';
      captureButton.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke-width="2"/>
        </svg>
        Capturar
      `;
      
      // Adiciona elementos ao DOM
      container.appendChild(videoElement);
      container.appendChild(captureButton);
      modal.appendChild(container);
      document.body.appendChild(modal);
      
      // Lida com o clique no botão de captura
      captureButton.onclick = () => {
        // Cria um canvas para capturar a imagem
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Desenha o quadro atual do vídeo no canvas
          ctx.drawImage(videoElement, 0, 0);
          
          // Converte o canvas para blob
          canvas.toBlob(async (blob) => {
            if (blob) {
              // Cria um objeto File a partir do blob
              const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
              
              // Limpa
              stream.getTracks().forEach(track => track.stop());
              document.body.removeChild(modal);
              
              // Processa a imagem capturada
              setImage(URL.createObjectURL(file));
              processImage(file);
            }
          }, 'image/jpeg', 0.8);
        }
      };
      
      // Lida com o fechamento do modal ao clicar no fundo
      modal.onclick = (e) => {
        if (e.target === modal) {
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(modal);
        }
      };
      
    } catch (err) {
      setError('Erro ao acessar a câmera. Verifique se você concedeu as permissões necessárias.');
      console.error('Camera Error:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Reconhecimento de Problemas</h2>
      
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <h4 className="font-medium text-blue-800 mb-2">Dicas para melhor reconhecimento:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Use papel branco com escrita em preto ou azul escuro</li>
          <li>Evite sombras e reflexos na imagem</li>
          <li>Mantenha a câmera estável e paralela ao papel</li>
          <li>Certifique-se que a equação está bem iluminada</li>
          <li>Escreva os números e símbolos de forma clara e separada</li>
          <li>Evite dobras ou manchas no papel</li>
        </ul>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            <HiUpload className="w-5 h-5" />
            Enviar Imagem
          </button>
          
          <button
            onClick={handleCameraCapture}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            <HiCamera className="w-5 h-5" />
            Usar Câmera
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {image && (
          <div className="relative">
            <img
              src={image}
              alt="Preview"
              className="max-w-full h-auto rounded-lg"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="text-white">Processando...</div>
              </div>
            )}
          </div>
        )}

        {recognizedText && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Texto Reconhecido:</h3>
            <p className="font-mono">{recognizedText.text}</p>
            <p className="text-sm text-gray-500 mt-1">
              Confiança: {(recognizedText.confidence * 100).toFixed(1)}%
            </p>
          </div>
        )}

        {error && (
          <div className="text-red-600 mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartProblemRecognition;