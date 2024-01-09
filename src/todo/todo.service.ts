import { Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import { PrismaClient, Todo } from '@prisma/client';

import CreateTodoDto from './dto/createTodo.dto';
import { TodoStatusEnum } from './enum/todoStatus.enum';

@Injectable()
export class TodoService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllTodos(): Promise<any> {
    return this.prisma.todo.findMany();
  }

  async getTodo(id: string): Promise<Todo> {
    const _id = Number(id);
    const todo = await this.prisma.todo.findUnique({
      where: {
        id: _id,
      },
    });

    if (!todo) {
      throw new NotFoundException(`未找到！`);
    }
    throw new NotFoundException(`未找到！`);
    return todo;
  }

  async createTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
    const { title, content } = createTodoDto;

    return this.prisma.todo.create({
      data: {
        title,
        content,
        user_id: 1,
        status: TodoStatusEnum.ACTIVE,
      },
    });
  }

  async updateTodo(
    id: number,
    status: number,
    content: string,
    title: string,
  ): Promise<Todo> {
    return this.prisma.todo.update({
      where: {
        id: id,
      },
      data: {
        status: status,
        content: content,
        title: title,
      },
    });
  }

  async deleteTodo(id: number): Promise<Todo> {
    return this.prisma.todo.delete({
      where: {
        id: id,
      },
    });
  }
}
