import PostsFeed from "./PostsFeed";
import { MessageCircle } from "lucide-react";
import PageIntro from "@/components/PageIntro";

export default function PostsPage() {
  return <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6"><PageIntro eyebrow="Share what matters" title="Community Posts" description="Photos, updates, and moments from the DAAN community." icon={MessageCircle} tone="coral" /><PostsFeed /></div>;
}
