import type { Request, Response } from 'express';
import type { ProjectInput, ProjectUpdate } from '@whoisockyo/shared';

import { sendNoContent, sendSuccess } from '../../utils/api-response.js';
import { getValidatedBody } from '../../utils/validated-request.js';
import { projectService } from './project.service.js';

export const projectController = {
  async listPublished(_request: Request, response: Response): Promise<void> {
    const projects = await projectService.listPublished();
    sendSuccess(response, 200, projects, 'Projects retrieved successfully.');
  },

  async listAll(_request: Request, response: Response): Promise<void> {
    const projects = await projectService.listAll();
    sendSuccess(response, 200, projects, 'Projects retrieved successfully.');
  },

  async getPublished(request: Request, response: Response): Promise<void> {
    const project = await projectService.getPublishedBySlug(request.params.slug!);
    sendSuccess(response, 200, project, 'Project retrieved successfully.');
  },

  async create(request: Request, response: Response): Promise<void> {
    const project = await projectService.create(getValidatedBody<ProjectInput>(request));
    sendSuccess(response, 201, project, 'Project created successfully.');
  },

  async update(request: Request, response: Response): Promise<void> {
    const project = await projectService.update(
      request.params.id!,
      getValidatedBody<ProjectUpdate>(request),
    );
    sendSuccess(response, 200, project, 'Project updated successfully.');
  },

  async delete(request: Request, response: Response): Promise<void> {
    await projectService.delete(request.params.id!);
    sendNoContent(response);
  },
};
