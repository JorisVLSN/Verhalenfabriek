import Link from "next/link";
import { ArrowLeft, BookHeart } from "lucide-react";
import { FriendsBook } from "@/components/friends-book";

export default function FriendsBookPage() {
  return (
    <main className="friends-book-shell">
      <header className="friends-book-header">
        <Link href="/" className="friends-book-back">
          <ArrowLeft size={20} />
          Terug
        </Link>
        <div>
          <p>De bewoners van de Verhalenfabriek</p>
          <h1>
            <BookHeart aria-hidden="true" />
            Ons vriendenboek
          </h1>
        </div>
      </header>

      <FriendsBook />
    </main>
  );
}
