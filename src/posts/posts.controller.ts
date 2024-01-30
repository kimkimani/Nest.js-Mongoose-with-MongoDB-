import { Controller, Get, Post, Param, Body, Delete, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import PostResponseDTO from './dto/post.response.dto';
import CreatePostDto from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(
    @Query('authorName') authorName: string,
  ): Promise<Array<PostResponseDTO>> {
    return this.postsService.findPostsAndAuthor(authorName);
  }
  
  // Ecreating a new post
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto): Promise<PostResponseDTO> {
    // Call the AddNew to handle post creation
    return this.postsService.AddNew(createPostDto);
  }

  // retrieving a post by ID
  @Get('/:id')
  async getPost(@Param('id') id: string): Promise<any> {
    // Use to findOne retrieve a post by ID
    return this.postsService.findOne(id);
  }

  // retrieving all posts
  @Get()
  async getAllPosts(): Promise<Array<PostResponseDTO>> {
    // Use findAll service to get all posts
    return this.postsService.findAll();
  }

  // deleting a post by ID
  @Delete('/:id')
  async deletePost(@Param('id') id: string): Promise<any> {
    return this.postsService.delete(id);
  }
}
