import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.png";
import logoDark from "../../public/logo-dark.png";
import mark from "../../public/logo-mark.png";
import markDark from "../../public/logo-mark-dark.png";

/** The "S" mark only. Height is set via className (e.g. "h-10"); width follows. */
export function LogoMark({ className = "h-8" }: { className?: string }) {
  return (
    <>
      <Image src={mark} alt="" className={`w-auto dark:hidden ${className}`} />
      <Image src={markDark} alt="" className={`hidden w-auto dark:block ${className}`} />
    </>
  );
}

/** Full "Stellar" wordmark linking home. */
export function Logo({ className = "h-7", eager = false }: { className?: string; eager?: boolean }) {
  const loading = eager ? "eager" : "lazy";
  return (
    <Link href="/" aria-label="Stellar home" className="inline-flex shrink-0 items-center">
      <Image src={logo} alt="Stellar" loading={loading} className={`w-auto dark:hidden ${className}`} />
      <Image src={logoDark} alt="Stellar" loading={loading} className={`hidden w-auto dark:block ${className}`} />
    </Link>
  );
}
