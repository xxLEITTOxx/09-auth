import css from "./SearchBox.module.css";

interface SearchBoxProps {
  setQuery: (query: string) => void;
}

export default function SearchBox({ setQuery }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="search"
      placeholder="Search notes..."
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
