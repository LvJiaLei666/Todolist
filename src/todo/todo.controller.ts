import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TodoService } from '@/todo/todo.service';
import CreateTodoDto from '@/todo/dto/createTodo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAllTodos() {
    return this.todoService.getAllTodos();
  }

  @Get(':id')
  async getTodo(@Param('id') id: string) {
    try {
      await this.todoService.getTodo(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // 处理资源未找到的情况，返回适当的响应
        return { error: error.message };
      } else {
        // 处理其他可能的错误
        throw error;
      }
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.createTodo(createTodoDto);
  }

  @Put(':id')
  updateTodo(
    @Param('id') id: number,
    @Body('status') status: number,
    @Body('content') content: string,
    @Body('title') title: string,
  ) {
    return this.todoService.updateTodo(id, status, content, title);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: number) {
    return this.todoService.deleteTodo(id);
  }
}
