import { Pipe, PipeTransform } from '@angular/core';

/**
 * Cloudinary serves the original upload unless asked otherwise (a phone photo can weigh several MB).
 * Ask for an auto-format (WebP/AVIF), auto-quality, width-capped version instead. Other URLs are
 * returned untouched, as are Cloudinary URLs that already carry a transformation.
 */
@Pipe({ name: 'optimizedImage' })
export class OptimizedImagePipe implements PipeTransform {
  transform(url: string | null | undefined, width = 1600): string {
    if (!url) {
      return '';
    }
    const marker = '/image/upload/';
    if (!url.includes('res.cloudinary.com') || !url.includes(marker)) {
      return url;
    }
    const afterUpload = url.slice(url.indexOf(marker) + marker.length);
    if (!/^v\d+\//.test(afterUpload)) {
      return url;
    }
    return url.replace(marker, `${marker}f_auto,q_auto,w_${width}/`);
  }
}
