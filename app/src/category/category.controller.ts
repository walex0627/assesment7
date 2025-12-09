import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
// 🔑 Import the Roles decorator
import { Roles } from 'src/common/decorators/roles.decorator'; 


@ApiTags('Categories')
@Controller('categories')
// NOTE: Assuming PolicyGuard/JwtAuthGuard is configured GLOBALLY.
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // 🔑 CREATE CATEGORY - Requires Administrator Role
  @Post()
  @Roles('Administrator') 
  @ApiOperation({
      summary: 'Create a new category (Admin Only)',
      description: 'Creates a new category used to classify support tickets. Requires Administrator role.',
  })
  @ApiBody({
      type: CreateCategoryDto,
      examples: {
          basic: {
              summary: 'Basic category creation example',
              value: {
                  title: 'Software Bugs',
                  description: 'Issues related to application logic or code errors.',
              } as CreateCategoryDto,
          },
      },
  })
  @ApiResponse({
      status: 201,
      description: 'Category successfully created.',
      type: Category,
  })
  @ApiResponse({
      status: 403,
      description: 'Forbidden resource (Role is not Administrator).',
  })
  async create(@Body() dto: CreateCategoryDto): Promise<Category> {
      return await this.categoryService.createCategory(dto);
  }

  // 🔑 GET ALL CATEGORIES - Requires Administrator Role
  @Get()
  @Roles('Administrator') 
  @ApiOperation({
      summary: 'Get all categories (Admin Only)',
      description: 'Retrieves a list of all ticket categories. Requires Administrator role.',
  })
  @ApiResponse({
      status: 200,
      description: 'List of categories retrieved successfully.',
      type: [Category],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource (Role is not Administrator).',
  })
  async findAll(): Promise<Category[]> {
      return await this.categoryService.getAllCategories();
  }

  // 🔑 GET CATEGORY BY ID - Requires Administrator Role
  @Get(':id')
  @Roles('Administrator') 
  @ApiOperation({
      summary: 'Get a category by ID (Admin Only)',
      description: 'Retrieves a single category using its unique ID. Requires Administrator role.',
  })
  @ApiParam({
      name: 'id',
      description: 'Category ID',
      example: 1,
  })
  @ApiResponse({
      status: 200,
      description: 'Category found successfully.',
      type: Category,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource (Role is not Administrator).',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
      return await this.categoryService.getCategoryById(id);
  }

  // 🔑 UPDATE CATEGORY - Requires Administrator Role
  @Patch(':id')
  @Roles('Administrator') 
  @ApiOperation({
      summary: 'Update a category (Admin Only)',
      description: 'Updates an existing category\'s title or description. Requires Administrator role.',
  })
  @ApiParam({
      name: 'id',
      description: 'Category ID',
      example: 1,
  })
  @ApiResponse({
      status: 200,
      description: 'Category successfully updated.',
      type: Category,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource (Role is not Administrator).',
  })
  async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
      return await this.categoryService.updateCategory(id, dto);
  }

  // 🔑 DELETE CATEGORY (HARD DELETE) - Requires Administrator Role
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  @Roles('Administrator') 
  @ApiOperation({
      summary: 'Permanently delete a category (Admin Only)',
      description: 'Removes the category record. Will fail if linked to existing tickets. Requires Administrator role.',
  })
  @ApiParam({
      name: 'id',
      example: 3,
      description: 'Category ID',
  })
  @ApiResponse({
      status: 204,
      description: 'Category deleted successfully (No Content).',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource (Role is not Administrator).',
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
      await this.categoryService.deleteCategory(id);
  }
}