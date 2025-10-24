import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import NotesClient from "./Notes.client";
import { NoteTag } from "@/types/note";
import { Metadata } from "next";
import { fetchNotes } from "@/lib/api/serverApi";

type NotesProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === "All" ? "All" : (slug[0] as NoteTag);

  return {
    title: `Notes: ${tag}`,
    description:
      "Browse your notes, stay organized, and manage your ideas with NoteHub.",
    openGraph: {
      title: `Notes: ${tag}`,
      description:
        "Browse your notes, stay organized, and manage your ideas with NoteHub.",
      url: `https://08-zustand-nine-eta.vercel.app/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub image",
        },
      ],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const queryClient = new QueryClient();

  const { slug } = await params;

  const tag = slug[0] === "All" ? undefined : (slug[0] as NoteTag);

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () => fetchNotes("", 1, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
