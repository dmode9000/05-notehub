// Libraries
import axios from "axios";

// Types
import type { Note, Tag } from "../types/note";
const API_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

// Інтерфейси, які описують відповіді http-запитів (FetchNotesResponse і т.д.)
// та параметри функцій, які виконують http-запити у — src/services/noteService.ts.

//
// create:  POST    /notes        https://notehub-public.goit.study/api/notes
// read:    GET     /notes        https://notehub-public.goit.study/api/notes?search=example&tag=Todo&page=1&perPage=10&sortBy=created
// read:    GET     /notes/{id}   https://notehub-public.goit.study/api/notes/65ca67e7ae7f10c88b598384
// update:  PATCH   /notes/{id}   https://notehub-public.goit.study/api/notes/65ca67e7ae7f10c88b598384
// remove:  DELETE  /notes/{id}   https://notehub-public.goit.study/api/notes/65ca67e7ae7f10c88b598384

interface FetchNotesProprs {
  search?: string;
  tag?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${API_TOKEN}`;

// читаю список нотаток
export async function fetchNotes(params: FetchNotesProprs = {}): Promise<FetchNotesResponse> {
  const { search, tag, page, perPage = 10, sortBy } = params;
  const response = await axios.get<FetchNotesResponse>("/notes", {
    //headers: { Authorization: `Bearer ${API_TOKEN}` },
    // baseURL: "https://notehub-public.goit.study/api/",
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

// читаю нотатку по її id
export async function fetсhNoteById(id: Note["id"]): Promise<Note> {
  const response = await axios.get<Note>(`/notes/${id}`);
  return response.data;
}

// видаляю нотатку по її id
export async function deleteNote(id: Note["id"]): Promise<Note> {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
}

interface NewNote {
  title: string;
  content: string;
  tag: Tag;
}
// створюю нову нотатку
export async function createNote(newNote: NewNote): Promise<Note> {
  const response = await axios.post<Note>(`/notes`, newNote);
  return response.data;
}
