"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/authProvider";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("Something went wrong");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import FormAndMethod from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const RECIPES_URL = "/api/recipes";
const IS_AUTHED = "/api/is-authed";
export default function Home() {
  const router = useRouter();

  // Get Request
  const { data, error, isLoading } = useSWR(RECIPES_URL, fetcher);
  const {
    data: authedData,
    error: authedError,
    isLoading: authedIsLoading,
  } = useSWR(IS_AUTHED, fetcher);
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    console.log(error);
  }, [auth, error, authedData]);

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center  min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2  sm:items-start">
        <ScrollArea>
          <Table className={"gap-6"}>
            <TableHeader>
              <TableRow className={"bg-accent p-2"}>
                <TableHead className={"w-56"}>Name</TableHead>
                <TableHead className={"w-32"}>Duration</TableHead>
                <TableHead className={"w-32"}>Author</TableHead>
                <TableHead className={"w-32"}>Public</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((recipe, id) => (
                <TableRow className={'cursor-pointer'}
                  onClick={(e) => router.push(`recipes/${recipe.id}`)}
                  key={`recipe-${id}`}
                >
                  <TableCell>
                    <HoverCard>
                      <HoverCardTrigger>{recipe.name}</HoverCardTrigger>
                      <HoverCardContent>{recipe.description}</HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell>{recipe.duration}</TableCell>
                  <TableCell>{recipe.userStr}</TableCell>
                  <TableCell>{recipe.public ? <Check /> : <X />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <Link
          href={"/recipes/upload/"}
          className={"border p-4 rounded-xl bg-background "}
        >
          Add new
        </Link>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            className={
              "bg-accent p-4 rounded-xl border-accent-foreground border "
            }
          >
            Import Recipe
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import recipe</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <FormAndMethod
                method={"POST"}
                url={"api/recipes/url/"}
                setOpen={setOpen}
                className={"flex flex-col gap-4"}
              >
                <Input id="url" type="text" name={"url"}></Input>
                <Button type="submit">Save</Button>
              </FormAndMethod>
            </DialogBody>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
