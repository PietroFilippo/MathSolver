import { HiBookOpen, HiUserGroup, HiOutlineAdjustments, HiOutlineLightBulb } from 'react-icons/hi';

const SobrePage: React.FC = () => {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Sobre o MathSolver</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <HiOutlineAdjustments className="h-6 w-6 mr-2 text-indigo-600" />
            Objetivo Principal
          </h2>
          <p className="text-gray-700 mb-4">
            O MathSolver foi criado com uma missão simples: tornar a matemática acessível, 
            compreensível e menos intimidadora para pessoas de todas as idades. Acreditamos que todo aluno 
            merece as ferramentas e recursos necessários para ter sucesso na matemática, independentemente de 
            seu histórico ou nível atual de habilidade.
          </p>
          <p className="text-gray-700">
            O principal objetivo não é apenas fornecer respostas, mas fomentar a verdadeira compreensão dos conceitos 
            matemáticos. Ao oferecer explicações passo a passo ao lado das soluções, ajudamos os alunos e a qualquer um
            a construir confiança e desenvolver habilidades de resolução de problemas que os acompanharão durante sua jornada 
            acadêmica e além.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <HiBookOpen className="h-6 w-6 mr-2 text-indigo-600" />
            Filosofia Educacional
          </h2>
          <p className="text-gray-700 mb-4">
            No MathSolver, acreditamos que entender o "porquê" por trás dos processos matemáticos é tão importante 
            quanto saber o "como". Essa abordagem enfatiza a compreensão conceitual juntamente com a fluência 
            procedimental.
          </p>
          <p className="text-gray-700 mb-4">
            As explicações são projetadas para ser claras, concisas e acessíveis a pessoas de diferentes níveis 
            de proficiência matemática. Ao dividir problemas complexos em etapas manejáveis, os ajudamos a 
            desenvolver confiança e uma mentalidade de crescimento em relação à matemática.
          </p>
          <p className="text-gray-700">
            Nossa plataforma foi desenvolvida para complementar o aprendizado, fornecendo suporte adicional 
            para qualquer um que precisa de ajuda extra ou querem aprofundar seu entendimento sobre os conceitos matemáticos.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <HiUserGroup className="h-6 w-6 mr-2 text-indigo-600" />
            Para Quem Servimos
          </h2>
          <p className="text-gray-700 mb-4">
            O MathSolver é destinado a:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li><span className="font-medium">Estudantes do ensino fundamental e médio</span> aprendendo conceitos matemáticos fundamentais</li>
            <li><span className="font-medium">Estudantes do ensino médio</span> enfrentando tópicos mais avançados como álgebra, geometria e cálculo</li>
            <li><span className="font-medium">Pais</span> ajudando seus filhos com deveres de casa</li>
            <li><span className="font-medium">Professores</span> buscando recursos adicionais para apoiar seus alunos</li>
            <li><span className="font-medium">Adultos</span> revisando seus conhecimentos matemáticos</li>
          </ul>
          <p className="text-gray-700">
            Seja você alguém com dificuldades em um problema específico ou alguém que deseja fortalecer sua base 
            matemática geral, o MathSolver está aqui para apoiar sua jornada de aprendizado.
          </p>
        </div>
  
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            <HiOutlineLightBulb className="h-6 w-6 mr-2 text-indigo-600" />
            Lembre-se
          </h2>
          <p className="text-gray-700">
            Embora o MathSolver seja uma ferramenta poderosa para auxiliar no entendimento de problemas matemáticos, 
            é importante lembrar que ele não deve ser o único recurso utilizado no seu aprendizado. Em problemas reais e em provas, 
            frequentemente é necessário um conhecimento mais profundo sobre o assunto para resolver exercícios de forma eficiente.
          </p>
          <p className="text-gray-700">
            O MathSolver é para ajudar, mas o verdadeiro sucesso na matemática vem da prática contínua e da compreensão sólida 
            dos conceitos. Não se esqueça de estudar, praticar e buscar a compreensão profunda para realmente dominar os desafios 
            matemáticos que você enfrentará.
          </p>
        </div>
      </div>
    );
  };

  export default SobrePage;