import { TodoStatusEnum } from '@/todo/enum/todoStatus.enum';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export default class UpdateTodoDto {
  @IsNotEmpty({ message: 'status不能为空' })
  @IsEnum(TodoStatusEnum, { message: '参数有误' })
  @IsNumber({})
  readonly status: TodoStatusEnum;
  @IsNotEmpty({ message: 'content不能为空' })
  readonly content: string;
  @IsNotEmpty({ message: '标题不能为空' })
  readonly title: string;
}
