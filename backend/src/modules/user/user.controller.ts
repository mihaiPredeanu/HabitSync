
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';
import { BulkUpsertUserDto } from './dto/bulk-upsert-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }

  /**
   * Bulk upsert endpoint for robust two-way sync
   */
  @Post('bulk-upsert')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async bulkUpsert(@Body() dto: BulkUpsertUserDto) {
    return this.userService.bulkUpsert(dto);
  }

  @Post('register-push-token')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async registerPushToken(@Body() dto: RegisterPushTokenDto) {
    return this.userService.registerPushToken(dto);
  }
}
