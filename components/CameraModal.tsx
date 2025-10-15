import React, { useRef, useState, useEffect, useCallback } from 'react';
import { identifyIngredientsFromImage } from '../services/geminiService';
import Spinner from './Spinner';

interface CameraModalProps {
  onClose: () => void;
  onIngredientsIdentified: (ingredients: string[]) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ onClose, onIngredientsIdentified }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } else {
        setError("Your browser does not support camera access.");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access the camera. Please check your browser permissions.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup: stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const base64Image = imageDataUrl.split(',')[1];
        
        try {
            const ingredients = await identifyIngredientsFromImage(base64Image);
            onIngredientsIdentified(ingredients);
            onClose();
        } catch (apiError) {
            console.error("API Error identifying ingredients:", apiError);
            setError("Sorry, we couldn't identify ingredients. Please try again.");
        } finally {
            setIsCapturing(false);
        }
    } else {
        setError("Could not process the image.");
        setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
        <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Scan Ingredients</h2>
            <button onClick={onClose} disabled={isCapturing} className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="p-4 relative">
            {isCapturing && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col justify-center items-center">
                    <Spinner />
                    <p className="mt-2 text-gray-600">Identifying ingredients...</p>
                </div>
            )}
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-md bg-gray-900"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-center">
             <button
                onClick={handleCapture}
                disabled={isCapturing || !!error}
                className="bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Capture & Identify</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;