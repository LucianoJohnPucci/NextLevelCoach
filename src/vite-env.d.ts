
/// <reference types="vite/client" />

// Allow importing MP3 files
declare module '*.mp3' {
  const src: string;
  export default src;
}

// Allow importing other audio formats if needed
declare module '*.wav' {
  const src: string;
  export default src;
}

declare module '*.ogg' {
  const src: string;
  export default src;
}
