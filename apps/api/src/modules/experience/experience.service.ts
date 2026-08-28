import type { ExperienceInput } from '@whoisockyo/shared';

import { AppError } from '../../utils/app-error.js';
import { experienceRepository } from './experience.repository.js';

async function getExperience(id: string) {
  const experience = await experienceRepository.findById(id);

  if (!experience) {
    throw new AppError(
      404,
      'EXPERIENCE_NOT_FOUND',
      'The requested experience entry was not found.',
    );
  }

  return experience;
}

export const experienceService = {
  list() {
    return experienceRepository.findAll();
  },

  create(input: ExperienceInput) {
    return experienceRepository.create(input);
  },

  async update(id: string, input: ExperienceInput) {
    await getExperience(id);
    return experienceRepository.update(id, input);
  },

  async delete(id: string) {
    await getExperience(id);
    return experienceRepository.delete(id);
  },
};
