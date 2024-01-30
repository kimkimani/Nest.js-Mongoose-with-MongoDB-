import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostDocument } from './entities/post.entity';
import PostResponseDTO from './dto/post.response.dto';
import CreatePostDto from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthorDocument } from 'src/authors/entities/author.entity';


@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectModel('Author') private authorModel: Model<AuthorDocument>,
    @InjectModel('Post') private postModel: Model<PostDocument>,
  ) {}

  async findPostsAndAuthor(authorName: string): Promise<Array<PostResponseDTO>> {
    try {
      let query = this.postModel.find();
      if (authorName) {
        const authors = await this.authorModel
          .find()
          .where('realname')
          .regex(new RegExp(authorName, 'i'))
          .select('id')
          .exec();
        query = query.where('author').in(authors.map((author) => author._id));
      }
      const posts = await query.populate('author').sort('-creationDate').exec();
      return posts.map(PostResponseDTO.from);
    } catch (error) {
      throw new HttpException(
        'Error fetching posts and author',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<Array<PostResponseDTO>> {
    try {
      const posts = await this.postModel.find().sort('-creationDate').exec();
      return posts.map(PostResponseDTO.from);
    } catch (error) {
      throw new HttpException(
        'Error while fetching posts',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string): Promise<PostResponseDTO> {
    const _id = new Types.ObjectId(id);
    const post = await this.postModel.findById(_id).exec();
    return PostResponseDTO.from(post);
  }

  async delete(id: string) {
    try {
      const _id = new Types.ObjectId(id);
      return await this.postModel.findByIdAndDelete(_id).exec();
    } catch (error) {
      throw new HttpException(
        'Error deleting the post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async AddNew(createPostDto: CreatePostDto): Promise<PostResponseDTO> {
    try {
      const { title, body } = createPostDto;
      const newPost = await this.postModel.create({
        title,
        body,
        // creationDate is a string representing the date
        creationDate: new Date().toISOString(),
      });
      return PostResponseDTO.from(newPost);
    } catch (error) {
      throw new HttpException(
        'Error while creating a post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

}
