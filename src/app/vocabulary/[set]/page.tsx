import type { Metadata } from "next";
import { SetPage, setMetadata, setStaticParams } from "./SetPage";

export function generateStaticParams() {
  return setStaticParams();
}

export async function generateMetadata({ params }: PageProps<"/vocabulary/[set]">): Promise<Metadata> {
  return setMetadata((await params).set);
}

export default async function Page({ params }: PageProps<"/vocabulary/[set]">) {
  return <SetPage id={(await params).set} mode="words" />;
}
