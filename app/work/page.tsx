import type { Metadata } from "next";
import { ArchiveView } from "../components/Views";
import { MiniFooter } from "../components/ContactFooter";

export const metadata: Metadata = {
  title: "Work — Leonardo Vasconcellos",
  description:
    "~70 shipped projects across ~20 years and five eras of the web — mission-critical systems from medical records to smart cities.",
};

export default function WorkPage() {
  return (
    <>
      <ArchiveView />
      <MiniFooter />
    </>
  );
}
