"use client";

import { useId } from "react";

export function FooterSculpture() {
  const id=useId().replace(/:/g,"");
  const curve="M230 660 C90 450 220 200 470 245 C740 295 650 540 900 565 C1110 585 1160 345 960 230 C780 125 680 435 475 535 C320 610 300 770 230 660Z";
  return <div className="footer-sculpture ribbon-sculpture" aria-hidden="true"><svg className="footer-ribbon" viewBox="0 0 1200 800"><defs><linearGradient id={`${id}-metal`} x1=".2" y1="0" x2=".8" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#a89f8a"/><stop offset=".28" stopColor="#28292c"/><stop offset=".5" stopColor="#625e67"/><stop offset=".72" stopColor="#191a1b"/><stop offset="1" stopColor="#afa48e"/></linearGradient></defs><path d={curve} fill="none" stroke={`url(#${id}-metal)`} strokeWidth="83"/><path d={curve} fill="none" stroke="#d2c7b1" strokeWidth="1" opacity=".3" transform="translate(0 -34)"/><path d={curve} fill="none" stroke="#96879f" strokeWidth="1" opacity=".2" transform="translate(0 35)"/></svg></div>;
}
