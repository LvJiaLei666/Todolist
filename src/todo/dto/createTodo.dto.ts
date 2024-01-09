import { TodoStatusEnum } from '../enum/todoStatus.enum';
import { IsNotEmpty } from 'class-validator';

export default class CreateTodoDto {
  @IsNotEmpty({ message: '标题不能为空' })
  readonly title: string;
  @IsNotEmpty({ message: '内容不能为空' })
  readonly content: string;
  readonly status: TodoStatusEnum;
}
