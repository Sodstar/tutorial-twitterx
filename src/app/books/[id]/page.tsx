import { getAllBooks, getBookById } from "@/actions/book.action";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

type BookType = Awaited<ReturnType<typeof getAllBooks>>;
type BookOne = BookType[number];

interface PageProps {
  params: { id: String };
}
async function page({ params }: PageProps) {
  const book = await getBookById(Number(params.id));
  if (!book) notFound();
  console.log(book);
  return (
    <div>
      <div className="font-bold">{book.data?.title}</div>
      <Card className="mt-4">
        <CardHeader>{book.data?.title}</CardHeader>
        <CardContent>
          <Link href="/books" className="flex flex-col">
            <div className="text-muted-foreground">Буцах</div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default page;
