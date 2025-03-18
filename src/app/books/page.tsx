import { getAllBooks } from "@/actions/book.action";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

type BookType = Awaited<ReturnType<typeof getAllBooks>>;

async function page() {
  const books = await getAllBooks();
  return (
    <div>
      <div className="font-bold">Бүх номууд</div>
      {books.data.map((book: BookType) => (
        <Card key={book.id} className="mt-4">
            <CardHeader>{book.title}
            </CardHeader>
          <CardContent>
          <Link
              href={`/books/${book.id}`}
              className="flex flex-col"
            >
            <div className="text-muted-foreground">Дэлгэрэнгүй</div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default page;
