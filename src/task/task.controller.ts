import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Task, TaskService } from './task.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('tasks')
//@UseGuards(AuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('/')
  listTasks(): Task[] {
    return this.taskService.listTasks();
  }

  @Post('/')
  createTask(@Body() task: Task): Task {
    return this.taskService.createTask(task);
  }

  @Patch('/:id')
  updateTask(@Param('id') id: number, @Body() task: Task): Task {
    const updatedTask = this.taskService.updateTask({ id, ...task });
    if (!updatedTask) {
      throw new HttpException('Task not found', 404);
    }
    return updatedTask;
  }

  @Patch(':id/done')
  toggleTaskDone(@Param('id') id: number): Promise<void> {
    return this.taskService.toggleTaskDone(id);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: number): Promise<void> {
    return this.taskService.deleteTask(id);
  }
}
