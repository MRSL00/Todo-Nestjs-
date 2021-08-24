import { Todo } from './todo.entity';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class TodoService {
  constructor(
    @Inject(REQUEST)
    private readonly request,
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async getTodo(id: number, token): Promise<Todo | string> {
    const user = this.request.user;

    if (token !== user.token) {
      return 'Please login';
    }

    const todo = await this.todoRepository.findOne({
      id,
      user: user,
    });

    if (!todo) {
      throw new NotFoundException();
    }

    return todo;
  }

  async getTodos(token): Promise<Todo[] | string> {
    const user = this.request.user;

    if (token !== user.token) {
      return 'Please login';
    }
    return await this.todoRepository.find({ user: user });
  }

  async createTodo(todo: Todo, token): Promise<Todo | string> {
    const user = this.request.user;

    if (token !== user.token) {
      return 'Please login';
    }
    return await this.todoRepository.save({ ...todo, user: user });
  }

  async updateTodo(id: number, todo: Todo, token): Promise<Todo | string> {
    const user = this.request.user;

    if (token !== user.token) {
      return 'Please login';
    }

    const oldTodo = await this.todoRepository.findOne({
      id,
      user: user,
    });

    if (!oldTodo) {
      throw new NotFoundException();
    }

    const newTodo = {
      ...oldTodo,
      ...todo,
    };

    return await this.todoRepository.save(newTodo);
  }

  async deleteTodo(id: number, token: string): Promise<boolean | string> {
    const user = this.request.user;

    if (token !== user.token) {
      return 'Please login';
    }
    await this.todoRepository.delete({ id, user: user });
    return true;
  }
}
