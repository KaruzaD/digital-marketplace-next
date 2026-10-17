import { Footer, FooterLinks, Link, Text } from "@bcgov/design-system-react-components";

/**
 * The footer every screen carries, signed in or not (R-7.19), as `design/catalogue/site.tsx`
 * draws it.
 *
 * Its five content links are the service's whole standing offer of its own prose, and each opens
 * the page held at that address. Each of the five is a page the service creates for itself, so
 * every one of them resolves on a fresh installation (R-7.12).
 */
export const FOOTER_PAGES = [
  { slug: "about", label: "About", testId: "footer-about-link" },
  { slug: "disclaimer", label: "Disclaimer", testId: "footer-disclaimer-link" },
  { slug: "privacy", label: "Privacy", testId: "footer-privacy-link" },
  {
    slug: "accessibility",
    label: "Accessibility",
    testId: "footer-accessibility-link",
  },
  { slug: "copyright", label: "Copyright", testId: "footer-copyright-link" },
] as const;

/** The original site's eight footer links: home, the five pages, the contact address and the source. */
export const FOOTER_LINKS: readonly { label: string; href: string; testId?: string }[] = [
  { label: "Home", href: "/" },
  ...FOOTER_PAGES.map((entry) => ({ label: entry.label, href: `/content/${entry.slug}`, testId: entry.testId })),
  { label: "Contact Us", href: "mailto:digitalmarketplace@gov.bc.ca" },
  { label: "Source Code", href: "https://github.com/bcgov/digital_marketplace/" },
];

// The design system's Footer with its land acknowledgement, its logo, the original site's line
// "Owned and operated by the B.C. Government." where the design system puts contact details, and
// the eight links in its two-column list. The list has no heading, and there is no copyright line.
export function SiteFooter() {
  return (
    <div data-testid="site-footer">
      <Footer
        hideCopyright
        contact={
          <Text elementType="p" size="small" color="secondary">
            Owned and operated by the B.C. Government.
          </Text>
        }
        links={
          <FooterLinks
            title=""
            links={FOOTER_LINKS.map((link) => (
              <Link key={link.label} href={link.href} data-testid={link.testId}>
                {link.label}
              </Link>
            ))}
          />
        }
      />
    </div>
  );
}
