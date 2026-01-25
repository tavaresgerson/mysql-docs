### 1.2.1 O que é MySQL?

MySQL, o sistema de gerenciamento de Database SQL Open Source mais popular, é desenvolvido, distribuído e suportado pela Oracle Corporation.

O website do MySQL (<http://www.mysql.com/>) fornece as informações mais recentes sobre o software MySQL.

* **MySQL é um sistema de gerenciamento de Database.**

  Um Database é uma coleção estruturada de dados. Pode ser desde uma simples lista de compras até uma galeria de imagens ou a vasta quantidade de informações em uma rede corporativa. Para adicionar, acessar e processar dados armazenados em um Database de computador, você precisa de um sistema de gerenciamento de Database, como o MySQL Server. Como os computadores são muito eficientes no manuseio de grandes quantidades de dados, os sistemas de gerenciamento de Database desempenham um papel central na computação, seja como utilitários standalone (autônomos) ou como parte de outras aplicações.

* **Databases MySQL são relacionais.**

  Um Database relacional armazena dados em tables separadas, em vez de colocar todos os dados em um único grande depósito. As estruturas do Database são organizadas em arquivos físicos otimizados para velocidade. O modelo lógico, com objetos como Databases, tables, views, rows e columns, oferece um ambiente de programação flexível. Você define regras que governam os relacionamentos entre diferentes campos de dados, como um-para-um, um-para-muitos, unique, required ou optional, e “pointers” (ponteiros) entre diferentes tables. O Database impõe essas regras, de modo que, com um Database bem projetado, sua aplicação nunca verá dados inconsistentes, duplicados, órfãos, desatualizados ou ausentes.

  A parte SQL de “MySQL” significa “Structured Query Language”. SQL é a linguagem padronizada mais comum usada para acessar Databases. Dependendo do seu ambiente de programação, você pode inserir SQL diretamente (por exemplo, para gerar relatórios), incorporar comandos SQL em código escrito em outra linguagem ou usar uma API específica da linguagem que oculte a sintaxe SQL.

  SQL é definido pelo Padrão SQL ANSI/ISO. O Padrão SQL tem evoluído desde 1986 e várias versões existem. Neste manual, “SQL-92” refere-se ao padrão lançado em 1992, “SQL:1999” refere-se ao padrão lançado em 1999, e “SQL:2003” refere-se à versão atual do padrão. Usamos a frase “o padrão SQL” para significar a versão atual do Padrão SQL em qualquer momento.

* **O software MySQL é Open Source.**

  Open Source significa que é possível que qualquer pessoa utilize e modifique o software. Qualquer um pode baixar o software MySQL da Internet e usá-lo sem pagar nada. Se desejar, você pode estudar o código-fonte e alterá-lo para atender às suas necessidades. O software MySQL utiliza a GPL (GNU General Public License), <http://www.fsf.org/licenses/>, para definir o que você pode ou não fazer com o software em diferentes situações. Se você se sentir desconfortável com a GPL ou precisar incorporar o código MySQL em uma aplicação comercial, você pode comprar uma versão licenciada comercialmente de nós. Consulte o Overview de Licenciamento MySQL para mais informações (<http://www.mysql.com/company/legal/licensing/>).

* **O MySQL Database Server é muito rápido, confiável, escalável e fácil de usar.**

  Se é isso que você está procurando, você deve experimentá-lo. O MySQL Server pode rodar confortavelmente em um desktop ou laptop, junto com suas outras aplicações, web servers, e assim por diante, exigindo pouca ou nenhuma atenção. Se você dedicar uma máquina inteira ao MySQL, pode ajustar as configurações para aproveitar toda a memória, poder de CPU e capacidade de I/O disponíveis. O MySQL também pode escalar para Clusters de máquinas, interligadas em rede.

  O MySQL Server foi originalmente desenvolvido para lidar com grandes Databases muito mais rapidamente do que as soluções existentes e tem sido usado com sucesso em ambientes de produção altamente exigentes por vários anos. Embora esteja em constante desenvolvimento, o MySQL Server hoje oferece um conjunto de funções rico e útil. Sua conectividade, velocidade e segurança tornam o MySQL Server altamente adequado para acessar Databases na Internet.

* **O MySQL Server funciona em sistemas client/server ou embarcados (embedded).**

  O MySQL Database Software é um sistema client/server que consiste em um server SQL multithreaded que suporta diferentes back ends, vários programas client e libraries diferentes, ferramentas administrativas e uma ampla gama de application programming interfaces (APIs).

  Também fornecemos o MySQL Server como uma library multithreaded embarcada (embedded) que você pode linkar à sua aplicação para obter um produto standalone (autônomo) menor, mais rápido e mais fácil de gerenciar.

* **Uma grande quantidade de software MySQL contribuído está disponível.**

  O MySQL Server possui um conjunto prático de funcionalidades desenvolvidas em estreita cooperação com nossos usuários. É muito provável que sua aplicação ou linguagem favorita suporte o MySQL Database Server.

* **MySQL HeatWave.**

  MySQL HeatWave é um serviço de Database totalmente gerenciado (fully managed), alimentado pelo acelerador de Query in-memory MySQL HeatWave. É o único serviço de Cloud que combina transações, analytics em tempo real em data warehouses e data lakes, e machine learning em um único MySQL Database; sem a complexidade, latência, riscos e custo da duplicação de ETL. Está disponível no OCI, AWS e Azure. Saiba mais em: <https://www.oracle.com/mysql/>.

A maneira oficial de pronunciar “MySQL” é “Mai Ess Qui Éll” (não “mai sequel”), mas não nos importamos se você o pronunciar como “mai sequel” ou de alguma outra forma localizada.