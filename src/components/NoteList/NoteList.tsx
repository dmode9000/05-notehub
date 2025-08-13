// Libraries
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Services
import { deleteNote } from "../../services/noteService";

// Types
import type { Note, Tag } from "../../types/note";

// Styles
import css from "./NoteList.module.css";

interface NoteListProps {
  data: Note[];
  onTagClick: (tag: Tag) => void;
}

export default function NoteList({ data, onTagClick }: NoteListProps) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onSuccess(note) {
      // TODO додати тост повідомлення про видалену нотатку
      toast.success("Note deteted: " + note);
      console.log(`Note deteted:`, note);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError(error) {
      console.log("Eror deleting: ", error);
    },
  });

  return (
    <ul className={css.list}>
      {
        /* Набір елементів списку нотатків */
        data.map((note) => (
          <li className={css.listItem} key={note.id}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag} onClick={() => onTagClick(note.tag)}>
                {note.tag}
              </span>
              <button className={css.button} onClick={() => mutate(note.id)}>
                Delete
              </button>
            </div>
          </li>
        ))
      }
    </ul>
  );
}
