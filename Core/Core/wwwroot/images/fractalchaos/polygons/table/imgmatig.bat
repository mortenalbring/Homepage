FOR %%a in (*.png) DO "C:\Program Files\ImageMagick-7.1.0-Q16-HDRI\magick.exe" convert %%a -trim -resize 500x500 -background none -gravity center -extent 500x500 tr_%%a