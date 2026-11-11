import {
  BadRequestException,
  Injectable,
  UnsupportedMediaTypeException,
  type PipeTransform,
} from '@nestjs/common';
import { isSupportedAudioType } from '../utils/audio';

/** Ensures an audio file was uploaded and is in a supported format. */
@Injectable()
export class AudioFilePipe implements PipeTransform<Express.Multer.File | undefined> {
  transform(file: Express.Multer.File | undefined): Express.Multer.File {
    if (!file) throw new BadRequestException('Audio file is required.');
    if (!isSupportedAudioType(file.mimetype)) {
      throw new UnsupportedMediaTypeException('Unsupported audio format.');
    }
    return file;
  }
}
