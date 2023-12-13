"use client";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export default function ListsTabs() {
  const path = usePathname();
  const router = useRouter();

  return (
    <>
      <Tabs defaultValue={path} className="mb-4">
        <TabsList>
          <TabsTrigger value="/lists" onClick={() => router.push('/lists')}>Lists</TabsTrigger>
          <TabsTrigger value="/lists/saved" onClick={() => router.push('/lists/saved')} disabled>Saved Lists</TabsTrigger>
          <TabsTrigger value="/lists/history" onClick={() => router.push('/lists/history')}>Reading History</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
}
