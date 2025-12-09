import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    /**
     * Creates a new category for tickets.
     */
    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        try {
            const category = this.categoryRepository.create(createCategoryDto);
            return await this.categoryRepository.save(category);
        } catch (error) {
            // Check for PostgreSQL unique constraint error (e.g., if 'title' is unique)
            if (error.code === '23505') { 
                throw new ConflictException('Category title already exists.');
            }
            throw new InternalServerErrorException('Failed to create category due to an unexpected error.');
        }
    }

    /**
     * Retrieves all categories.
     */
    async getAllCategories(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    /**
     * Retrieves a category by ID. Throws NotFoundException if not found.
     */
    async getCategoryById(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found.`);
        }
        return category;
    }

    /**
     * Updates an existing category.
     * Throws NotFoundException if the category doesn't exist.
     */
    async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.getCategoryById(id); // Handles 404
        
        // Merge updates into the existing entity
        this.categoryRepository.merge(category, updateCategoryDto);

        try {
            return await this.categoryRepository.save(category);
        } catch (error) {
            // Check for PostgreSQL unique constraint error
            if (error.code === '23505') { 
                throw new ConflictException('Update failed: Category title already exists.');
            }
            throw new InternalServerErrorException('Failed to update category due to an unexpected error.');
        }
    }

    /**
     * Deletes a category by ID (Hard Delete).
     * Throws NotFoundException if the category doesn't exist.
     * Note: Deletion might be restricted by foreign key constraints from the Ticket entity.
     */
    async deleteCategory(id: number): Promise<void> {
        // First check if it exists to provide a clean 404
        await this.getCategoryById(id);
        
        try {
            const result = await this.categoryRepository.delete(id);
            if (result.affected === 0) {
                // Should not happen if getCategoryById passed, but kept as a safeguard
                throw new NotFoundException(`Category with ID ${id} not found.`);
            }
        } catch (error) {
            // Handle foreign key constraint error if tickets are using this category
            if (error.code === '23503') { 
                throw new ConflictException('Cannot delete category because it is currently linked to one or more tickets.');
            }
            throw new InternalServerErrorException('Failed to delete category due to an unexpected error.');
        }
    }
}