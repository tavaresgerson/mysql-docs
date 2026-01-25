### 1.2.2 As Principais Funcionalidades do MySQL

Esta seção descreve algumas das características importantes do Software de Database MySQL. Na maioria dos aspectos, o roteiro se aplica a todas as versões do MySQL. Para obter informações sobre funcionalidades introduzidas no MySQL em séries específicas, consulte a seção “Em Resumo” (*In a Nutshell*) do Manual apropriado:

* MySQL 8.4: O Que Há de Novo no MySQL 8.4 desde o MySQL 8.0
* MySQL 8.0: O Que Há de Novo no MySQL 8.0
* MySQL 5.7: Seção 1.3, “O Que Há de Novo no MySQL 5.7”

#### Componentes Internos e Portabilidade

* Escrito em C e C++.
* Testado com uma ampla gama de compiladores diferentes.
* Funciona em muitas plataformas diferentes. Veja <https://www.mysql.com/support/supportedplatforms/database.html>.
* Para portabilidade, configurado usando **CMake**.
* Testado com Purify (um detector comercial de *memory leakage*) e também com Valgrind, uma ferramenta GPL (<https://valgrind.org/>).
* Utiliza um design de server em múltiplas camadas com módulos independentes.
* Projetado para ser totalmente *multithreaded* usando *kernel threads*, para utilizar facilmente múltiplos CPUs, se disponíveis.
* Oferece *storage engines* transacionais e não transacionais.
* Utiliza B-tree *disk tables* (`MyISAM`) muito rápidas com compressão de Index.
* Projetado para ser relativamente fácil adicionar outros *storage engines*. Isso é útil se você deseja fornecer uma interface SQL para um Database interno (*in-house*).
* Utiliza um sistema de alocação de memória baseado em *Thread* muito rápido.
* Executa *joins* muito rápidos usando um *nested-loop join* otimizado.
* Implementa *hash tables* em memória, que são usadas como tabelas temporárias.
* Implementa funções SQL usando uma *class library* altamente otimizada, projetada para ser o mais rápida possível. Geralmente, não há alocação de memória após a inicialização da Query.
* Fornece o server como um programa separado para uso em um ambiente de rede *client/server*.

#### Tipos de Dados

* Muitos Tipos de Dados: inteiros assinados (*signed*) e não assinados (*unsigned*) de 1, 2, 3, 4 e 8 bytes de comprimento, `FLOAT` (FLOAT, DOUBLE"), `DOUBLE` (FLOAT, DOUBLE"), `CHAR`, `VARCHAR`, `BINARY`, `VARBINARY`, `TEXT`, `BLOB`, `DATE`, `TIME`, `DATETIME`, `TIMESTAMP`, `YEAR`, `SET`, `ENUM` e tipos espaciais OpenGIS. Consulte o Capítulo 11, *Tipos de Dados*.
* Tipos de *string* de comprimento fixo e comprimento variável.

#### Statements e Funções

* Suporte completo a operadores e funções na lista `SELECT` e na cláusula `WHERE` das *queries*. Por exemplo:

  ```sql
  mysql> SELECT CONCAT(first_name, ' ', last_name)
      -> FROM citizen
      -> WHERE income/dependents > 10000 AND age > 30;
  ```

* Suporte completo para as cláusulas SQL `GROUP BY` e `ORDER BY`. Suporte para funções de grupo (`COUNT()`, `AVG()`, `STD()`, `SUM()`, `MAX()`, `MIN()` e `GROUP_CONCAT()`).
* Suporte para `LEFT OUTER JOIN` e `RIGHT OUTER JOIN` com sintaxe SQL padrão e ODBC.
* Suporte para *aliases* em tabelas e colunas, conforme exigido pelo SQL padrão.
* Suporte para `DELETE`, `INSERT`, `REPLACE` e `UPDATE` para retornar o número de linhas que foram alteradas (afetadas), ou para retornar o número de linhas correspondentes em vez disso, definindo um *flag* ao conectar-se ao server.
* Suporte para *statements* `SHOW` específicos do MySQL que recuperam informações sobre Databases, *storage engines*, tabelas e Indexes. Suporte para o Database `INFORMATION_SCHEMA`, implementado de acordo com o SQL padrão.
* Um *statement* `EXPLAIN` para mostrar como o *optimizer* resolve uma Query.
* Independência de nomes de função em relação a nomes de tabelas ou colunas. Por exemplo, `ABS` é um nome de coluna válido. A única restrição é que, para uma chamada de função, não são permitidos espaços entre o nome da função e o “`(`” que a segue. Consulte a Seção 9.3, “Palavras-Chave e Palavras Reservadas”.
* É possível fazer referência a tabelas de Databases diferentes no mesmo *statement*.

#### Segurança

* Um sistema de privilégios e senhas muito flexível e seguro, que permite verificação baseada em *host*.
* Segurança de senha por meio de criptografia de todo o tráfego de senhas ao conectar-se a um server.

#### Escalabilidade e Limites

* Suporte para Databases grandes. Utilizamos o MySQL Server com Databases que contêm 50 milhões de registros. Também temos conhecimento de usuários que utilizam o MySQL Server com 200.000 tabelas e cerca de 5.000.000.000 de linhas.
* Suporte para até 64 Indexes por tabela. Cada Index pode consistir de 1 a 16 colunas ou partes de colunas. A largura máxima do Index para tabelas `InnoDB` é de 767 bytes ou 3072 bytes. Consulte a Seção 14.23, “Limites do InnoDB”. A largura máxima do Index para tabelas `MyISAM` é de 1000 bytes. Consulte a Seção 15.2, “O Storage Engine MyISAM”. Um Index pode usar um prefixo de coluna para os tipos de coluna `CHAR`, `VARCHAR`, `BLOB` ou `TEXT`.

#### Conectividade

* Clientes podem se conectar ao MySQL Server usando diversos protocolos:

  + Clientes podem se conectar usando *TCP/IP sockets* em qualquer plataforma.
  + Em sistemas Windows, os clientes podem se conectar usando *named pipes* se o server for iniciado com a variável de sistema `named_pipe` habilitada. Servidores Windows também suportam conexões de *shared-memory* se iniciados com a variável de sistema `shared_memory` habilitada. Os clientes podem se conectar através de *shared memory* usando a opção `--protocol=memory`.
  + Em sistemas Unix, os clientes podem se conectar usando arquivos *Unix domain socket*.

* Programas cliente MySQL podem ser escritos em muitas linguagens. Uma *client library* escrita em C está disponível para clientes escritos em C ou C++, ou para qualquer linguagem que forneça *C bindings*.

* APIs para C, C++, Eiffel, Java, Perl, PHP, Python, Ruby e Tcl estão disponíveis, permitindo que clientes MySQL sejam escritos em muitas linguagens. Consulte o Capítulo 27, *Connectors e APIs*.

* A interface Connector/ODBC (MyODBC) fornece suporte MySQL para programas cliente que usam conexões ODBC (*Open Database Connectivity*). Por exemplo, você pode usar o MS Access para se conectar ao seu MySQL server. Clientes podem ser executados no Windows ou Unix. O código-fonte do Connector/ODBC está disponível. Todas as funções ODBC 2.5 são suportadas, assim como muitas outras. Consulte o Guia do Desenvolvedor do MySQL Connector/ODBC.

* A interface Connector/J fornece suporte MySQL para programas cliente Java que usam conexões JDBC. Clientes podem ser executados no Windows ou Unix. O código-fonte do Connector/J está disponível. Consulte o Guia do Desenvolvedor do MySQL Connector/J.

* O MySQL Connector/NET permite que desenvolvedores criem facilmente aplicações .NET que exigem conectividade de dados segura e de alto desempenho com o MySQL. Ele implementa as interfaces ADO.NET necessárias e se integra a ferramentas compatíveis com ADO.NET. Os desenvolvedores podem criar aplicações usando a linguagem .NET de sua escolha. O MySQL Connector/NET é um *driver* ADO.NET totalmente gerenciado, escrito 100% em C# puro. Consulte o Guia do Desenvolvedor do MySQL Connector/NET.

#### Localização

* O server pode fornecer mensagens de erro aos clientes em vários idiomas. Consulte a Seção 10.12, “Configurando o Idioma das Mensagens de Erro”.
* Suporte completo para vários *character sets* diferentes, incluindo `latin1` (cp1252), `german`, `big5`, `ujis`, vários *character sets* Unicode e mais. Por exemplo, os caracteres escandinavos “`å`”, “`ä`” e “`ö`” são permitidos em nomes de tabelas e colunas.
* Todos os dados são salvos no *character set* escolhido.
* A classificação (*sorting*) e as comparações são feitas de acordo com o *character set* e *collation* padrão. É possível alterar isso quando o MySQL server é iniciado (consulte a Seção 10.3.2, “Character Set e Collation do Server”). Para ver um exemplo de classificação muito avançada, consulte o código de classificação tcheco. O MySQL Server suporta muitos *character sets* diferentes que podem ser especificados em tempo de compilação e *runtime*.
* O *time zone* do server pode ser alterado dinamicamente, e clientes individuais podem especificar seu próprio *time zone*. Consulte a Seção 5.1.13, “Suporte a Time Zone do MySQL Server”.

#### Clientes e Ferramentas

* O MySQL inclui vários programas cliente e de utilidade. Isso inclui tanto programas de linha de comando, como **mysqldump** e **mysqladmin**, quanto programas gráficos, como o MySQL Workbench.
* O MySQL Server tem suporte nativo (*built-in*) para *statements* SQL para verificar, otimizar e reparar tabelas. Esses *statements* estão disponíveis a partir da linha de comando através do cliente **mysqlcheck**. O MySQL também inclui o **myisamchk**, um utilitário de linha de comando muito rápido para realizar essas operações em tabelas `MyISAM`. Consulte o Capítulo 4, *Programas MySQL*.
* Programas MySQL podem ser invocados com a opção `--help` ou `-?` para obter assistência online.