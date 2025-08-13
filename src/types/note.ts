// Загальні інтерфейси, які пов’язані з сутністю нотатків
// (Note, NoteTag) мають бути у файлі — src/types/note.ts.

export type Tag = "Work" | "Todo" | "Shopping" | "Meeting" | "Personal";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: Tag;
}

export interface getNotesParams {
  search: string;
  tag: Tag;
  page: number;
  perPage: number;
  sortBy: "created" | "updated";
}
