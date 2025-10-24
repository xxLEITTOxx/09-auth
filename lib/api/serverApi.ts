import { cookies } from "next/headers";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { NotesApiResponse } from "./clientApi";
import { Note } from "@/types/note";
import { AxiosResponse } from "axios";

export const getMe = async (): Promise<User> => {
  const cookiStore = await cookies();

  const response = await nextServer.get<User>("/users/me", {
    headers: {
      Cookie: cookiStore.toString(),
    },
  });
  return response.data;
};

export const checkSession = async (): Promise<
  AxiosResponse<{ user: User }>
> => {
  const cookieStore = await cookies();

  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const fetchNotes = async (
  search: string,
  page: number,
  tag?: string
): Promise<NotesApiResponse> => {
  const cookieStore = await cookies();

  const response = await nextServer.get<NotesApiResponse>("/notes", {
    params: {
      search,
      page,
      tag,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();

  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};
