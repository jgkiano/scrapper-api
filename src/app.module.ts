import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ServiceModule } from './services/service.module';

@Module({
  imports: [ServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
