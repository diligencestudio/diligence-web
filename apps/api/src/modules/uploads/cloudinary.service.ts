import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { AppConfigService } from '../../config/app-config.service';

/**
 * Sube imágenes a Cloudinary. Si las credenciales no están configuradas,
 * responde 503 con un mensaje claro (en vez de fallar de forma opaca).
 */
@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly config: AppConfigService) {
    const { cloudName, apiKey, apiSecret, configured } = this.config.cloudinary;
    if (configured) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
    }
  }

  async uploadImage(buffer: Buffer): Promise<{ url: string }> {
    if (!this.config.cloudinary.configured) {
      throw new ServiceUnavailableException(
        'Cloudinary no está configurado. Define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.',
      );
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'diligence', resource_type: 'image' },
        (error, result) => {
          if (error || !result) {
            this.logger.error('Fallo subiendo a Cloudinary', error?.message);
            reject(
              new InternalServerErrorException('No se pudo subir la imagen'),
            );
            return;
          }
          resolve({ url: result.secure_url });
        },
      );
      stream.end(buffer);
    });
  }
}
