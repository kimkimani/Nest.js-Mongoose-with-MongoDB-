import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorsModule } from './authors/authors.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/blog_app', {

  }),
  PostsModule,
  AuthorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
