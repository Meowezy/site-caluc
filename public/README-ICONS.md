# Иконки для сайта

Необходимо создать следующие иконки из `logo.jpg`:

## Список файлов:

1. **favicon.ico** (32x32, 16x16 multi-size)
   - Стандартная иконка для браузеров

2. **icon-192.png** (192x192)
   - PWA иконка для Android

3. **icon-512.png** (512x512)
   - PWA иконка высокого разрешения

4. **apple-touch-icon.png** (180x180)
   - Иконка для iOS устройств

5. **og-image.png** (1200x630)
   - Open Graph изображение для социальных сетей

## Как создать:

### Вариант 1: Онлайн-сервисы
- https://realfavicongenerator.net/ — генератор всех иконок
- https://www.favicon-generator.org/
- https://favicon.io/

### Вариант 2: Вручную
1. Откройте `logo.jpg` в Photoshop/GIMP/Figma
2. Измените размер canvas на нужный (квадрат)
3. Экспортируйте в PNG с нужными размерами
4. Для favicon.ico используйте конвертер PNG→ICO

### Вариант 3: ImageMagick (командная строка)
```bash
# Установите ImageMagick, затем:
convert logo.jpg -resize 192x192 public/icon-192.png
convert logo.jpg -resize 512x512 public/icon-512.png
convert logo.jpg -resize 180x180 public/apple-touch-icon.png
convert logo.jpg -resize 32x32 public/favicon.ico
```

## Open Graph изображение

Для `og-image.png` (1200x630):
1. Создайте дизайн с логотипом + текстом "КредитПлан — Калькулятор кредита"
2. Используйте фирменные цвета (#2563eb синий)
3. Добавьте фон и краткое описание

### Шаблон Figma/Canva:
- Размер: 1200x630 px
- Логотип: в левой части
- Текст: "КредитПлан", "Калькулятор кредита", "Досрочные платежи • График • Экспорт PDF"
- Фон: градиент или текстура
