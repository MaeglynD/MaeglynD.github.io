import s from "./bookshelf.module.css";

export default function Bookshelf() {
  return (
    <div className={s.bookshelfContainer}>
      <div className={s.books}>The books will go here.</div>
    </div>
  );
}
