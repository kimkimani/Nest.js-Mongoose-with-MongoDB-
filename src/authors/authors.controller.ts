import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import AuthorResponseDTO from './dto/author-response.dto';
import PostResponseDTO from 'src/posts/dto/post.response.dto';
import { AuthorsService } from './authors.service';
import CreateAuthorDto from './dto/create-author.dto';
import CreatePostDto from 'src/posts/dto/create-post.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  // Endpoint to get the count of authors
  @Get('count')
  count(): Promise<number> {
    return this.authorsService.count();
  }

  // Endpoint to get all authors
  @Get()
  findAll(): Promise<Array<AuthorResponseDTO>> {
    return this.authorsService.findAll();
  }

  // Endpoint to add a new author
  @Post()
  add(@Body() requestDto: CreateAuthorDto): Promise<AuthorResponseDTO> {
    return this.authorsService.addAuthor(requestDto);
  }

  // Endpoint to add a new post to a specific author
  @Post(':id/posts')
  addPost(
    @Param('id') id: string,
    @Body() requestDto: CreatePostDto,
  ): Promise<PostResponseDTO> {
    return this.authorsService.addPost(id, requestDto);
  }

  // Endpoint to delete an author by ID
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.authorsService.delete(id);
  }
}
