### 1.2.2 Principais Características do MySQL

Esta seção descreve algumas das características importantes do Software de Banco de Dados MySQL. Na maioria dos aspectos, o roteiro se aplica a todas as versões do MySQL. Para informações sobre as funcionalidades à medida que são introduzidas no MySQL de forma específica para cada série, consulte a seção “Em Resumo” do Manual apropriado:

* MySQL 8.4: O que há de Novo no MySQL 8.4 desde o MySQL 8.0
* MySQL 8.0: O que há de Novo no MySQL 8.0
* MySQL 5.7: O que há de Novo no MySQL 5.7

#### Internos e Portabilidade

* Escrito em C e C++.
* Testado com uma ampla gama de compiladores diferentes.
* Funciona em muitas plataformas diferentes. Veja <https://www.mysql.com/support/supportedplatforms/database.html>.

* Para a portabilidade, configurado usando **CMake**.
* Testado com Purify (um detector comercial de vazamento de memória) e também com Valgrind, uma ferramenta GPL (<https://valgrind.org/>).

* Usa um design de servidor em camadas com módulos independentes.
* Projetado para ser totalmente multithread usando threads do kernel, para usar facilmente múltiplos CPUs, se estiverem disponíveis.

* Fornece motores de armazenamento transacionais e não transacionais.
* Usa tabelas de disco B-tree muito rápidas (`MyISAM`) com compressão de índice.

* Projetado para tornar relativamente fácil adicionar outros motores de armazenamento. Isso é útil se você quiser fornecer uma interface SQL para um banco de dados interno.

* Usa um sistema de alocação de memória baseado em threads muito rápido.
* Executa junções muito rápidas usando uma junção otimizada de loop aninhado.
* Implementa tabelas de hash em memória, que são usadas como tabelas temporárias.

* Implementa funções SQL usando uma biblioteca de classes altamente otimizada que deve ser tão rápida quanto possível. Geralmente, não há alocação de memória no início da consulta.

* Fornece o servidor como um programa separado para uso em um ambiente de rede cliente/servidor.

#### Tipos de Dados

* Muitos tipos de dados: inteiros assinados/não assinados de 1, 2, 3, 4 e 8 bytes, `FLOAT` - FLOAT, `DOUBLE`), `DOUBLE` - FLOAT, `DOUBLE`), `CHAR`, `VARCHAR`, `BINARY`, `VARBINARY`, `TEXT`, `BLOB`, `DATE`, `TIME`, `DATETIME`, `TIMESTAMP`, `YEAR`, `SET`, `ENUM` e tipos espaciais OpenGIS. Veja o Capítulo 13, *Tipos de Dados*.

* Tipos de string de comprimento fixo e variável.

#### Declarações e Funções

* Suporte completo para operadores e funções na lista `SELECT` e na cláusula `WHERE` das consultas. Por exemplo:

  ```
  mysql> SELECT CONCAT(first_name, ' ', last_name)
      -> FROM citizen
      -> WHERE income/dependents > 10000 AND age > 30;
  ```

* Suporte completo para as cláusulas `GROUP BY` e `ORDER BY` do SQL. Suporte para funções de grupo (`COUNT()`, `AVG()`, `STD()`, `SUM()`, `MAX()`, `MIN()` e `GROUP_CONCAT()`).

* Suporte para `LEFT OUTER JOIN` e `RIGHT OUTER JOIN` com sintaxe SQL padrão e ODBC.

* Suporte para aliases em tabelas e colunas conforme exigido pelo SQL padrão.

* Suporte para `DELETE`, `INSERT`, `REPLACE` e `UPDATE` para retornar o número de linhas que foram alteradas (afetadas) ou para retornar o número de linhas correspondentes, definindo uma flag ao se conectar ao servidor.

* Suporte para declarações `SHOW` específicas do MySQL que recuperam informações sobre bancos de dados, motores de armazenamento, tabelas e índices. Suporte para o banco de dados `INFORMATION_SCHEMA`, implementado de acordo com o SQL padrão.

* Uma declaração `EXPLAIN` para mostrar como o otimizador resolve uma consulta.

* Independência dos nomes das funções dos nomes das tabelas ou colunas. Por exemplo, `ABS` é um nome de coluna válido. A única restrição é que, para uma chamada de função, não são permitidos espaços entre o nome da função e a vírgula que a segue. Veja a Seção 11.3, “Palavras-chave e Palavras Reservadas”.

* Você pode referenciar tabelas de diferentes bancos de dados na mesma declaração.

#### Segurança

* Um sistema de privilégios e senha que é muito flexível e seguro, e que permite a verificação baseada no host.

* Segurança da senha por criptografia de todo o tráfego de senha ao se conectar a um servidor.

#### Escalabilidade e Limites

* Suporte para grandes bancos de dados. Usamos o MySQL Server com bancos de dados que contêm 50 milhões de registros. Também conhecemos usuários que usam o MySQL Server com 200.000 tabelas e cerca de 5.000.000.000 de linhas.

* Suporte para até 64 índices por tabela. Cada índice pode consistir de 1 a 16 colunas ou partes de colunas. A largura máxima do índice para tabelas `InnoDB` é de 767 bytes ou 3072 bytes. Veja a Seção 17.21, “Limites do InnoDB”. A largura máxima do índice para tabelas `MyISAM` é de 1000 bytes. Veja a Seção 18.2, “O Motor de Armazenamento MyISAM”. Um índice pode usar um prefixo de uma coluna para tipos de coluna `CHAR`, `VARCHAR`, `BLOB` ou `TEXT`.

#### Conectividade

* Os clientes podem se conectar ao MySQL Server usando vários protocolos:

  + Os clientes podem se conectar usando soquetes TCP/IP em qualquer plataforma.
  + Em sistemas Windows, os clientes podem se conectar usando canais nomeados se o servidor for iniciado com a variável de sistema `named_pipe` habilitada. Os servidores Windows também suportam conexões de memória compartilhada se iniciados com a variável de sistema `shared_memory` habilitada. Os clientes podem se conectar através da memória compartilhada usando a opção `--protocol=memory`.

  + Em sistemas Unix, os clientes podem se conectar usando arquivos de soquete de domínio Unix.

* Os programas clientes do MySQL podem ser escritos em muitos idiomas. Uma biblioteca cliente escrita em C está disponível para clientes escritos em C ou C++, ou para qualquer idioma que forneça acoplamentos C.

* As APIs para C, C++, Eiffel, Java, Perl, PHP, Python, Ruby e Tcl estão disponíveis, permitindo que os clientes MySQL sejam escritos em muitos idiomas. Veja o Capítulo 31, *Conectores e APIs*.

* A interface Connector/ODBC (MyODBC) oferece suporte ao MySQL para programas cliente que utilizam conexões ODBC (Open Database Connectivity). Por exemplo, você pode usar o MS Access para se conectar ao seu servidor MySQL. Os clientes podem ser executados no Windows ou no Unix. O código-fonte do Connector/ODBC está disponível. Todas as funções ODBC 2.5 são suportadas, assim como muitas outras. Consulte o Guia do Desenvolvedor do MySQL Connector/ODBC.

* A interface Connector/J oferece suporte ao MySQL para programas cliente Java que utilizam conexões JDBC. Os clientes podem ser executados no Windows ou no Unix. O código-fonte do Connector/J está disponível. Consulte o Guia do Desenvolvedor do MySQL Connector/J.

* O MySQL Connector/NET permite que os desenvolvedores criem facilmente aplicações .NET que exigem conectividade de dados segura e de alto desempenho com o MySQL. Ele implementa as interfaces ADO.NET necessárias e se integra a ferramentas conscientes do ADO.NET. Os desenvolvedores podem criar aplicações usando sua escolha de linguagens .NET. O MySQL Connector/NET é um driver ADO.NET totalmente gerenciado escrito em 100% puro C#. Consulte o Guia do Desenvolvedor do MySQL Connector/NET.

#### Localização

* O servidor pode fornecer mensagens de erro aos clientes em vários idiomas. Consulte a Seção 12.12, “Definindo o Idioma da Mensagem de Erro”.

* Suporte completo para vários conjuntos de caracteres diferentes, incluindo `latin1` (cp1252), `german`, `big5`, `ujis`, vários conjuntos de caracteres Unicode e mais. Por exemplo, os caracteres escandinavos “`å`”, “`ä`” e “`ö`” são permitidos em nomes de tabelas e colunas.

* Todos os dados são salvos no conjunto de caracteres escolhido.
* A classificação e as comparações são feitas de acordo com o conjunto de caracteres e a ordenação padrão. É possível alterá-las quando o servidor MySQL é iniciado (consulte a Seção 12.3.2, “Conjunto de caracteres e ordenação do servidor MySQL”). Para ver um exemplo de classificação muito avançada, consulte o código de classificação checo. O MySQL Server suporta muitos conjuntos de caracteres diferentes que podem ser especificados no momento da compilação e no tempo de execução.

* O fuso horário do servidor pode ser alterado dinamicamente, e os clientes individuais podem especificar seu próprio fuso horário. Consulte a Seção 7.1.15, “Suporte ao fuso horário do MySQL Server”.

#### Clientes e Ferramentas

* O MySQL inclui vários programas de cliente e utilitários. Estes incluem programas de linha de comando, como **mysqldump** e **mysqladmin**, e programas gráficos, como o MySQL Workbench.

* O MySQL Server tem suporte integrado para instruções SQL para verificar, otimizar e reparar tabelas. Essas instruções estão disponíveis na linha de comando através do cliente **mysqlcheck**. O MySQL também inclui **myisamchk**, uma ferramenta de linha de comando muito rápida para realizar essas operações em tabelas `MyISAM`. Consulte o Capítulo 6, *Programas MySQL*.

* Os programas MySQL podem ser invocados com a opção `--help` ou `-?` para obter assistência online.