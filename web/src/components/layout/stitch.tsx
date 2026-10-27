export function Rails() {
  return (
    <>
      <span
        aria-hidden
        className="dotted-y pointer-events-none absolute inset-y-0 left-0 m-0! hidden md:block"
      />
      <span
        aria-hidden
        className="dotted-y pointer-events-none absolute inset-y-0 right-0 m-0! hidden md:block"
      />
    </>
  );
}

function Stitch({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className={
        side === "left"
          ? "absolute top-0 -left-(--gutter) hidden size-0.5 -translate-x-1/2 -translate-y-1/2 bg-foreground/25 md:block"
          : "absolute top-0 -right-(--gutter) hidden size-0.5 translate-x-1/2 -translate-y-1/2 bg-foreground/25 md:block"
      }
    />
  );
}

export function SectionRule() {
  return (
    <div aria-hidden className="pointer-events-none relative h-px">
      <span className="dotted-x absolute top-0 right-[-100vw] left-[-100vw]" />
      <Stitch side="left" />
      <Stitch side="right" />
    </div>
  );
}
