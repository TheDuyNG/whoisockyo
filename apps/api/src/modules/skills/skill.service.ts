import type { SkillInput } from '@whoisockyo/shared';

import { AppError } from '../../utils/app-error.js';
import { skillRepository } from './skill.repository.js';

async function requireSkill(id: string) {
  const skill = await skillRepository.findById(id);

  if (!skill) {
    throw new AppError(404, 'SKILL_NOT_FOUND', 'The requested skill could not be found.');
  }

  return skill;
}

export const skillService = {
  list() {
    return skillRepository.findAll();
  },

  create(input: SkillInput) {
    return skillRepository.create(input);
  },

  async update(id: string, input: SkillInput) {
    await requireSkill(id);
    return skillRepository.update(id, input);
  },

  async delete(id: string) {
    await requireSkill(id);
    return skillRepository.delete(id);
  },
};
