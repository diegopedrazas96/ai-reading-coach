import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import {
  AUDIO_FIELD_NAME,
  MAX_AUDIO_UPLOAD_BYTES,
  type TranscribeResponse,
} from '@reading-coach/shared';
import { TranscriptionConfiguredGuard } from './guards/transcription-configured.guard';
import { AudioFilePipe } from './pipes/audio-file.pipe';
import { TranscriptionService } from './transcription.service';

@Controller('transcribe')
export class TranscriptionController {
  constructor(private readonly transcription: TranscriptionService) {}

  /** Transcribes one in-memory audio upload; nothing is written to disk. */
  @Post()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @UseGuards(TranscriptionConfiguredGuard)
  @UseInterceptors(
    FileInterceptor(AUDIO_FIELD_NAME, {
      limits: { fileSize: MAX_AUDIO_UPLOAD_BYTES, files: 1 },
    }),
  )
  async transcribe(
    @UploadedFile(AudioFilePipe) file: Express.Multer.File,
  ): Promise<TranscribeResponse> {
    const transcript = await this.transcription.transcribe(file.buffer, file.mimetype);
    return { transcript };
  }
}
