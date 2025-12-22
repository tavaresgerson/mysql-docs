### 1.2.2 As principais características do MySQL

Esta seção descreve algumas das características importantes do MySQL Database Software. Em muitos aspectos, o roteiro se aplica a todas as versões do MySQL.

#### Internos e Portabilidade

- Escrito em C e C++.
- Testado com uma ampla gama de diferentes compiladores.
- Funciona em muitas plataformas diferentes. Veja <https://www.mysql.com/support/supportedplatforms/database.html>.
- Para portabilidade, configurado usando **CMake**.
- Testado com Purify (um detector de vazamento de memória comercial), bem como com Valgrind, uma ferramenta GPL (<https://valgrind.org/>).
- Utiliza um design de servidor em várias camadas com módulos independentes.
- Projetado para ser totalmente multithreaded usando threads do kernel, para usar facilmente várias CPUs se estiverem disponíveis.
- Fornece mecanismos de armazenamento transacionais e não transacionais.
- Usa tabelas de disco B-tree muito rápidas (`MyISAM`) com compressão de índice.
- Projetado para tornar relativamente fácil adicionar outros motores de armazenamento. Isso é útil se você quiser fornecer uma interface SQL para um banco de dados interno.
- Utiliza um sistema de alocação de memória baseado em threads muito rápido.
- Executa junções muito rápidas usando uma junção de loop aninhado otimizada.
- Implementa tabelas de hash na memória, que são usadas como tabelas temporárias.
- Implementa funções SQL usando uma biblioteca de classes altamente otimizada que deve ser o mais rápida possível. Normalmente não há alocação de memória após a inicialização da consulta.
- Fornece o servidor como um programa separado para uso em um ambiente de rede cliente/servidor.

#### Tipos de dados

- Muitos tipos de dados: inteiros assinados/não assinados de 1, 2, 3, 4 e 8 bytes de comprimento, `FLOAT`, `DOUBLE`, `CHAR`, `VARCHAR`, `BINARY`, `VARBINARY`, `TEXT`, `BLOB`, `DATE`, `TIME`, `DATETIME`, `TIMESTAMP`, `YEAR`, `SET`, `ENUM`, e tipos espaciais do OpenGIS.
- Tipos de strings de comprimento fixo e variável.

#### Declarações e Funções

- Suporte completo de operadores e funções na lista de consultas e na cláusula de consultas `SELECT`. Por exemplo:

  ```sql
  mysql> SELECT CONCAT(first_name, ' ', last_name)
      -> FROM citizen
      -> WHERE income/dependents > 10000 AND age > 30;
  ```
- Suporte completo para as cláusulas SQL `GROUP BY` e `ORDER BY` e para funções de grupo (`COUNT()`, `AVG()`, `STD()`, `SUM()`, `MAX()`, `MIN()`, e `GROUP_CONCAT()`).
- Suporte para `LEFT OUTER JOIN` e `RIGHT OUTER JOIN` com sintaxe SQL e ODBC padrão.
- Suporte para aliases em tabelas e colunas, conforme exigido pelo SQL padrão.
- Suporte para `DELETE`, `INSERT`, `REPLACE`, e `UPDATE` para retornar o número de linhas que foram alteradas (afetadas), ou para retornar o número de linhas correspondidas ao invés disso, definindo uma bandeira ao se conectar ao servidor.
- Suporte para as instruções `SHOW` específicas do MySQL que recuperam informações sobre bancos de dados, motores de armazenamento, tabelas e índices. Suporte para o banco de dados `INFORMATION_SCHEMA`, implementado de acordo com o SQL padrão.
- Uma instrução `EXPLAIN` para mostrar como o otimizador resolve uma consulta.
- Independência de nomes para nomes de função, tabela ou coluna. Por exemplo, `ABS` é um nome de coluna válido. A única restrição é que para uma chamada de função, nenhum espaço é permitido entre o nome da função e o "`(`" que o segue. Veja Seção 11.3, "Palavras-chave e Palavras Reservadas".
- Pode fazer referência a tabelas de diferentes bases de dados na mesma instrução.

#### Segurança

- Um sistema de privilégios e senhas que é muito flexível e seguro, e que permite a verificação baseada em host.
- Segurança de senha por criptografia de todo o tráfego de senhas quando você se conecta a um servidor.

#### Escalabilidade e Limites

- Suporte para grandes bancos de dados. Usamos o MySQL Server com bancos de dados que contêm 50 milhões de registros. Também sabemos de usuários que usam o MySQL Server com 200.000 tabelas e cerca de 5.000.000.000 de linhas.
- Suporte para até 64 índices por tabela. Cada índice pode consistir de 1 a 16 colunas ou partes de colunas. A largura máxima do índice para tabelas `InnoDB` é de 767 bytes ou 3072 bytes. Veja Seção 17.21, "Limites do InnoDB". A largura máxima do índice para tabelas `MyISAM` é de 1000 bytes. Veja Seção 18.2, "O mecanismo de armazenamento MyISAM". Um índice pode usar um prefixo de uma coluna para tipos de coluna `CHAR`, `VARCHAR`, `BLOB` ou `TEXT`.

#### Conectividade

- Os clientes podem se conectar ao MySQL Server usando vários protocolos:
  - Os clientes podem se conectar usando soquetes TCP/IP em qualquer plataforma.
  - Em sistemas Windows, os clientes podem se conectar usando pipes nomeados se o servidor for iniciado com a variável de sistema `named_pipe` habilitada. Os servidores Windows também suportam conexões de memória compartilhada se iniciadas com a variável de sistema `shared_memory` habilitada. Os clientes podem se conectar através de memória compartilhada usando a opção `--protocol=memory`.
  - Em sistemas Unix, os clientes podem se conectar usando arquivos de soquete de domínio Unix.
- Programas de cliente MySQL podem ser escritos em muitas linguagens. Uma biblioteca de cliente escrita em C está disponível para clientes escritos em C ou C++, ou para qualquer linguagem que forneça ligações em C.
- APIs para C, C++, Eiffel, Java, Perl, PHP, Python, Ruby e Tcl estão disponíveis, permitindo que os clientes MySQL sejam escritos em muitos idiomas.
- A interface Connector/ODBC (MyODBC) fornece suporte ao MySQL para programas clientes que usam conexões ODBC (Open Database Connectivity). Por exemplo, você pode usar o MS Access para se conectar ao seu servidor MySQL. Os clientes podem ser executados no Windows ou Unix. O código-fonte do Connector/ODBC está disponível. Todas as funções ODBC 2.5 são suportadas, assim como muitas outras.
- A interface Connector/J fornece suporte MySQL para programas de cliente Java que usam conexões JDBC. Os clientes podem ser executados no Windows ou Unix. O código-fonte do Connector/J está disponível.
- O MySQL Connector/NET permite aos desenvolvedores criar facilmente aplicativos .NET que requerem conectividade de dados segura e de alto desempenho com o MySQL. Ele implementa as interfaces ADO.NET necessárias e integra-se em ferramentas conscientes do ADO.NET. Os desenvolvedores podem criar aplicativos usando sua escolha de linguagens .NET. O MySQL Connector/NET é um driver ADO.NET totalmente gerenciado escrito em C# puro.

#### Localização

- O servidor pode fornecer mensagens de erro aos clientes em muitos idiomas.
- Suporte completo para vários conjuntos de caracteres diferentes, incluindo `latin1` (cp1252), `german`, `big5`, `ujis`, vários conjuntos de caracteres Unicode e mais. Por exemplo, os caracteres escandinavos "`å`", "`ä`" e "`ö`" são permitidos em nomes de tabelas e colunas.
- Todos os dados são salvos no conjunto de caracteres escolhido.
- A classificação e as comparações são feitas de acordo com o conjunto de caracteres e a coleta padrão. É possível alterar isso quando o servidor MySQL é iniciado (ver Seção 12.3.2, "Conjunto de caracteres e coleta do servidor"). Para ver um exemplo de classificação muito avançada, veja o código de classificação checo. O MySQL Server suporta muitos conjuntos de caracteres diferentes que podem ser especificados no tempo de compilação e no tempo de execução.
- O fuso horário do servidor pode ser alterado dinamicamente, e os clientes individuais podem especificar seu próprio fuso horário.

#### Clientes e Ferramentas

- O MySQL inclui vários programas de cliente e utilitários, incluindo programas de linha de comando como `mysqldump` e `mysqladmin`, e programas gráficos como o MySQL Workbench.
- O MySQL Server tem suporte embutido para instruções SQL para verificar, otimizar e reparar tabelas. Estas instruções estão disponíveis a partir da linha de comando através do cliente `mysqlcheck`. O MySQL também inclui `myisamchk`, um utilitário de linha de comando muito rápido para executar essas operações em tabelas `MyISAM`.
- Os programas MySQL podem ser invocados com a opção `--help` ou `-?` para obter assistência on-line.
