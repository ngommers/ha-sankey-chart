import { LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import {UNIT_PREFIXES} from './const';

declare global {
  interface HTMLElementTagNameMap {
    'sankey-chart-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

export type BoxType = 'entity' | 'passthrough' | 'remaining_parent_state' | 'remaining_child_state';

export interface EntityConfig {
  entity_id: string;
  add_entities?: string[];
  substract_entities?: string[];
  attribute?: string;
  type?: BoxType;
  children?: string[];
  unit_of_measurement?: string; // for attribute
  color?: string;
  name?: string;
  color_on_state?: boolean;
  color_above?: string;
  color_below?: string;
  color_limit?: number;
  // @deprecated
  remaining?: string | {
    name: string;
    color?: string;
  },
}

export type EntityConfigInternal = EntityConfig & {
  children: string[];
  accountedState?: number;
  foundChildren?: string[];
}

export type EntityConfigOrStr = string | EntityConfig;

export interface SectionConfig {
  entities: EntityConfigOrStr[];
}

export interface SankeyChartConfig extends LovelaceCardConfig {
  type: string;
  autoconfig?: {
    print_yaml?: boolean
  };
  title?: string;
  sections?: SectionConfig[];
  unit_prefix?: '' | keyof typeof UNIT_PREFIXES;
  round?: number;
  height?: number;
  wide?: boolean;
  show_icons?: boolean;
  show_names?: boolean;
  show_states?: boolean;
  show_units?: boolean;
  energy_date_selection?: boolean;
  min_box_height?: number,
  min_box_distance?: number,
  throttle?: number,
}

export interface Section {
  entities: EntityConfigInternal[];
}

export interface Config extends SankeyChartConfig {
  unit_prefix: '' | keyof typeof UNIT_PREFIXES;
  round: number;
  height: number;
  min_box_height: number;
  min_box_distance: number;
  sections: Section[];
}

export interface Connection {
  startY: number;
  startSize: number;
  endY: number;
  endSize: number;
  state: number;
  startColor?: string;
  endColor?: string;
  highlighted?: boolean,
}

export interface Box {
  config: EntityConfigInternal;
  entity: Omit<HassEntity, 'state'> & {
    state: string | number;
  };
  entity_id: string;
  state: number;
  unit_of_measurement?: string;
  children: string[];
  color: string;
  size: number;
  top: number;
  extraSpacers?: number;
  connections: {
    parents: Connection[];
  }
}

export interface SectionState {
  boxes: Box[],
  total: number,
  spacerH: number,
  statePerPixelY: number,
}

export interface ConnectionState {
  parent: EntityConfigInternal,
  child: EntityConfigInternal,
  state: number,
  prevParentState: number,
  prevChildState: number,
  ready: boolean,
  highlighted?: boolean,
}

export interface NormalizedState {
  state: number,
  unit_of_measurement?: string,
}
