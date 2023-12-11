export default function AboutPage() {
  return (
    <>
      <main
        className="flex flex-col items-center justify-between"
        style={{
          minHeight: "calc(100vh - 180px)",
        }}
      >
        <div className="max-w-2xl mx-auto flex-[1_0_auto]">
          <h1 className="text-3xl font-bold my-3">About FalseNotes</h1>
          <p className="mt-4 text-muted-foreground">
            This page is a work in progress. Please check back later.
          </p>
        </div>
      </main>
    </>
  );
}
