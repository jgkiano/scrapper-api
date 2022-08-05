import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AuthController } from './controllers/auth.controller';
import { CustomerController } from './controllers/customer.controller';
import { OrganizationController } from './controllers/organization.controller';
import { ScrapeController } from './controllers/scrape.controller';
import { AppService } from './services/app.service';
import { ServiceModule } from './services/service.module';

@Module({
  imports: [ServiceModule],
  controllers: [
    AppController,
    OrganizationController,
    CustomerController,
    AuthController,
    ScrapeController,
  ],
  providers: [AppService],
})
export class AppModule {}
