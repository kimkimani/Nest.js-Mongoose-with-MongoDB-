import { IsNotEmpty } from 'class-validator';

export default class CreatePostDto {
  @IsNotEmpty({ message: 'Field $property cannot be empty.' })
  title: string;

  @IsNotEmpty({ message: 'Field $property is not a valid date.' })
  body: string;
}
