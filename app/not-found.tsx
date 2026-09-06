import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-page px-step-4 py-step-6 md:px-step-5">
      <p className="mb-step-3 font-mono text-xs tracking-[0.12em] text-accent uppercase">
        404
      </p>
      <h1 className="mb-step-3 max-w-measure text-xl text-ink">
        There&rsquo;s nothing at this address.
      </h1>
      <p className="mb-step-4 max-w-measure text-sm text-ink/85">
        The link is either old or mistyped.
      </p>
      <p className="flex gap-step-3 font-mono text-xs">
        <Link href="/" className="text-accent">
          Home
        </Link>
        <Link href="/work" className="text-accent">
          Work
        </Link>
      </p>
    </div>
  );
}
