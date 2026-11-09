import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.png";
import logoDark from "../../public/logo-dark.png";
import mark from "../../public/logo-mark.png";
import markDark from "../../public/logo-mark-dark.png";

/** The "S" mark only. Height is set via className (e.g. "h-10"); width follows. */
export function LogoMark({ className = "h-8", variant = "auto" }: { className?: string; variant?: "auto" | "onDark" }) {
  if (variant === "onDark") return <Image src={markDark} alt="" className={`w-auto ${className}`} />;
  return (
    <>
      <Image src={mark} alt="" className={`w-auto dark:hidden ${className}`} />
      <Image src={markDark} alt="" className={`hidden w-auto dark:block ${className}`} />
    </>
  );
}

/**
 * Full "Stellar" wordmark linking home.
 * variant "auto" follows the color scheme; "onDark" always uses the light version (for charcoal surfaces).
 */
export function Logo({
  className = "h-7",
  eager = false,
  variant = "auto",
}: {
  className?: string;
  eager?: boolean;
  variant?: "auto" | "onDark";
}) {
  const loading = eager ? "eager" : "lazy";
  return (
    <Link href="/" aria-label="Stellar home" className="inline-flex shrink-0 items-center">
      {variant === "onDark" ? (
        <Image src={logoDark} alt="Stellar" loading={loading} className={`w-auto ${className}`} />
      ) : (
        <>
          <Image src={logo} alt="Stellar" loading={loading} className={`w-auto dark:hidden ${className}`} />
          <Image src={logoDark} alt="Stellar" loading={loading} className={`hidden w-auto dark:block ${className}`} />
        </>
      )}
    </Link>
  );
}
