import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigReader } from './config/config-reader';
import { IConfig } from './config.interface';

declare const module: any;

async function bootstrap() {
    const configReader = new ConfigReader<IConfig>('./config.json');
    if (!configReader.load()) {
        return -1;
    }

    const config = configReader.config;

    const app = await NestFactory.create(AppModule.forRoot(config));
    await app.listen(config.port);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
