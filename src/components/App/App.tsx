// React
import { useCallback, useEffect, useState } from "react";

// Libraries
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GridLoader } from "react-spinners";
import { useDebouncedCallback } from "use-debounce";
import toast, { Toaster } from "react-hot-toast";

// Services
import { fetchNotes } from "../../services/noteService";

// Components
import Modal from "../Modal/Modal";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";

// Styles
import css from "./App.module.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useDebouncedCallback((query: string) => {
    setSearchQuery(query);
    setSelectedPage(1);
  }, 500);

  const { data, isLoading, isSuccess, isPlaceholderData } = useQuery({
    queryKey: ["notes", selectedPage, searchQuery],
    queryFn: () => fetchNotes({ page: selectedPage, search: searchQuery }),
    placeholderData: keepPreviousData,
  });

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <header className={css.toolbar}>
        {<SearchBox onSearch={handleSearch} />}

        {isSuccess && data?.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={selectedPage}
            onPageSelect={(page) => setSelectedPage(page)}
          />
        )}
        {
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
        }
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm closeFormModal={closeModal} />
          </Modal>
        )}
      </header>
      {isLoading && <GridLoader cssOverride={{ marginInline: "auto", display: "block" }} />}

      {data?.notes && <NoteList notes={data.notes} isOldData={isPlaceholderData} />}
    </div>
  );
}

export default App;
