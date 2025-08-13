// Libraries
import axios from "axios";

// Types
import type { Note, Tag } from "../types/note";
const API_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

interface FetchNotesProprs {
  search?: string;
  tag?: Tag;
  page?: number;
  perPage?: number;
  sortBy?: "created" | "updated";
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${API_TOKEN}`;

export async function fetchNotes(params: FetchNotesProprs = {}): Promise<FetchNotesResponse> {
  const { search, tag, page, perPage = 10, sortBy } = params;
  const response = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      search,
      tag,
      page,
      perPage,
      sortBy,
    },
  });
  return response.data;
}

export async function fetсhNoteById(id: Note["id"]): Promise<Note> {
  const response = await axios.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function deleteNote(id: Note["id"]): Promise<Note> {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
}

interface NewNote {
  title: string;
  content: string;
  tag: Tag;
}

export async function createNote(newNote: NewNote): Promise<Note> {
  const response = await axios.post<Note>(`/notes`, newNote);
  return response.data;
}
