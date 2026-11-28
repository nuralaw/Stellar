import { HONG_KONG } from "./hong-kong";
import type { Destination, DestinationData, University } from "./types";

export type { Destination, DestinationData, SourceRef, TestPolicy, University } from "./types";

/** Every destination. To add one: a new data file next to hong-kong.ts and one entry here. */
const DATA: DestinationData[] = [HONG_KONG];

export function getDestinations(): Destination[] {
  return DATA.map((d) => d.destination);
}

export function getDestination(slug: string): Destination | undefined {
  return DATA.find((d) => d.destination.slug === slug)?.destination;
}

export function getUniversities(destination: string): University[] {
  return DATA.find((d) => d.destination.slug === destination)?.universities ?? [];
}

export function getUniversity(destination: string, slug: string): University | undefined {
  return getUniversities(destination).find((u) => u.slug === slug);
}
