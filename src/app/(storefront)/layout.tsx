/**
 * Storefront Layout — wraps all (storefront) routes with Navbar + Footer + WhatsApp FAB.
 *
 * Fully static: no database, no customer session, no settings fetch. The
 * WhatsApp number is a hardcoded constant (src/data/site-config.ts) — there
 * is no admin panel to toggle or edit it.
 */

import { NavbarShell } from "@/components/storefront/navbar-shell";
import { Footer } from "@/components/storefront/footer";
import { WhatsAppFab } from "@/components/storefront/whatsapp-fab";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarShell />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
