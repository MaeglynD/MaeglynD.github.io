import s from "./philosophy.module.css";

export default function Philosophy() {
  return (
    <div className={s.philosophyContainer}>
      <video className={s.philosophyVideo} controls src="/philosophy/philosophy.mp4"></video>
    </div>
  );
}
