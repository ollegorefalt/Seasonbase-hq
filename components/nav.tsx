import Link from "next/link";

const links = [
  { href: "/", label: "Overview" },
  { href: "/employers/new", label: "Add employer" },
  { href: "/meetings/new", label: "Log meeting" },
] as const;

export function Nav() {
  return (
    <nav className="nav">
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
