
import { IsNotEmpty, IsDateString } from 'class-validator';

export default class CreateAuthorDto {

    @IsNotEmpty({ message: 'Field $property is not a valid name.' })
    name: string;

    @IsNotEmpty({ message: 'Field $property is not a valid nickname.' })
    nickname: string;

    @IsNotEmpty({ message: 'Field $property is not a valid date.' })
    @IsDateString({}, { message: 'Field $property is not a valid date.' })
    birthDate: string;
}
