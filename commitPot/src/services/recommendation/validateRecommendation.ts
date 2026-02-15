import { RecommendationInput } from '../../domain/recommendation';

type CandidateLike = {
  veggie_ids: string[];
  mushroom_id: string;
};

export const isValidRecommendationCandidate = (
  candidate: CandidateLike,
  input: RecommendationInput
): candidate is CandidateLike & { veggie_ids: [string, string] } => {
  if (!Array.isArray(candidate.veggie_ids) || candidate.veggie_ids.length !== 2) return false;
  if (!input.candidateMushroomIds.includes(candidate.mushroom_id)) return false;

  const [vegA, vegB] = candidate.veggie_ids;
  const validVegA = input.candidateVeggieIds.includes(vegA);
  const validVegB = input.candidateVeggieIds.includes(vegB);
  const bothNonMushroom =
    !input.candidateMushroomIds.includes(vegA) && !input.candidateMushroomIds.includes(vegB);

  return validVegA && validVegB && bothNonMushroom;
};
