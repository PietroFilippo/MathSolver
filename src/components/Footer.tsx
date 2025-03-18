const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary-800 dark:bg-gray-900 text-white py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-xl font-bold">MathSolver</h2>
                        <p className="text-gray-200 dark:text-gray-400">Facilitando o aprendizado da matemática, um problema por vez</p>
                </div>

                <div className="text-center md:text-right">
                    <p>&copy; {currentYear} MathSolver. Todos direitos Reservados</p>
                    <p className="text-gray-200 dark:text-gray-400 text-sm mt-1">
                        Criado para auxiliar o aprendizado
                    </p>
                </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;