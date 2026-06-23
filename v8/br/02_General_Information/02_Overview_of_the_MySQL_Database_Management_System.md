## 1.2 Visão geral do sistema de gerenciamento de banco de dados MySQL

### 1.2.1 O que é MySQL?

MySQL, o sistema de gerenciamento de banco de dados SQL de código aberto mais popular, é desenvolvido, distribuído e suportado pela Oracle Corporation.

O site do MySQL (<http://www.mysql.com/>) fornece as informações mais recentes sobre o software MySQL.

* **MySQL é um sistema de gerenciamento de banco de dados.**

Um banco de dados é uma coleção estruturada de dados. Pode ser qualquer coisa, desde uma simples lista de compras até uma galeria de fotos ou as vastas quantidades de informações em uma rede corporativa. Para adicionar, acessar e processar dados armazenados em um banco de dados de computador, você precisa de um sistema de gerenciamento de banco de dados, como o MySQL Server. Como os computadores são muito bons em lidar com grandes quantidades de dados, os sistemas de gerenciamento de banco de dados desempenham um papel central na computação, como utilitários independentes ou como partes de outras aplicações.

* **Os bancos de dados MySQL são relacionais.**

Um banco de dados relacional armazena dados em tabelas separadas, em vez de colocar todos os dados em um grande depósito. As estruturas do banco de dados são organizadas em arquivos físicos otimizados para velocidade. O modelo lógico, com objetos como bancos de dados, tabelas, visualizações, linhas e colunas, oferece um ambiente de programação flexível. Você define regras que governam as relações entre diferentes campos de dados, como um para um, um para muitos, único, obrigatório ou opcional, e "pontuações" entre diferentes tabelas. O banco de dados aplica essas regras, para que, com um banco de dados bem projetado, sua aplicação nunca veja dados inconsistentes, duplicados, órfãos, desatualizados ou faltantes.

A parte SQL de “MySQL” significa “Structured Query Language”. O SQL é a linguagem padronizada mais comum usada para acessar bancos de dados. Dependendo do seu ambiente de programação, você pode inserir SQL diretamente (por exemplo, para gerar relatórios), incorporar declarações SQL em código escrito em outro idioma ou usar uma API específica para a linguagem que oculta a sintaxe SQL.

O SQL é definido pelo Padrão ANSI/ISO SQL. O padrão SQL tem evoluído desde 1986 e existem várias versões. Neste manual, “SQL-92” refere-se ao padrão lançado em 1992, “SQL:1999” refere-se ao padrão lançado em 1999 e “SQL:2003” refere-se à versão atual do padrão. Usamos a frase “o padrão SQL” para significar a versão atual do Padrão SQL em qualquer momento.

* O software MySQL é de código aberto.

A Open Source significa que qualquer pessoa pode usar e modificar o software. Qualquer pessoa pode baixar o software MySQL da Internet e usá-lo sem pagar nada. Se desejar, pode estudar o código-fonte e modificá-lo para atender às suas necessidades. O software MySQL utiliza a GPL (GNU General Public License), <http://www.fsf.org/licenses/>, para definir o que você pode e não pode fazer com o software em diferentes situações. Se você se sentir desconfortável com a GPL ou precisar incorporar o código MySQL em uma aplicação comercial, pode comprar uma versão licenciada comercialmente conosco. Consulte a Visão Geral de Licenciamento do MySQL para obter mais informações (<http://www.mysql.com/company/legal/licensing/>).

* **O MySQL Database Server é muito rápido, confiável, escalável e fácil de usar.**

Se é isso o que você está procurando, você deve experimentar. O MySQL Server pode ser executado confortavelmente em um desktop ou laptop, ao lado de outras aplicações, servidores web, etc., exigindo pouca ou nenhuma atenção. Se você dedicar uma máquina inteira ao MySQL, pode ajustar as configurações para aproveitar toda a memória, poder de CPU e capacidade de E/S disponíveis. O MySQL também pode escalar para clusters de máquinas, interconectadas.

O MySQL Server foi originalmente desenvolvido para lidar com grandes bancos de dados muito mais rápido do que as soluções existentes e tem sido usado com sucesso em ambientes de produção altamente exigentes por vários anos. Embora esteja em constante desenvolvimento, o MySQL Server oferece hoje um conjunto rico e útil de funções. Sua conectividade, velocidade e segurança tornam o MySQL Server altamente adequado para acessar bancos de dados na Internet.

* O **MySQL Server funciona em sistemas cliente/servidor ou integrados.**

O Software de Banco de Dados MySQL é um sistema cliente/servidor que consiste em um servidor SQL multithread que suporta diferentes backends, vários programas e bibliotecas de cliente diferentes, ferramentas administrativas e uma ampla gama de interfaces de programação de aplicativos (APIs).

Também fornecemos o MySQL Server como uma biblioteca multithread embutida que você pode vincular à sua aplicação para obter um produto independente menor, mais rápido e mais fácil de gerenciar.

* **Há uma grande quantidade de software MySQL contribuído disponível.**

O MySQL Server possui um conjunto prático de recursos desenvolvidos em estreita colaboração com nossos usuários. É muito provável que sua aplicação ou idioma favorito suporte o MySQL Database Server.

* **MySQL HeatWave.**

MySQL HeatWave é um serviço de banco de dados totalmente gerenciado, impulsionado pelo acelerador de consultas em memória MySQL HeatWave. É o único serviço na nuvem que combina transações, análise em tempo real em armazéns de dados e lagos de dados, e aprendizado de máquina em um único banco de dados MySQL; sem a complexidade, latência, riscos e custo da duplicação de ETL. Está disponível em OCI, AWS e Azure. Saiba mais em: <https://www.oracle.com/mysql/>.

A maneira oficial de pronunciar "MySQL" é "My Ess Que Ell" (não "minha sequência"), mas não nos importamos se você a pronunciar como "minha sequência" ou de alguma outra maneira localizada.

### 1.2.2 As principais características do MySQL

Esta seção descreve algumas das características importantes do Software de Banco de Dados MySQL. Na maioria dos aspectos, o roteiro se aplica a todas as versões do MySQL. Para informações sobre as funcionalidades conforme elas são introduzidas no MySQL de forma específica para cada série, consulte a seção “Em poucas palavras” do Manual apropriado:

* MySQL 8.4: O que há de novo no MySQL 8.4 desde o MySQL 8.0
* MySQL 8.0: Seção 1.3, “O que há de novo no MySQL 8.0”
* MySQL 5.7: O que há de novo no MySQL 5.7

#### Internos e Portabilidade

* Escrito em C e C++.
* Testado com uma ampla gama de compiladores diferentes.
* Funciona em muitas plataformas diferentes. Veja <https://www.mysql.com/support/supportedplatforms/database.html>.

* Para portabilidade, configurado usando **CMake**. * Testado com Purify (um detector comercial de vazamento de memória) e também com Valgrind, uma ferramenta GPL (<https://valgrind.org/>).

* Usa um design de servidor multicamadas com módulos independentes. * Projetado para ser totalmente multithread, usando threads do kernel, para usar facilmente múltiplos CPUs, se estiverem disponíveis.

* Fornece motores de armazenamento transacional e não transacional. * Usa tabelas de disco B-tree muito rápidas (`MyISAM`) com compressão de índice.

* Projetado para tornar relativamente fácil adicionar outros motores de armazenamento. Isso é útil se você deseja fornecer uma interface SQL para um banco de dados interno.

* Usa um sistema de alocação de memória baseado em fios muito rápido. * Realiza junções muito rápidas usando uma junção otimizada de laço aninhado. * Implementa tabelas de hash em memória, que são usadas como tabelas temporárias.

* Implementa funções SQL usando uma biblioteca de classes altamente otimizada que deve ser o mais rápida possível. Geralmente, não há alocação de memória alguma após a inicialização da consulta.

* Fornece o servidor como um programa separado para uso em um ambiente de rede cliente/servidor.

#### Tipos de dados

* Muitos tipos de dados: inteiros assinados/não assinados de 1, 2, 3, 4 e 8 bytes, `FLOAT` - FLOAT, DOUBLE"), `DOUBLE` - FLOAT, DOUBLE"), `CHAR`, `VARCHAR`, `BINARY`, `VARBINARY`, `TEXT`, `BLOB`, `DATE`, `TIME`, `DATETIME`, `TIMESTAMP`, `YEAR`, `SET`, `ENUM` e tipos espaciais OpenGIS. Veja o Capítulo 13, *Tipos de Dados*.

* Tipos de strings de comprimento fixo e variável.

#### Declarações e Funções

* Suporte completo para operadores e funções na lista `SELECT` e na cláusula `WHERE` de consultas. Por exemplo:

  ```
  mysql> SELECT CONCAT(first_name, ' ', last_name)
      -> FROM citizen
      -> WHERE income/dependents > 10000 AND age > 30;
  ```

* Suporte completo para as cláusulas SQL `GROUP BY` e `ORDER BY`. Suporte para funções de grupo (`COUNT()`, `AVG()`, `STD()`, `SUM()`, `MAX()`, `MIN()` e `GROUP_CONCAT()`).

* Suporte para `LEFT OUTER JOIN` e `RIGHT OUTER JOIN` com sintaxe SQL padrão e ODBC.

* Suporte para aliases em tabelas e colunas, conforme exigido pelo SQL padrão.

* Suporte para `DELETE`, `INSERT`, `REPLACE` e `UPDATE` para retornar o número de linhas que foram alteradas (afetadas), ou para retornar o número de linhas correspondidas, ao definir uma bandeira ao se conectar ao servidor.

* Suporte para declarações `SHOW` específicas para MySQL que recuperam informações sobre bancos de dados, motores de armazenamento, tabelas e índices. Suporte para o banco de dados `INFORMATION_SCHEMA`, implementado de acordo com o SQL padrão.

* Uma declaração `EXPLAIN` para mostrar como o otimizador resolve uma consulta.

* Independência dos nomes dos funções dos nomes de tabela ou colunas. Por exemplo, `ABS` é um nome de coluna válido. A única restrição é que, para uma chamada de função, não são permitidos espaços entre o nome da função e o "`(`" que o segue. Veja a Seção 11.3, "Palavras-chave e Palavras Reservadas".

* Você pode referenciar tabelas de diferentes bancos de dados na mesma declaração.

#### Segurança

* Um sistema de privilégios e senha que é muito flexível e seguro, e que permite a verificação baseada no host.

* Segurança da senha por criptografia de todo o tráfego de senha quando você se conecta a um servidor.

#### Escalabilidade e Limites

* Suporte para grandes bancos de dados. Usamos o MySQL Server com bancos de dados que contêm 50 milhões de registros. Também conhecemos usuários que usam o MySQL Server com 200.000 tabelas e cerca de 5.000.000.000 de linhas.

* Suporte para até 64 índices por tabela. Cada índice pode consistir em 1 a 16 colunas ou partes de colunas. O comprimento máximo do índice para as tabelas `InnoDB` é de 767 bytes ou 3072 bytes. Veja a Seção 17.22, “Limites do InnoDB”. O comprimento máximo do índice para as tabelas `MyISAM` é de 1000 bytes. Veja a Seção 18.2, “O motor de armazenamento MyISAM”. Um índice pode usar um prefixo de uma coluna para os tipos de coluna `CHAR`, `VARCHAR`, `BLOB` ou `TEXT`.

#### Conectividade

* Os clientes podem se conectar ao MySQL Server usando vários protocolos:

+ Os clientes podem se conectar usando soquetes TCP/IP em qualquer plataforma.  
+ Nos sistemas Windows, os clientes podem se conectar usando tubos nomeados se o servidor for iniciado com a variável de sistema `named_pipe` habilitada. Os servidores Windows também suportam conexões de memória compartilhada se forem iniciados com a variável de sistema `shared_memory` habilitada. Os clientes podem se conectar através da memória compartilhada usando a opção `--protocol=memory`.

+ Em sistemas Unix, os clientes podem se conectar usando arquivos de soquete de domínio Unix.

* Os programas de cliente do MySQL podem ser escritos em muitos idiomas. Uma biblioteca de cliente escrita em C está disponível para clientes escritos em C ou C++, ou para qualquer idioma que forneça vincos em C.

* As APIs para C, C++, Eiffel, Java, Perl, PHP, Python, Ruby e Tcl estão disponíveis, permitindo que clientes MySQL sejam escritos em muitos idiomas. Veja o Capítulo 31, *Conectores e APIs*.

* A interface Connector/ODBC (MyODBC) oferece suporte ao MySQL para programas cliente que utilizam conexões ODBC (Conectividade de Banco de Dados Aberto). Por exemplo, você pode usar o MS Access para se conectar ao seu servidor MySQL. Os clientes podem ser executados no Windows ou no Unix. A fonte do Connector/ODBC está disponível. Todas as funções ODBC 2.5 são suportadas, assim como muitas outras. Veja o Guia do Desenvolvedor do MySQL Connector/ODBC.

* A interface Connector/J oferece suporte ao MySQL para programas de cliente Java que utilizam conexões JDBC. Os clientes podem ser executados no Windows ou no Unix. A fonte do Connector/J está disponível. Consulte o Guia do Desenvolvedor do MySQL Connector/J.

* O MySQL Connector/NET permite que os desenvolvedores criem facilmente aplicações .NET que exigem conectividade segura e de alto desempenho com o MySQL. Ele implementa as interfaces necessárias do ADO.NET e se integra a ferramentas conscientes do ADO.NET. Os desenvolvedores podem construir aplicações usando sua escolha de linguagens .NET. O MySQL Connector/NET é um driver ADO.NET totalmente gerenciado escrito em 100% puro C#. Veja o Guia do Desenvolvedor do MySQL Connector/NET.

#### Localização

* O servidor pode fornecer mensagens de erro aos clientes em vários idiomas. Veja a Seção 12.12, “Definindo o idioma da mensagem de erro”.

* Suporte completo para vários conjuntos de caracteres diferentes, incluindo `latin1` (cp1252), `german`, `big5`, `ujis`, vários conjuntos de caracteres Unicode e outros. Por exemplo, os caracteres escandinavos “`å`”, “`ä`” e “`ö`” são permitidos em nomes de tabela e coluna.

* Todos os dados são salvos no conjunto de caracteres escolhido. * A classificação e as comparações são feitas de acordo com o conjunto de caracteres padrão e a ordenação. É possível alterar isso quando o servidor MySQL é iniciado (consulte a Seção 12.3.2, “Conjunto de caracteres do servidor e ordenação”). Para ver um exemplo de classificação muito avançada, veja o código de classificação checo. O MySQL Server suporta muitos conjuntos de caracteres diferentes que podem ser especificados no momento da compilação e no tempo de execução.

* O fuso horário do servidor pode ser alterado dinamicamente, e os clientes individuais podem especificar seu próprio fuso horário. Veja a Seção 7.1.15, “Suporte ao fuso horário do servidor MySQL”.

#### Clientes e Ferramentas

* O MySQL inclui vários programas de cliente e utilitários. Esses incluem tanto programas de linha de comando, como **mysqldump** e **mysqladmin**, quanto programas gráficos, como o MySQL Workbench.

* O MySQL Server tem suporte integrado para declarações SQL para verificar, otimizar e reparar tabelas. Essas declarações estão disponíveis na linha de comando através do cliente **mysqlcheck**. O MySQL também inclui **myisamchk**, uma ferramenta de linha de comando muito rápida para realizar essas operações em tabelas `MyISAM`. Veja o Capítulo 6, *Programas MySQL*.

* Os programas do MySQL podem ser invocados com as opções `--help` ou `-?` para obter assistência online.

### 1.2.3 História do MySQL

Começamos com a intenção de usar o sistema de banco de dados `mSQL` para conectar nossas tabelas usando nossas próprias rotinas de baixo nível (ISAM) rápidas. No entanto, após algumas testagens, chegamos à conclusão de que o `mSQL` não era rápido o suficiente ou flexível o suficiente para nossas necessidades. Isso resultou em uma nova interface SQL para nosso banco de dados, mas com quase a mesma interface de API que o `mSQL`. Esta API foi projetada para permitir que código de terceiros que foi escrito para uso com o `mSQL` fosse facilmente exportado para uso com MySQL.

MySQL é nomeado em homenagem à filha do cofundador Monty Widenius, My.

O nome do Delfim de MySQL (nosso logotipo) é “Sakila”, que foi escolhido a partir de uma enorme lista de nomes sugeridos por usuários em nosso concurso “Nomeie o Delfim”. O nome vencedor foi enviado por Ambrose Twebaze, um desenvolvedor de software de código aberto de Eswatini (anteriormente Suazilândia), África. Segundo Ambrose, o nome feminino Sakila tem suas raízes em SiSwati, a língua local de Eswatini. Sakila também é o nome de uma cidade em Arusha, Tanzânia, perto do país de origem de Ambrose, Uganda.