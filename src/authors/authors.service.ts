import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { validateOrReject } from 'class-validator';
import { Model, Types } from 'mongoose';

import AuthorResponseDTO from './dto/author-response.dto';
import PostResponseDTO from 'src/posts/dto/post.response.dto';
import { PostDocument, Post } from 'src/posts/entities/post.entity';
import { AuthorDocument } from './entities/author.entity';
import CreatePostDto from 'src/posts/dto/create-post.dto';
import CreateAuthorDto from './dto/create-author.dto';

@Injectable()
export class AuthorsService {
  private readonly logger = new Logger(AuthorsService.name);

  constructor(
    @InjectModel('Author') private authorModel: Model<AuthorDocument>,
    @InjectModel('Post') private postModel: Model<PostDocument>,
  ) {}

  async count(): Promise<number> {
    try {
      return await this.authorModel.countDocuments().exec();
    } catch (error) {
      throw new HttpException('Error counting authors', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Array<AuthorResponseDTO>> {
    try {
      const authors = await this.authorModel.find().exec();
      return authors.map(AuthorResponseDTO.from);
    } catch (error) {
      throw new HttpException('Error fetching authors', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string): Promise<AuthorResponseDTO> {
    const _id = new Types.ObjectId(id);
    const author = await this.authorModel.findById(_id).exec();
    return AuthorResponseDTO.from(author);
  }

  async addAuthor(requestDto: CreateAuthorDto): Promise<AuthorResponseDTO> {
    await validateOrReject(requestDto);
    try {
      const newAuthor = new this.authorModel();
      newAuthor.realname = requestDto.name;
      newAuthor.nickname = requestDto.nickname;
      newAuthor.birthDate = requestDto.birthDate;
      const author = await newAuthor.save();
      return AuthorResponseDTO.from(author);
    } catch (error) {
      throw new HttpException(
        'Error saving the author',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addPost(
    id: string,
    requestDto: CreatePostDto,
  ): Promise<PostResponseDTO> {
    await validateOrReject(requestDto);
    try {
      const newPost = new this.postModel(requestDto as Post);
      const _id = new Types.ObjectId(id);
      const author = await this.authorModel.findById(_id).exec();
      newPost.author = author;
      newPost.creationDate = new Date().toISOString().slice(0, 10);
      const post = await newPost.save();
      return PostResponseDTO.from(post);
    } catch (error) {
      throw new HttpException('Error saving the post', HttpStatus.BAD_REQUEST);
    }
  }

  async delete(id: string) {
    try {
      const _id = new Types.ObjectId(id);
      return await this.authorModel.findByIdAndDelete(_id).exec();
    } catch (error) {
      throw new HttpException(
        'Error deleting the author',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
