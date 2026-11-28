import type { Metadata } from "next";
import { AdmissionHome } from "@/components/admission/AdmissionHome";
import { getDestinations, getUniversities } from "@/lib/admission";

export const metadata: Metadata = {
  title: "Admission",
  description: "Where your SAT score can take you: spin the globe, pick a destination and see its universities, their requirements, deadlines and tuition.",
};

export default function Page() {
  const destinations = getDestinations().map(({ slug, name, lat, lon }) => ({ slug, name, lat, lon, count: getUniversities(slug).length }));
  return <AdmissionHome destinations={destinations} />;
}
