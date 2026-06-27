import type { Metadata } from "next";
import { Nav } from "@/app/components/Nav";
import type { Lang } from "@/data/data";

const SITE_NAME = "Leonardo Vasconcellos";
const SITE_TITLE = "Leonardo Vasconcellos — Full-Stack Engineer";
const SITE_DESCRIPTION =
  "Senior full-stack engineer with ~20 years and ~70 shipped projects. From Doctors Without Borders to smart cities — mission-critical systems built to last.";

/** Default social-sharing image, used for every page except blog articles. */
export const DEFAULT_OG_IMAGE = "/assets/screenshot-md.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://leonardo-vasconcellos.vercel.app"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 763,
        height: 473,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pt" }];
}

export const dynamicParams = false;

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <div className="lv-app">
      <Nav lang={lang as Lang} />
      <main>{children}</main>
    </div>
  );
}
