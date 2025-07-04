import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-wrap justify-center gap-6 p-8 text-sm bg-[#f5f5f5] text-[#444] border-t border-[#ddd]">
      <Link href="#" className="no-underline text-[#444] hover:text-[#444]">
        Sobre nosotros
      </Link>
      <Link href="#" className="no-underline text-[#444] hover:text-[#444]">
        Ayuda
      </Link>
      <Link href="#" className="no-underline text-[#444] hover:text-[#444]">
        Negocios
      </Link>
      <Link href="#" className="no-underline text-[#444] hover:text-[#444]">
        Términos
      </Link>
      <Link href="#" className="no-underline text-[#444] hover:text-[#444]">
        Privacidad
      </Link>
      <Link href="#" className="no-underline text-[#444] hover:text-[#444]">
        Contacto
      </Link>
      <Link href="#" className="no-underline text-[#444] hover:text-[#444]">
        Política de Cookies
      </Link>
      <Link href="#" className="no-underline text-[#444] hover:text-[#444]">
        Trabaja con nosotros
      </Link>
      <span className="w-full text-center mt-4 text-[#aaa]">
        © {new Date().getFullYear()} Diariun. Todos los derechos reservados.
      </span>
    </footer>
  );
}