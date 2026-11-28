import { PAGE } from "@/lib/ui";
import { AdmissionGlobe } from "./AdmissionGlobe";
import { DestinationList } from "./DestinationList";

interface HomeDestination {
  slug: string;
  name: string;
  lat: number;
  lon: number;
  /** Number of universities. */
  count: number;
}

/** /admission: the globe and, next to it (under it on a phone), the list of destinations. */
export function AdmissionHome({ destinations }: { destinations: HomeDestination[] }) {
  return (
    <section className={PAGE}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Admission</h1>
      <p className="mt-2 max-w-2xl text-muted">Where can your SAT score take you? Spin the globe and pick a destination to see its universities and what they ask for.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
        <AdmissionGlobe destinations={destinations.map(({ slug, name, lat, lon }) => ({ slug, name, lat, lon }))} />
        <DestinationList destinations={destinations.map(({ slug, name, count }) => ({ slug, name, count }))} />
      </div>
    </section>
  );
}
