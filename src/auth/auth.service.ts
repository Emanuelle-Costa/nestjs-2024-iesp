import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IsEmail, IsString, Length } from 'class-validator';

export class AuthRequest {
  @IsEmail()
  username: string;

  @IsString()
  @Length(6, 20)
  password: string;
}

export type User = {
  username: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
};

interface IAuthService {
  login(body: AuthRequest): AuthResponse;
  signup(body: AuthRequest): AuthResponse;
}

@Injectable()
export class AuthService implements IAuthService {
  users: User[];

  constructor(private jwtService: JwtService) {
    this.users = [];
    console.log('AuthService inicializado com sucesso.');
  }

  login(body: AuthRequest): AuthResponse {
    // TODO
    // Verificar se o usuário existe
    const user = this.users.find(u => u.username === body.username && u.password === body.password);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    const token = this.jwtService.sign({ username: body.username });
    console.log('Token recebido:', token);
    return {
      access_token: this.jwtService.sign({ username: body.username }),
    };
  }

  // TODO: Implement signup
  // Salvar no objeto local users
  // Retornar token
  signup(body: AuthRequest): AuthResponse {
    const existingUser = this.users.find(u => u.username === body.username);

    if (existingUser) {
      throw new Error('Username already exists');
    }

    const newUser: User = {
      username: body.username,
      password: body.password,
    };

    this.users.push(newUser);
    console.log('Novo usuário cadastrado:', newUser);

    return {
      access_token: this.jwtService.sign({ username: body.username }),
    };
  }
}
