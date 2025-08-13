import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  /** Si lo pasas, navega a esa ruta. Si no, hace router.back() */
  backHref?: string;
  /** Texto del botón */
  label?: string;
  /** Clases extra (margen, etc.) */
  className?: string;
};

export default function BackButton({ backHref, label = "Atrás", className = "" }: Props) {
  const router = useRouter();

  const classes =
    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 " +
    "hover:bg-gray-100 transition";

  if (backHref) {
    return (
      <Link href={backHref} className={`${classes} ${className}`}>
        <ArrowLeft size={16} />
        {label}
      </Link>
    );
  }

  return (
    <button onClick={() => router.back()} className={`${classes} ${className}`} type="button">
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}
