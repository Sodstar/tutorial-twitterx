import { getAllBooks, getBookById } from "@/actions/book.action";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import React,{use} from "react";

type BookType = Awaited<ReturnType<typeof getAllBooks>>;
type BookOne = BookType[number];

interface PageProps {
  params: Promise<{ id: string }> ;
}
async function page({ params }: { params: Promise<{ id: string }> })  {
  const {id} = use(params);
  const book = await getBookById(Number(id));
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
