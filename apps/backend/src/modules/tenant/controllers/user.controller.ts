import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../../core/auth/decorators';
import { Role } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { CurrentUser } from '../../../core/auth/current-user.decorator';
import { JwtPayload } from '../../../core/auth/interfaces/jwt-payload.interface';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('tenants/me/users')
@Roles(Role.ADMIN) // Apenas administradores do tenant podem gerenciar usuários
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private listUsersUseCase: ListUsersUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário no tenant' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async create(@CurrentUser() user: JwtPayload, @Body() body: CreateUserDto) {
    return this.createUserUseCase.execute(user.tenantId, body);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários do tenant' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async findAll(@CurrentUser() user: JwtPayload) {
    return this.listUsersUseCase.execute(user.tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(user.tenantId, id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um usuário' })
  @ApiResponse({ status: 204, description: 'Usuário removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.deleteUserUseCase.execute(user.tenantId, id);
  }
}
