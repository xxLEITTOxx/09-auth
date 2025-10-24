"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import css from "./page.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Loader from "@/components/Loader/Loader";
import { NoteTag } from "@/types/note";
import Link from "next/link";
import { fetchNotes } from "@/lib/api/clientApi";

interface NotesClientProps {
  tag?: NoteTag | "";
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const changeQuery = useDebouncedCallback((query: string) => {
    setQuery(query);
    setPage(1);
  }, 1000);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", query, page, tag],
    queryFn: () => fetchNotes(query, page, tag),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox setQuery={changeQuery} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      {isLoading && <Loader />}
      {isError ? (
        <ErrorMessage />
      ) : (
        data && <NoteList notes={data.notes.length > 0 ? data.notes : []} />
      )}
    </div>
  );
}
