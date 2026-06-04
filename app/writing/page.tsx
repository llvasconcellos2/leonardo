import type { Metadata } from "next";
import { WritingIndex } from "../components/BlogPost";
import { MiniFooter } from "../components/ContactFooter";

export const metadata: Metadata = {
  title: "Writing — Leonardo Vasconcellos",
  description:
    "Engineering essays on mission-critical systems, legacy untangling, and two decades of shipping software.",
};

export default function WritingPage() {
  return (
    <>
      <WritingIndex />
      <MiniFooter />
    </>
  );
}
