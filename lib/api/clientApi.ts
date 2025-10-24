import { Note, NoteTag } from "@/types/note";
import { User } from "@/types/user";
import { nextServer } from "./api";

export interface NotesApiResponse {
  notes: Note[];
  totalPages: number;
}

export interface NewNote {
  title: string;
  content?: string;
  tag: NoteTag;
}

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export interface UpdateMeRequest {
  email: string;
  username: string;
}

type CheckSessionRequest = {
  success: boolean;
};

export const register = async (body: RegisterRequest): Promise<User> => {
  const response = await nextServer.post<User>("/auth/register", body);
  return response.data;
};

export const login = async (body: LoginRequest): Promise<User> => {
  const response = await nextServer.post<User>("/auth/login", body);
  return response.data;
};

export const checkSession = async () => {
  const response = await nextServer.get<CheckSessionRequest>("/auth/session");
  return response.data.success;
};

export const getMe = async (): Promise<User> => {
  const response = await nextServer.get<User>("/users/me");
  return response.data;
};

export const updateMe = async (body: UpdateMeRequest): Promise<User> => {
  const response = await nextServer.patch<User>("/users/me", body);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const fetchNotes = async (
  search: string,
  page: number,
  tag?: string
): Promise<NotesApiResponse> => {
  const response = await nextServer.get<NotesApiResponse>("/notes", {
    params: {
      search,
      page,
      tag,
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (note: NewNote): Promise<Note> => {
  const response = await nextServer.post<Note>("/notes", note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
};
