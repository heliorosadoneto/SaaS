import "./globals.css";
export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className=" bg-gray-900 h-screen " >
				<main >
				{children}
				</main>
			</body>
		</html>
	);
}
