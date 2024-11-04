"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/routes/routes";
const ClienteLayout = ({ children }) => {
	const pathname = usePathname();

	return (
		<div>
			<nav className="flex gap-4 p-4">
				<Link 
					href={ROUTES.CLIENTE} 
					className={`hover:text-blue-400 ${pathname === ROUTES.CLIENTE ? 'text-blue-500 font-bold' : ''}`}
				>
					Cadastro de cliente <span>/</span>
				</Link>
				
				<Link 
					href={ROUTES.LISTA_CLIENTES} 
					className={`hover:text-blue-400 ${pathname === ROUTES.LISTA_CLIENTES ? 'text-blue-500 font-bold' : ''}`}
				>
					Lista de clientes <span>/</span>
				</Link>
				
				
			</nav>
			<main className="text-white font-mono text-base">{children}</main>
		</div>
	);
};

export default ClienteLayout;
