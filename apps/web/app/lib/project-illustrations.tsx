import type { ComponentType, SVGProps } from 'react';
import {
  IllustrationNSide,
  IllustrationTris,
  IllustrationPayflip,
  IllustrationRecolonizer,
  IllustrationGlutton,
  IllustrationCowboyInvestor,
  IllustrationThisWebsite,
} from '@personal/ui';

const map: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  'n-side': IllustrationNSide,
  tris: IllustrationTris,
  payflip: IllustrationPayflip,
  recolonizer: IllustrationRecolonizer,
  'glutton-for-gluten': IllustrationGlutton,
  'cowboy-investor': IllustrationCowboyInvestor,
  'this-website': IllustrationThisWebsite,
};

export function getProjectIllustration(slug: string) {
  return map[slug] ?? null;
}
