export type BadgeType = 'reforestacion' | 'reciclaje' | 'general';

export interface UserBadge {
  id?: number;
  code: string;
  type: BadgeType;
  iconName: string;
  titleKey: string;
  descriptionKey: string;
  earnedAt: string;
}

export interface BadgeProgress {
  code: string;
  type: BadgeType;
  iconName: string;
  titleKey: string;
  descriptionKey: string;
  current: number;
  target: number;
  earned: boolean;
  percentage: number;
}

export interface UserBadgeSummary {
  earnedBadges: UserBadge[];
  progress: BadgeProgress[];
}
