import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('todo')
@UseGuards(AuthGuard('jwt'))
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getTodos(@Request() req) {
    return await this.todoService.getTodos(
      req.headers.authorization.split(' ')[1],
    );
  }

  @Get(':id')
  async getTodo(@Param('id') id: number, @Request() req) {
    return await this.todoService.getTodo(
      id,
      req.headers.authorization.split(' ')[1],
    );
  }

  @Post()
  async createTodo(@Body() todo: Todo, @Request() req) {
    return await this.todoService.createTodo(
      todo,
      req.headers.authorization.split(' ')[1],
    );
  }

  @Put(':id')
  async updateTodo(
    @Param('id') id: number,
    @Body() todo: Todo,
    @Request() req,
  ) {
    return await this.todoService.updateTodo(
      id,
      todo,
      req.headers.authorization.split(' ')[1],
    );
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: number, @Request() req) {
    return await this.todoService.deleteTodo(
      id,
      req.headers.authorization.split(' ')[1],
    );
  }
}
