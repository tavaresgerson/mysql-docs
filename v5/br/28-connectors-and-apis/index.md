# Capítulo 27 Conectores e APIs

**Índice**

27.1 MySQL Connector/C++

27.2 MySQL Connector/J

27.3 MySQL Connector/NET

27.4 MySQL Connector/ODBC

27.5 MySQL Connector/Python

27.6 libmysqld, a Biblioteca de Servidor MySQL Integrado :   27.6.1 Compilação de Programas com libmysqld

```
27.6.2 Restrictions When Using the Embedded MySQL Server

27.6.3 Options with the Embedded Server

27.6.4 Embedded Server Examples
```

27.7 API C do MySQL

27.8 API MySQL PHP

27.9 API MySQL Perl

27.10 API MySQL Python

27.11 APIs Ruby do MySQL :   27.11.1 API MySQL/Ruby

```
27.11.2 The Ruby/MySQL API
```

27.12 API MySQL Tcl

27.13 MySQL Eiffel Wrapper

Os Conectores MySQL fornecem conectividade ao servidor MySQL para programas cliente. As APIs fornecem acesso de baixo nível aos recursos do MySQL usando o protocolo MySQL clássico ou o Protocolo X. Tanto os Conectores quanto as APIs permitem que você conecte e execute instruções MySQL a partir de outra linguagem ou ambiente, incluindo ODBC, Java (JDBC), C++, Python, PHP, Perl, Ruby e instâncias nativas de C e MySQL embutidas.

## Conectores MySQL

A Oracle desenvolve vários conectores:

- O conector/C++ permite que aplicativos em C++ se conectem ao MySQL.

- O Connector/J oferece suporte ao driver para conectar-se ao MySQL a partir de aplicações Java usando a API padrão de Conectividade de Banco de Dados Java (JDBC).

- Connector/NET permite que os desenvolvedores criem aplicativos .NET que se conectam ao MySQL. O Connector/NET implementa uma interface ADO.NET totalmente funcional e oferece suporte para uso com ferramentas que reconhecem o ADO.NET. Os aplicativos que utilizam o Connector/NET podem ser escritos em qualquer linguagem .NET suportada.

- Conector/ODBC oferece suporte ao driver para conectar-se ao MySQL usando a API de Conectividade de Banco de Dados Aberta (ODBC). O suporte está disponível para conectividade ODBC de plataformas Windows, Unix e macOS.

- Conector/Python oferece suporte ao driver para conectar-se ao MySQL a partir de aplicativos Python usando uma API que é compatível com a Python DB API versão 2.0. Não são necessários módulos adicionais do Python ou bibliotecas de cliente MySQL.

## A API C do MySQL

Para acessar diretamente o uso do MySQL de forma nativa dentro de uma aplicação C, existem dois métodos:

- A API C oferece acesso de nível baixo ao protocolo cliente/servidor do MySQL por meio da biblioteca de clientes `libmysqlclient`. Este é o método primário usado para se conectar a uma instância do servidor MySQL e é utilizado tanto pelos clientes da linha de comando do MySQL quanto por muitos dos Conectores MySQL e APIs de terceiros detalhados aqui.

  O `libmysqlclient` está incluído nas distribuições do MySQL.

- `libmysqld` é uma biblioteca de servidor MySQL embutida que permite embutir uma instância do servidor MySQL em suas aplicações em C.

  `libmysqld` está incluído nas distribuições do MySQL.

  Nota

  A biblioteca de servidor embutida `libmysqld` está desatualizada a partir do MySQL 5.7.19 e será removida no MySQL 8.0.

Veja também Implementações da API C do MySQL.

Para acessar o MySQL a partir de uma aplicação em C ou para criar uma interface para o MySQL para uma linguagem que não seja suportada pelos Conectadores ou APIs neste capítulo, é necessário começar com a API em C. Vários utilitários para programadores estão disponíveis para ajudar nesse processo; veja Seção 4.7, “Utilitários de Desenvolvimento de Programas”.

## APIs de terceiros para MySQL

As APIs restantes descritas neste capítulo fornecem uma interface para o MySQL a partir de linguagens de aplicação específicas. Essas soluções de terceiros não são desenvolvidas ou suportadas pela Oracle. Informações básicas sobre seu uso e capacidades são fornecidas aqui apenas para referência.

Todas as APIs de linguagem de terceiros são desenvolvidas usando um dos dois métodos, utilizando `libmysqlclient` ou implementando um driver nativo. As duas soluções oferecem benefícios diferentes:

- Usar *`libmysqlclient`* oferece compatibilidade completa com o MySQL, pois utiliza as mesmas bibliotecas que as aplicações do cliente MySQL. No entanto, o conjunto de recursos é limitado à implementação e interfaces expostas através do `libmysqlclient`, e o desempenho pode ser menor, pois os dados são copiados entre o código nativo e os componentes da API MySQL.

- *Os drivers nativos* são uma implementação do protocolo de rede MySQL inteiramente dentro da linguagem ou ambiente do host. Os drivers nativos são rápidos, pois há menos cópia de dados entre os componentes, e podem oferecer funcionalidades avançadas não disponíveis através da API padrão do MySQL. Os drivers nativos também são mais fáceis de construir e implantar para os usuários finais, pois não é necessário copiar as bibliotecas do cliente MySQL para construir os componentes do driver nativo.

A Tabela 27.1, “APIs e interfaces do MySQL” (connectors-apis.html#connectors-apis-summary), lista muitas das bibliotecas e interfaces disponíveis para o MySQL.

**Tabela 27.1 APIs e interfaces do MySQL**

<table summary="Resumo das APIs e interfaces do MySQL, mostrando o ambiente, a API, o tipo e as notas relacionadas."><col style="width: 10%"/><col style="width: 35%"/><col style="width: 15%"/><col style="width: 40%"/><thead><tr> <th>Meio Ambiente</th> <th>API</th> <th>Tipo</th> <th>Notas</th> </tr></thead><tbody><tr> <th>Ada</th> <td>GNU Ada MySQL Bindings</td> <td>[[PH_HTML_CODE_<code>erlang-mysql-driver</code>]</td> <td>Veja<a class="ulink" href="http://gnade.sourceforge.net/" target="_blank">Ligações MySQL para GNU Ada</a></td> </tr><tr> <th>C</th> <td>C API</td> <td>[[PH_HTML_CODE_<code>erlang-mysql-driver</code>]</td> <td>Veja<a class="ulink" href="/doc/c-api/5.7/en/" target="_top">Guia do desenvolvedor da API C para MySQL 5.7</a>.</td> </tr><tr> <th>C++</th> <td>Conector/C++</td> <td>[[PH_HTML_CODE_<code>libmysqlclient</code>]</td> <td>Veja<a class="ulink" href="/doc/connector-cpp/9.4/en/" target="_top">Guia do desenvolvedor do MySQL Connector/C++ 9.5</a>.</td> </tr><tr> <th></th> <td>MySQL++</td> <td>[[PH_HTML_CODE_<code>libmysqlclient</code>]</td> <td>Veja<a class="ulink" href="http://tangentsoft.net/mysql++/doc/" target="_blank">Site do MySQL++</a>.</td> </tr><tr> <th></th> <td>MySQL envolto</td> <td>[[PH_HTML_CODE_<code>libmysqlclient</code>]</td> <td>Veja<a class="ulink" href="http://www.alhem.net/project/mysql/" target="_blank">MySQL envolto</a>.</td> </tr><tr> <th>Cacao</th> <td>MySQL-Cocoa</td> <td>[[PH_HTML_CODE_<code>libmysqlclient</code>]</td> <td>Compatível com o ambiente Cocoa do Objective-C. Veja<a class="ulink" href="http://mysql-cocoa.sourceforge.net/" target="_blank">http://mysql-cocoa.sourceforge.net/</a></td> </tr><tr> <th>D</th> <td>MySQL para D</td> <td>[[PH_HTML_CODE_<code>libmysqlclient</code>]</td> <td>Veja<a class="ulink" href="http://www.steinmole.de/d/" target="_blank">MySQL para D</a>.</td> </tr><tr> <th>Eiffel</th> <td>Eiffel MySQL</td> <td>[[PH_HTML_CODE_<code>libmysqlclient</code>]</td> <td>Veja<a class="xref" href="apis-eiffel.html" title="27.13 MySQL Eiffel Wrapper">Seção 27.13, “MySQL Eiffel Wrapper”</a>.</td> </tr><tr> <th>Erlang</th> <td>[[PH_HTML_CODE_<code>DBI</code>]</td> <td>[[PH_HTML_CODE_<code>DBD::mysql</code>]</td> <td>Veja<a class="ulink" href="http://code.google.com/p/erlang-mysql-driver/" target="_blank">[[<code>erlang-mysql-driver</code>]].</a></td> </tr><tr> <th>Haskell</th> <td>Ligações Haskell MySQL</td> <td>Driver nativo</td> <td>Veja<a class="ulink" href="http://www.serpentine.com/blog/software/mysql/" target="_blank">Ligações puras de Haskell para MySQL de Brian O'Sullivan</a>.</td> </tr><tr> <th></th> <td>[[<code>libmysqlclient</code><code>erlang-mysql-driver</code>]</td> <td>[[<code>libmysqlclient</code>]]</td> <td>Veja<a class="ulink" href="http://hackage.haskell.org/cgi-bin/hackage-scripts/package/hsql-mysql-1.7" target="_blank">Driver MySQL para Haskell</a>.</td> </tr><tr> <th>Java/JDBC</th> <td>Conector/J</td> <td>Driver nativo</td> <td>Veja<a class="ulink" href="/doc/connector-j/en/" target="_top">Guia do desenvolvedor do MySQL Connector/J</a>.</td> </tr><tr> <th>Kaya</th> <td>MyDB</td> <td>[[<code>libmysqlclient</code>]]</td> <td>Veja<a class="ulink" href="http://kayalang.org/library/latest/MyDB" target="_blank">MyDB</a>.</td> </tr><tr> <th>Lua</th> <td>LuaSQL</td> <td>[[<code>libmysqlclient</code>]]</td> <td>Veja<a class="ulink" href="http://keplerproject.github.io/luasql/doc/us/" target="_blank">LuaSQL</a>.</td> </tr><tr> <th>.NET/Mono</th> <td>Conector/NET</td> <td>Driver nativo</td> <td>Veja<a class="ulink" href="/doc/connector-net/en/" target="_top">Guia do desenvolvedor do MySQL Connector/NET</a>.</td> </tr><tr> <th>Objetivo Caml</th> <td>Ligações Objetivo Caml MySQL</td> <td>[[<code>libmysqlclient</code>]]</td> <td>Veja<a class="ulink" href="http://raevnos.pennmush.org/code/ocaml-mysql/" target="_blank">Ligações MySQL para Objective Caml</a>.</td> </tr><tr> <th>Octave</th> <td>Ligações de banco de dados para GNU Octave</td> <td>[[<code>libmysqlclient</code>]]</td> <td>Veja<a class="ulink" href="http://octave.sourceforge.net/database/index.html" target="_blank">Ligações de banco de dados para GNU Octave</a>.</td> </tr><tr> <th>ODBC</th> <td>Conector/ODBC</td> <td>[[<code>libmysqlclient</code>]]</td> <td>Veja<a class="ulink" href="/doc/connector-odbc/en/" target="_top">Guia do desenvolvedor do MySQL Connector/ODBC</a>.</td> </tr><tr> <th>Perl</th> <td>[[<code>DBI</code>]]/[[<code>DBD::mysql</code>]]</td> <td>[[<code>libmysqlclient</code><code>erlang-mysql-driver</code>]</td> <td>Veja<a class="xref" href="apis-perl.html" title="27.9 API MySQL Perl">Seção 27.9, “API MySQL Perl”</a>.</td> </tr><tr> <th></th> <td>[[<code>libmysqlclient</code><code>erlang-mysql-driver</code>]</td> <td>Driver nativo</td> <td>Veja<a class="ulink" href="http://search.cpan.org/dist/Net-MySQL/MySQL.pm" target="_blank">[[<code>libmysqlclient</code><code>libmysqlclient</code>]</a>na CPAN</td> </tr><tr> <th>PHP</th> <td>interface [[<code>libmysqlclient</code><code>libmysqlclient</code>], [[<code>libmysqlclient</code><code>libmysqlclient</code>] (desatualizada)</td> <td>[[<code>libmysqlclient</code><code>libmysqlclient</code>]</td> <td>Veja<a class="ulink" href="/doc/apis-php/en/" target="_top">MySQL e PHP</a>.</td> </tr><tr> <th></th> <td>interface [[<code>libmysqlclient</code><code>libmysqlclient</code>], [[<code>libmysqlclient</code><code>libmysqlclient</code>]</td> <td>[[<code>libmysqlclient</code><code>DBI</code>]</td> <td>Veja<a class="ulink" href="/doc/apis-php/en/" target="_top">MySQL e PHP</a>.</td> </tr><tr> <th></th> <td>[[<code>libmysqlclient</code><code>DBD::mysql</code>]</td> <td>[[<code>libmysqlclient</code><code>erlang-mysql-driver</code>]</td> <td>Veja<a class="ulink" href="/doc/apis-php/en/" target="_top">MySQL e PHP</a>.</td> </tr><tr> <th></th> <td>PDO mysqlnd</td> <td>Driver nativo</td> <td></td> </tr><tr> <th>Python</th> <td>Conector/Python</td> <td>Driver nativo</td> <td>Veja<a class="ulink" href="/doc/connector-python/en/" target="_top">Guia do desenvolvedor do MySQL Connector/Python</a>.</td> </tr><tr> <th>Python</th> <td>Extensão C para Python/Conector</td> <td>[[<code>libmysqlclient</code><code>erlang-mysql-driver</code>]</td> <td>Veja<a class="ulink" href="/doc/connector-python/en/" target="_top">Guia do desenvolvedor do MySQL Connector/Python</a>.</td> </tr><tr> <th></th> <td>MySQLdb</td> <td>[[<code>libmysqlclient</code><code>libmysqlclient</code>]</td> <td>Veja<a class="xref" href="apis-python.html" title="27.10 API Python do MySQL">Seção 27.10, “API Python MySQL”</a>.</td> </tr><tr> <th>Rubi</th> <td>mysql2</td> <td>[[<code>libmysqlclient</code><code>libmysqlclient</code>]</td> <td>Usa [[<code>libmysqlclient</code><code>libmysqlclient</code>]. Veja<a class="xref" href="apis-ruby.html" title="27.11 APIs Ruby do MySQL">Seção 27.11, “APIs Ruby do MySQL”</a>.</td> </tr><tr> <th>Sistema</th> <td>[[<code>libmysqlclient</code><code>libmysqlclient</code>]</td> <td>[[<code>libmysqlclient</code><code>libmysqlclient</code>]</td> <td>Veja<a class="ulink" href="https://github.com/aehrisch/myscsh" target="_blank">[[<code>libmysqlclient</code><code>libmysqlclient</code>]</a>.</td> </tr><tr> <th>SPL</th> <td>[[<code>libmysqlclient</code><code>DBI</code>]</td> <td>[[<code>libmysqlclient</code><code>DBD::mysql</code>]</td> <td>Veja<a class="ulink" href="http://www.clifford.at/spl/spldoc/sql_mysql.html" target="_blank">[[<code>libmysqlclient</code><code>erlang-mysql-driver</code>] para SPL</a>.</td> </tr><tr> <th>Tcl</th> <td>MySQLtcl</td> <td>[[<code>libmysqlclient</code><code>erlang-mysql-driver</code>]</td> <td>Veja<a class="xref" href="apis-tcl.html" title="27.12 API Tcl para MySQL">Seção 27.12, “API MySQL Tcl”</a>.</td> </tr></tbody></table>
