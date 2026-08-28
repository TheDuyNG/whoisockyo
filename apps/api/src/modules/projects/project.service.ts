import type { ProjectInput, ProjectUpdate } from '@whoisockyo/shared';

import { AppError } from '../../utils/app-error.js';
import { projectRepository } from './project.repository.js';

async function ensureUniqueSlug(slug: string, currentProjectId?: string): Promise<void> {
  const projectWithSlug = await projectRepository.findBySlug(slug);

  if (projectWithSlug && projectWithSlug.id !== currentProjectId) {
    throw new AppError(409, 'PROJECT_SLUG_CONFLICT', 'This project slug is already in use.');
  }
}

async function requireProject(id: string) {
  const project = await projectRepository.findById(id);

  if (!project) {
    throw new AppError(404, 'PROJECT_NOT_FOUND', 'The requested project could not be found.');
  }

  return project;
}

export const projectService = {
  listPublished() {
    return projectRepository.findPublished();
  },

  listAll() {
    return projectRepository.findAll();
  },

  async getPublishedBySlug(slug: string) {
    const project = await projectRepository.findPublishedBySlug(slug);

    if (!project) {
      throw new AppError(404, 'PROJECT_NOT_FOUND', 'The requested project could not be found.');
    }

    return project;
  },

  async getById(id: string) {
    return requireProject(id);
  },

  async create(input: ProjectInput) {
    await ensureUniqueSlug(input.slug);
    return projectRepository.create(input);
  },

  async update(id: string, input: ProjectUpdate) {
    await requireProject(id);

    if (input.slug) {
      await ensureUniqueSlug(input.slug, id);
    }

    return projectRepository.update(id, input);
  },

  async delete(id: string) {
    await requireProject(id);
    return projectRepository.delete(id);
  },
};
