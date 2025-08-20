import { Module } from '@nestjs/common';
import { CloudinaryService } from '../services/cloudinary.service';
import { UploadController } from '../controllers/upload.controller';

@Module({
  providers: [CloudinaryService],
  controllers: [UploadController],
  exports: [CloudinaryService],
})
export class UploadModule {}
