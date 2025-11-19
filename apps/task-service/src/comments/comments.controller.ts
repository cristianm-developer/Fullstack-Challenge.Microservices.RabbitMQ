import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentsService } from './comments.service';
import { COMMENT_PATTERNS,  CreateCommentDto } from '@repo/types';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @MessagePattern(COMMENT_PATTERNS.CREATE_COMMENT)
  async create(@Payload() createCommentDto: CreateCommentDto) {
    return await this.commentsService.create(createCommentDto);
  }

  @MessagePattern(COMMENT_PATTERNS.FIND_ALL_COMMENTS)
  async findAll(@Payload() taskId: number) {
    return await this.commentsService.findAll(taskId);
  }

}
