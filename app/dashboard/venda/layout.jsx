"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/routes/routes";
const VendaLayout = ({ children }) => {
	const pathname = usePathname();

	return (
		<div>
			<nav className="flex gap-4 p-4">
				<Link 
					href={ROUTES.VENDA} 
					className={`hover:text-blue-400 ${pathname === ROUTES.VENDA ? 'text-blue-500 font-bold' : ''}`}
				>
					Vendas <span>/</span>
				</Link>
				
				<Link 
					href={ROUTES.PREVENDA} 
					className={`hover:text-blue-400 ${pathname === ROUTES.PREVENDA ? 'text-blue-500 font-bold' : ''}`}
				>
					Pré-Venda <span>/</span>
				</Link>
				<Link 
					href={ROUTES.LISTA_PREVENDA} 
					className={`hover:text-blue-400 ${pathname === ROUTES.LISTA_PREVENDA ? 'text-blue-500 font-bold' : ''}`}
				>
					Lista de Pré-Venda <span>/</span>
				</Link>
				<Link 
					href={ROUTES.CLIENTE} 
					className={`hover:text-blue-400 ${pathname === ROUTES.CLIENTE ? 'text-blue-500 font-bold' : ''}`}
				>
					Cadastrar Cliente <span>/</span>
				</Link>
				
				
			</nav>
			<main className="text-white font-mono text-base">{children}</main>
		</div>
	);
};

export default VendaLayout;
