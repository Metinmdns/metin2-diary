import dynamic from "next/dynamic";

const Metin2Diary = dynamic(() => import("../components/Metin2Diary"), { ssr: false });

export default function Home() {
  return <Metin2Diary />;
}