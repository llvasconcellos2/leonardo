"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRestoration() {
  const pathname = usePathname();

  console.log({ pathname });

  useEffect(() => {
    // 1. Fetch saved scroll coordinate for the current path
    // console.log(`scroll_${pathname}`);
    const savedPosition = sessionStorage.getItem(`scroll_${pathname}`);
    // console.log({ savedPosition });

    if (savedPosition) {
      // Small timeout ensures SSR HTML has completely hydrated in the DOM
      // const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: Number(savedPosition),
        behavior: "auto", // Avoids conflicting with CSS smooth scrolling
      });
      // }, 100); // 100ms is the sweet spot for SSR rehydration

      // return () => clearTimeout(timeoutId);
    }
  }, [pathname]);

  useEffect(() => {
    // console.log("useEffect");
    // 2. Track user scroll and save it locally
    const handleScroll = () => {
      // console.log("aqui");
      sessionStorage.setItem(`scroll_${pathname}`, window.scrollY.toString());
    };

    window.addEventListener("pagehide", handleScroll);
    return () => window.removeEventListener("pagehide", handleScroll);
  }, [pathname]);

  return null;
}

// "use client";

// import { useEffect } from "react";
// import { usePathname } from "next/navigation";

// export default function ScrollRestoration() {
//   const pathname = usePathname();

//   useEffect(() => {
//     // 1. Restore the position when the route is fully mounted
//     const savedPosition = sessionStorage.getItem(`scroll_${pathname}`);
//     if (savedPosition) {
//       // Small timeout ensures DOM elements have rendered fully
//       setTimeout(() => {
//         window.scrollTo({
//           top: Number(savedPosition),
//           behavior: "auto", // Avoid conflict with global smooth scrolling
//         });
//       }, 50);
//     }

//     // 2. Continually save the window's scroll state as the user travels
//     const handleScroll = () => {
//       sessionStorage.setItem(`scroll_${pathname}`, window.scrollY.toString());
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [pathname]);

//   return null;
// }
