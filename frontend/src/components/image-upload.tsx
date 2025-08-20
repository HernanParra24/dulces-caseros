'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
  className?: string;
}

export default function ImageUpload({ 
  onImageUploaded, 
  currentImage, 
  label = "Subir Imagen",
  className = "" 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validaciones
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('Token disponible:', token ? 'Sí' : 'No');
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:3001/upload/image', {
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
      onImageUploaded(data.url);
      toast.success('Imagen subida exitosamente');
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Error al subir la imagen');
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
            accept="image/*"
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
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
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
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="text-sm text-gray-600">Subiendo imagen...</p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Haz clic para subir una imagen
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, GIF, WEBP (máx. 5MB)
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Información adicional */}
        {!uploadedImage && !isUploading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <ImageIcon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-medium">Consejos para una mejor imagen:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Usa imágenes de alta calidad (mínimo 800x600px)</li>
                  <li>• Formato recomendado: JPG o PNG</li>
                  <li>• Fondo limpio y bien iluminado</li>
                  <li>• El producto debe ocupar al menos el 70% de la imagen</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
