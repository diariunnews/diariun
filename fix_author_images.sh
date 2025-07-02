#!/bin/bash

echo "🔧 Corrigiendo rutas de imágenes en los archivos JSON de autores..."

for i in $(seq -w 1 225); do
  if [ $i -le 113 ]; then
    prefix="male"
  else
    prefix="female"
  fi

  filename="data/authors/author_$(printf "%03d" "$((10#$i))").json"
  new_photo="/authors/${prefix}-$(printf "%03d" "$((10#$i))").jpg"

  if [ -f "$filename" ]; then
    # Sustituir línea que contiene "photo": por la nueva
    sed -i '' "s|\"photo\": \".*\"|\"photo\": \"${new_photo}\"|" "$filename"
  else
    echo "❌ Archivo no encontrado: $filename"
  fi
done

echo "✅ Todas las fotos han sido actualizadas correctamente."
