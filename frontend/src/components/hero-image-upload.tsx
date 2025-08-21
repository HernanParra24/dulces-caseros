'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { configService } from '@/lib/api';

interface HeroImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
  className?: string;
}

export default function HeroImageUpload({ 
  onImageUploaded, 
  currentImage, 
  label = "Subir Imagen Principal",
  className = "" 
}: HeroImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validaciones específicas para imagen del hero
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Solo se permiten archivos de imagen (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB para imagen del hero
      toast.error('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('Token disponible:', token ? 'Sí' : 'No');
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://dulces-caseros.onrender.com'}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Error al subir la imagen: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      
      setUploadedImage(data.url);
      
      // Guardar la imagen en la configuración del sitio
      await configService.updateHeroImage(data.url);
      
      onImageUploaded(data.url);
      toast.success('Imagen del hero subida y guardada exitosamente');
      
    } catch (error: any) {
      console.error('Error uploading hero image:', error);
      toast.error(error.message || 'Error al subir la imagen del hero');
    } finally {
      setIsUploading(false);
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    onImageUploaded('');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {/* Área de subida */}
        <div
          onClick={triggerFileInput}
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
            ${uploadedImage 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          <AnimatePresence mode="wait">
            {uploadedImage ? (
              <motion.div
                key="uploaded"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-3"
              >
                <div className="flex justify-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-700">
                    Imagen subida exitosamente
                  </p>
                  <div className="relative inline-block">
                    <img
                      src={uploadedImage}
                      alt="Imagen del hero"
                      className="w-32 h-24 object-cover rounded-lg border"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-3"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                    <span className="text-sm text-gray-600">Subiendo imagen...</span>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-orange-600">Haz clic para subir</span> o arrastra y suelta aquí
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WebP hasta 5MB
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Recomendaciones:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Resolución mínima: 1200x800 píxeles</li>
          <li>• Formato: JPG, PNG o WebP</li>
          <li>• Tamaño máximo: 5MB</li>
          <li>• La imagen debe representar tus productos o marca</li>
        </ul>
      </div>
    </div>
  );
}
