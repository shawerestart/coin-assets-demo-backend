require('dotenv').config(); // 加载 .env 中的配置到环境变量
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RequestMiddleware } from '@common/request.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';
import {
  rateLimitHandler,
  rateLimitSkipHandler,
} from './common/handlers/rateLimit.handler';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 请求处理中间件：处理 traceID
  app.use(RequestMiddleware);
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 100 * 60, // limit each IP to 100 requests per windowMs
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      handler: rateLimitHandler,
      skip: rateLimitSkipHandler,
    }),
  );

  // 跨域配置
  app.enableCors();
  // 静态文件配置，路径前缀为 static
  // app.useStaticAssets(join(__dirname, '..', 'static'), {
  //   prefix: '/static/',
  // });
  // 静态文件配置，路径前缀为 /，用于部署非前端构建的静态文件
  // app.useStaticAssets(join(__dirname, '..', 'public'));

  // 静态文件配置，路径前缀为 /，用于部署非前端构建的静态文件
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  app.setGlobalPrefix('/api');

  if (process.env.NODE_ENV !== 'production') {
    // swagger 文档
    const options = new DocumentBuilder()
      .setTitle('coinmarket Document')
      .setDescription('The API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    // const jsonPath = join(__dirname, '../public/openapi.json');
    // if (!fs.existsSync(jsonPath)) {
    //   await fs.promises.writeFile(jsonPath, '');
    // }
    // fs.writeFileSync(jsonPath, JSON.stringify(document));
    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(process.env.NEST_SERVER_PORT || 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
