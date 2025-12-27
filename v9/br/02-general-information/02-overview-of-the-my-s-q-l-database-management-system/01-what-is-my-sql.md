### 1.2.1 O que é o MySQL?

O MySQL, o sistema mais popular de gerenciamento de banco de dados de código aberto, é desenvolvido, distribuído e suportado pela Oracle Corporation.

O site do MySQL (<http://www.mysql.com/>) fornece as informações mais recentes sobre o software MySQL.

* **O MySQL é um sistema de gerenciamento de banco de dados.**

  Um banco de dados é uma coleção estruturada de dados. Pode ser qualquer coisa, desde uma simples lista de compras até uma galeria de fotos ou as vastas quantidades de informações em uma rede corporativa. Para adicionar, acessar e processar dados armazenados em um banco de dados de computador, você precisa de um sistema de gerenciamento de banco de dados, como o MySQL Server. Como os computadores são muito bons em lidar com grandes quantidades de dados, os sistemas de gerenciamento de banco de dados desempenham um papel central na computação, como utilitários independentes ou como partes de outras aplicações.

* **Os bancos de dados MySQL são relacionais.**

  Um banco de dados relacional armazena dados em tabelas separadas, em vez de colocar todos os dados em um grande armário. As estruturas do banco de dados são organizadas em arquivos físicos otimizados para velocidade. O modelo lógico, com objetos como bancos de dados, tabelas, visualizações, linhas e colunas, oferece um ambiente de programação flexível. Você define regras que regem as relações entre diferentes campos de dados, como um para um, um para muitos, único, obrigatório ou opcional, e "pontuadores" entre diferentes tabelas. O banco de dados aplica essas regras, para que, com um banco de dados bem projetado, sua aplicação nunca veja dados inconsistentes, duplicados, órfãos, desatualizados ou ausentes.

A parte SQL de "MySQL" significa "Linguagem de Consulta Estruturada". O SQL é a linguagem padronizada mais comum usada para acessar bancos de dados. Dependendo do seu ambiente de programação, você pode inserir SQL diretamente (por exemplo, para gerar relatórios), incorporar instruções SQL em código escrito em outra linguagem ou usar uma API específica da linguagem que oculta a sintaxe SQL.

O SQL é definido pelo Padrão ANSI/ISO SQL. O padrão SQL tem evoluído desde 1986 e existem várias versões. Neste manual, "SQL-92" refere-se ao padrão lançado em 1992, "SQL:1999" refere-se ao padrão lançado em 1999 e "SQL:2003" refere-se à versão atual do padrão. Usamos a frase "o padrão SQL" para significar a versão atual do Padrão SQL em qualquer momento.

* **O software MySQL é de código aberto.**

  Código aberto significa que qualquer pessoa pode usar e modificar o software. Qualquer pessoa pode baixar o software MySQL da Internet e usá-lo sem pagar nada. Se desejar, você pode estudar o código-fonte e modificá-lo para atender às suas necessidades. O software MySQL usa a GPL (GNU General Public License), <http://www.fsf.org/licenses/>, para definir o que você pode e não pode fazer com o software em diferentes situações. Se você se sentir desconfortável com a GPL ou precisar incorporar o código MySQL em uma aplicação comercial, você pode comprar uma versão com licença comercial conosco. Veja a Visão Geral de Licenciamento do MySQL para mais informações (<http://www.mysql.com/company/legal/licensing/>).

* **O Servidor de Banco de Dados MySQL é muito rápido, confiável, escalável e fácil de usar.**

Se é isso que você está procurando, você deve experimentar. O MySQL Server pode ser executado confortavelmente em um desktop ou laptop, ao lado de suas outras aplicações, servidores web, e assim por diante, exigindo pouca ou nenhuma atenção. Se você dedicar uma máquina inteira ao MySQL, pode ajustar as configurações para aproveitar toda a memória, potência da CPU e capacidade de E/S disponíveis. O MySQL também pode escalar para clusters de máquinas, interligadas.

O MySQL Server foi originalmente desenvolvido para lidar com grandes bancos de dados muito mais rápido do que as soluções existentes e tem sido usado com sucesso em ambientes de produção altamente exigentes por vários anos. Embora esteja em constante desenvolvimento, o MySQL Server hoje oferece um conjunto rico e útil de funções. Sua conectividade, velocidade e segurança tornam o MySQL Server altamente adequado para acessar bancos de dados na Internet.

* **O MySQL Server funciona em sistemas cliente/servidor ou embutidos.**

  O Software de Banco de Dados MySQL é um sistema cliente/servidor que consiste em um servidor SQL multithread que suporta diferentes backends, vários programas e bibliotecas de clientes diferentes, ferramentas administrativas e uma ampla gama de interfaces de programação de aplicativos (APIs).

  Também fornecemos o MySQL Server como uma biblioteca multithread embutida que você pode vincular à sua aplicação para obter um produto autônomo menor, mais rápido e mais fácil de gerenciar.

* **Uma grande quantidade de software MySQL contribuído está disponível.**

  O MySQL Server tem um conjunto prático de recursos desenvolvidos em estreita cooperação com nossos usuários. É muito provável que seu aplicativo ou linguagem favorito suporte o MySQL Database Server.

* **MySQL HeatWave.**

O MySQL HeatWave é um serviço de banco de dados totalmente gerenciado, impulsionado pelo acelerador de consultas em memória MySQL HeatWave. É o único serviço na nuvem que combina transações, análises em tempo real em armazéns de dados e lagos de dados, e aprendizado de máquina em um único banco de dados MySQL; sem a complexidade, latência, riscos e custo da duplicação de ETL. Está disponível no OCI, AWS e Azure. Saiba mais em: <https://www.oracle.com/mysql/>.

A maneira oficial de pronunciar “MySQL” é “My Ess Que Ell” (não “minha sequência”), mas não nos importamos se você pronunciá-lo como “minha sequência” ou de alguma outra maneira localizada.