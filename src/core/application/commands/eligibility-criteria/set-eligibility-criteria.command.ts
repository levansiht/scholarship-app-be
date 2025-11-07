export class SetEligibilityCriteriaCommand {
  constructor(
    public readonly scholarshipId: string,
    public readonly minGpa?: number,
    public readonly maxGpa?: number,
    public readonly allowedMajors?: string[],
    public readonly allowedYearOfStudy?: number[],
    public readonly minAge?: number,
    public readonly maxAge?: number,
    public readonly requiredNationality?: string,
    public readonly otherRequirements?: string,
  ) {}
}
