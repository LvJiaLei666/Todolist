import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { TodoService } from '@/todo/todo.service';
import CreateTodoDto from '@/todo/dto/createTodo.dto';
import UpdateTodoDto from '@/todo/dto/updateTodo.dto';
import { NotFoundExceptionFilter } from '@/core/filter/notFoundException/notFoundException.filter';

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
      return await this.todoService.getTodo(id);
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    const { status, content, title } = updateTodoDto;
    return this.todoService.updateTodo(id, status, content, title);
  }

  @Delete(':id')
  @UseFilters(NotFoundExceptionFilter)
  async deleteTodo(@Param('id') id: number) {
    try {
      await this.todoService.deleteTodo(id);
    } catch (error) {
      console.log(error);
    }
  }
}
