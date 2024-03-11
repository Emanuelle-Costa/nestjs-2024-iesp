import { HttpException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type Task = {
  id: number;
  title: string;
  done: boolean;
};

interface ITaskService {
  listTasks(): Task[];
  createTask(task: Task): Task;
  updateTask(task: Task): Task;
  deleteTask(id: number): Promise<void>;
}

@Injectable()
export class TaskService implements ITaskService {
  tasks: Task[] = [];

  createTask(task: Task): Task {
    const newTask: Task = {
      id: uuidv4(),
      ...task,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  listTasks(): Task[] {
    return this.tasks;
  }

  updateTask(task: Task): Task {
    const localTask = this.findOne(task.id);
    if (!localTask) {
      throw new HttpException('Task not found', 404);
    }

    localTask.title = task.title;
    localTask.done = task.done;
    return localTask;
  }
  
  async toggleTaskDone(taskId: number): Promise<void> {
    const task = this.findOne(taskId);
    if (!task) {
      throw new HttpException('Task not found', 404);
    }
    task.done = !task.done;
    await this.updateTask(task);
  }

  async deleteTask(taskId: number): Promise<void> {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      throw new HttpException('Task not found', 404);
    }
    this.tasks.splice(taskIndex, 1);
    return;
  }

  findOne(id: number): Task {
    return this.tasks.find((item) => item.id === id);
  }
}
