# Capítulo 27 Conectores e APIs

Os Conectivos MySQL fornecem conectividade ao servidor MySQL para programas de cliente. As APIs fornecem acesso de nível baixo aos recursos do MySQL usando o protocolo MySQL clássico ou o Protocolo X. Tanto os Conectivos quanto as APIs permitem que você conecte e execute instruções MySQL de outro idioma ou ambiente, incluindo ODBC, Java (JDBC), C++, Python, PHP, Perl, Ruby e instâncias nativas de C e MySQL embutidas.

## Conectores MySQL

A Oracle desenvolve vários conectores:

* O Connector/C++ permite que as aplicações em C++ se conectem ao MySQL.

* O Connector/J oferece suporte ao driver para conectar-se ao MySQL a partir de aplicações Java usando a API padrão de Conectividade de Banco de Dados Java (JDBC).

* O Connector/NET permite que os desenvolvedores criem aplicativos .NET que se conectam ao MySQL. O Connector/NET implementa uma interface ADO.NET totalmente funcional e oferece suporte para uso com ferramentas que conhecem ADO.NET. Aplicações que utilizam o Connector/NET podem ser escritas em qualquer idioma .NET compatível.

* O Connector/ODBC oferece suporte ao driver para conexão com o MySQL usando a API de Conectividade de Banco de Dados Aberto (ODBC). O suporte está disponível para conectividade ODBC em plataformas Windows, Unix e macOS.

* O Connector/Python oferece suporte ao driver para conectar-se ao MySQL a partir de aplicativos Python usando uma API que é compatível com a versão 2.0 do Python DB API. Não são necessários módulos adicionais de Python ou bibliotecas de cliente MySQL.

## A API C do MySQL

Para acesso direto ao uso do MySQL de forma nativa dentro de uma aplicação em C, existem dois métodos:

* A API C oferece acesso de nível baixo ao protocolo cliente/servidor do MySQL através da biblioteca de clientes `libmysqlclient`. Este é o método primário utilizado para se conectar a uma instância do servidor MySQL, e é utilizado tanto pelos clientes de string de comando do MySQL quanto por muitos dos Conectadores MySQL e APIs de terceiros detalhados aqui.

`libmysqlclient` está incluído nas distribuições do MySQL.

* `libmysqld` é uma biblioteca de servidor MySQL embutida que permite embutir uma instância do servidor MySQL em seus aplicativos em C.

`libmysqld` está incluído nas distribuições do MySQL.

Nota

A biblioteca de servidor embutida `libmysqld` é descontinuada a partir do MySQL 5.7.19 e é removida no MySQL 8.0.

Veja também as Implementações da API C do MySQL.

Para acessar o MySQL a partir de uma aplicação em C, ou para construir uma interface para o MySQL para uma linguagem que não é suportada pelos Conectivos ou APIs neste capítulo, a API em C é o ponto de partida. Vários utilitários de programação estão disponíveis para ajudar no processo; veja a Seção 4.7, “Utilitários de Desenvolvimento de Programa”.

## APIs de terceiros para MySQL

As APIs restantes descritas neste capítulo fornecem uma interface para MySQL a partir de linguagens de aplicativos específicas. Essas soluções de terceiros não são desenvolvidas ou suportadas pela Oracle. Informações básicas sobre seu uso e habilidades são fornecidas aqui apenas para referência.

Todas as APIs de linguagem de terceiros são desenvolvidas usando um dos dois métodos, utilizando `libmysqlclient` ou implementando um driver nativo. As duas soluções oferecem benefícios diferentes:

* O uso de *`libmysqlclient`* oferece compatibilidade completa com o MySQL, pois utiliza as mesmas bibliotecas que as aplicações do cliente MySQL. No entanto, o conjunto de recursos é limitado à implementação e interfaces expostas através de `libmysqlclient` e o desempenho pode ser menor, pois os dados são copiados entre o idioma nativo e os componentes da API MySQL.

* *Os drivers nativos* são uma implementação do protocolo de rede MySQL totalmente dentro da linguagem ou ambiente do host. Os drivers nativos são rápidos, pois há menos cópia de dados entre os componentes, e podem oferecer funcionalidades avançadas que não estão disponíveis através da API padrão do MySQL. Os drivers nativos também são mais fáceis para os usuários finais de construir e implantar, pois não é necessária uma cópia das bibliotecas do cliente MySQL para construir os componentes do driver nativo.

A Tabela 27.1, “APIs e interfaces do MySQL”, lista muitas das bibliotecas e interfaces disponíveis para o MySQL.

**Tabela 27.1 APIs e interfaces do MySQL**

<table summary="Summary of MySQL APIs and interfaces showing the environment, API, type, and related notes."><col style="width: 10%"/><col style="width: 35%"/><col style="width: 15%"/><col style="width: 40%"/><thead><tr> <th>Environment</th> <th>API</th> <th>Type</th> <th>Notes</th> </tr></thead><tbody><tr> <th>Ada</th> <td>GNU Ada MySQL Bindings</td> <td><code>libmysqlclient</code></td> <td>Veja<a class="ulink" href="http://gnade.sourceforge.net/" target="_blank">Ligações MySQL para GNU Ada</a></td> </tr><tr> <th>C</th> <td>C API</td> <td><code>libmysqlclient</code></td> <td>Veja o Guia do Desenvolvedor da API C do MySQL 5.7.</td> </tr><tr> <th>C++</th> <td>Connector/C++</td> <td><code>libmysqlclient</code></td> <td>See MySQL Connector/C++ 9.5 Developer Guide.</td> </tr><tr> <th></th> <td>MySQL++</td> <td><code>libmysqlclient</code></td> <td>See <a class="ulink" href="http://tangentsoft.net/mysql++/doc/" target="_blank">MySQL++ website</a>.</td> </tr><tr> <th></th> <td>MySQL wrapped</td> <td><code>libmysqlclient</code></td> <td>See <a class="ulink" href="http://www.alhem.net/project/mysql/" target="_blank">MySQL wrapped</a>.</td> </tr><tr> <th>Cocoa</th> <td>MySQL-Cocoa</td> <td><code>libmysqlclient</code></td> <td>Compatible with the Objective-C Cocoa environment. See http://mysql-cocoa.sourceforge.net/</td> </tr><tr> <th>D</th> <td>MySQL for D</td> <td><code>libmysqlclient</code></td> <td>See MySQL for D.</td> </tr><tr> <th>Eiffel</th> <td>Eiffel MySQL</td> <td><code>libmysqlclient</code></td> <td>Veja a Seção 27.13, “MySQL Eiffel Wrapper”.</td> </tr><tr> <th>Erlang</th> <td><code>erlang-mysql-driver</code></td> <td><code>libmysqlclient</code></td> <td>See <code>erlang-mysql-driver</code>.</td> </tr><tr> <th>Haskell</th> <td>Ligações Haskell MySQL</td> <td>Driver nativo</td> <td>Veja<a class="ulink" href="http://www.serpentine.com/blog/software/mysql/" target="_blank">Ligações puras de Haskell para MySQL de Brian O'Sullivan</a>.</td> </tr><tr> <th></th> <td><code>hsql-mysql</code></td> <td><code>libmysqlclient</code></td> <td>Veja<a class="ulink" href="http://hackage.haskell.org/cgi-bin/hackage-scripts/package/hsql-mysql-1.7" target="_blank">Driver MySQL para Haskell</a>.</td> </tr><tr> <th>Java/JDBC</th> <td>Connector/J</td> <td>Native Driver</td> <td>See MySQL Connector/J Developer Guide.</td> </tr><tr> <th>Kaya</th> <td>MyDB</td> <td><code>libmysqlclient</code></td> <td>See MyDB.</td> </tr><tr> <th>Lua</th> <td>LuaSQL</td> <td><code>libmysqlclient</code></td> <td>See LuaSQL.</td> </tr><tr> <th>.NET/Mono</th> <td>Connector/NET</td> <td>Native Driver</td> <td>See MySQL Connector/NET Developer Guide.</td> </tr><tr> <th>Objetivo Caml</th> <td>Objetiva Binários de ligação Caml MySQL</td> <td><code>libmysqlclient</code></td> <td>Veja<a class="ulink" href="http://raevnos.pennmush.org/code/ocaml-mysql/" target="_blank">Ligações MySQL para Objective Caml</a>.</td> </tr><tr> <th>Octave</th> <td>Ligações de banco de dados para GNU Octave</td> <td><code>libmysqlclient</code></td> <td>Veja<a class="ulink" href="http://octave.sourceforge.net/database/index.html" target="_blank">Ligações de banco de dados para GNU Octave</a>.</td> </tr><tr> <th>ODBC</th> <td>Connector/ODBC</td> <td><code>libmysqlclient</code></td> <td>See MySQL Connector/ODBC Developer Guide.</td> </tr><tr> <th>Perl</th> <td><code>DBI</code>/<code>DBD::mysql</code></td> <td><code>libmysqlclient</code></td> <td>See Section 27.9, “MySQL Perl API”.</td> </tr><tr> <th></th> <td><code>Net::MySQL</code></td> <td>Native Driver</td> <td>See <code>Net::MySQL</code> at CPAN</td> </tr><tr> <th>PHP</th> <td><code>mysql</code>, <code>ext/mysql</code> interface (deprecated)</td> <td><code>libmysqlclient</code></td> <td>See MySQL and PHP.</td> </tr><tr> <th></th> <td><code>mysqli</code>,<code>ext/mysqli</code>interface</td> <td><code>libmysqlclient</code></td> <td>Veja MySQL e PHP.</td> </tr><tr> <th></th> <td><code>PDO_MYSQL</code></td> <td><code>libmysqlclient</code></td> <td>See MySQL and PHP.</td> </tr><tr> <th></th> <td>PDO mysqlnd</td> <td>Native Driver</td> <td></td> </tr><tr> <th>Python</th> <td>Connector/Python</td> <td>Native Driver</td> <td>See MySQL Connector/Python Developer Guide.</td> </tr><tr> <th>Python</th> <td>Connector/Python C Extension</td> <td><code>libmysqlclient</code></td> <td>See MySQL Connector/Python Developer Guide.</td> </tr><tr> <th></th> <td>MySQLdb</td> <td><code>libmysqlclient</code></td> <td>Veja a Seção 27.10, “MySQL Python API”.</td> </tr><tr> <th>Ruby</th> <td>mysql2</td> <td><code>libmysqlclient</code></td> <td>Uses <code>libmysqlclient</code>. See Section 27.11, “MySQL Ruby APIs”.</td> </tr><tr> <th>Scheme</th> <td><code>Myscsh</code></td> <td><code>libmysqlclient</code></td> <td>See <code>Myscsh</code>.</td> </tr><tr> <th>SPL</th> <td><code>sql_mysql</code></td> <td><code>libmysqlclient</code></td> <td>See <a class="ulink" href="http://www.clifford.at/spl/spldoc/sql_mysql.html" target="_blank"><code>sql_mysql</code> for SPL</a>.</td> </tr><tr> <th>Tcl</th> <td>MySQLtcl</td> <td><code>libmysqlclient</code></td> <td>See Section 27.12, “MySQL Tcl API”.</td> </tr></tbody></table>