/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FossilItem {
  id: string;
  name: string;
  scientificName?: string;
  depth: number;
  era: string;
  description: string;
  unlocked: boolean;
  type: 'fossil' | 'dinosaur' | 'origin' | 'archaeology';
  details: string[];
  graphicType: string;
}

export interface GeologicLayer {
  id: string;
  name: string;
  rangeName: string;
  targetDepth: number; // in meters (0, 50, 500, 800, 3000)
  eraText: string;
  colorTheme: {
    sky: string;
    background: string;
    cardboardBg: string;
    caveBorder: string;
    textAccent: string;
    accentGlow: string;
  };
  description: string;
  fossils: FossilItem[];
}
