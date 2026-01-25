# Capítulo 27 Conectores e APIs

**Índice**

[27.1 MySQL Connector/C++](connector-cpp-info.html)

[27.2 MySQL Connector/J](connector-j-info.html)

[27.3 MySQL Connector/NET](connector-net-info.html)

[27.4 MySQL Connector/ODBC](connector-odbc-info.html)

[27.5 MySQL Connector/Python](connector-python-info.html)

[27.6 libmysqld, a Biblioteca do Servidor MySQL Embarcado](libmysqld.html) :   [27.6.1 Compilando Programas com libmysqld](libmysqld-compiling.html)

    [27.6.2 Restrições ao Usar o Servidor MySQL Embarcado](libmysqld-restrictions.html)

    [27.6.3 Opções com o Servidor Embarcado](libmysqld-options.html)

    [27.6.4 Exemplos de Servidor Embarcado](libmysqld-example.html)

[27.7 MySQL C API](c-api-info.html)

[27.8 MySQL PHP API](apis-php-info.html)

[27.9 MySQL Perl API](apis-perl.html)

[27.10 MySQL Python API](apis-python.html)

[27.11 MySQL Ruby APIs](apis-ruby.html) :   [27.11.1 The MySQL/Ruby API](apis-ruby-mysqlruby.html)

    [27.11.2 The Ruby/MySQL API](apis-ruby-rubymysql.html)

[27.12 MySQL Tcl API](apis-tcl.html)

[27.13 MySQL Eiffel Wrapper](apis-eiffel.html)

Os MySQL Connectors fornecem conectividade ao servidor MySQL para programas clientes. As APIs fornecem acesso de baixo nível aos recursos do MySQL usando o protocolo clássico MySQL ou o X Protocol. Tanto os Connectors quanto as APIs permitem que você se conecte e execute comandos MySQL a partir de outra linguagem ou ambiente, incluindo ODBC, Java (JDBC), C++, Python, PHP, Perl, Ruby, e instâncias C nativas e MySQL embarcado.

## MySQL Connectors

A Oracle desenvolve diversos connectors:

* [Connector/C++](/doc/connector-cpp/9.4/en/) permite que aplicações C++ se conectem ao MySQL.

* [Connector/J](/doc/connector-j/en/) fornece suporte a driver para conexão ao MySQL a partir de aplicações Java usando o padrão Java Database Connectivity (JDBC) API.

* [Connector/NET](/doc/connector-net/en/) permite que desenvolvedores criem aplicações .NET que se conectam ao MySQL. O Connector/NET implementa uma interface ADO.NET totalmente funcional e fornece suporte para uso com ferramentas compatíveis com ADO.NET. Aplicações que usam o Connector/NET podem ser escritas em qualquer linguagem .NET suportada.

* [Connector/ODBC](/doc/connector-odbc/en/) fornece suporte a driver para conexão ao MySQL usando o Open Database Connectivity (ODBC) API. O suporte está disponível para conectividade ODBC a partir de plataformas Windows, Unix e macOS.

* [Connector/Python](/doc/connector-python/en/) fornece suporte a driver para conexão ao MySQL a partir de aplicações Python usando uma API que está em conformidade com o [Python DB API versão 2.0](http://www.python.org/dev/peps/pep-0249/). Nenhum módulo Python adicional ou bibliotecas cliente MySQL são necessários.

## A MySQL C API

Para acesso direto ao uso nativo do MySQL dentro de uma aplicação C, existem dois métodos:

* O [C API](/doc/c-api/5.7/en/) fornece acesso de baixo nível ao protocolo cliente/servidor MySQL através da biblioteca cliente `libmysqlclient`. Este é o método primário usado para conectar-se a uma instância do servidor MySQL, e é usado tanto pelos clientes de linha de comando MySQL quanto por muitos dos MySQL Connectors e APIs de terceiros detalhados aqui.

  A `libmysqlclient` está incluída nas distribuições MySQL.

* A `libmysqld` é uma biblioteca do servidor MySQL embarcado que permite incorporar uma instância do servidor MySQL em suas aplicações C.

  A `libmysqld` está incluída nas distribuições MySQL.

  Nota

  A biblioteca de servidor embarcado `libmysqld` está obsoleta (deprecated) a partir do MySQL 5.7.19 e foi removida no MySQL 8.0.

Consulte também [MySQL C API Implementations](/doc/c-api/5.7/en/c-api-implementations.html).

Para acessar o MySQL a partir de uma aplicação C, ou para construir uma interface para MySQL para uma linguagem não suportada pelos Connectors ou APIs neste capítulo, o [C API](/doc/c-api/5.7/en/) é o ponto de partida. Vários utilitários de programador estão disponíveis para auxiliar no processo; consulte [Seção 4.7, “Utilitários de Desenvolvimento de Programa”](programs-development.html "4.7 Utilitários de Desenvolvimento de Programa").

## APIs MySQL de Terceiros

As APIs restantes descritas neste capítulo fornecem uma interface para o MySQL a partir de linguagens de aplicação específicas. Estas soluções de terceiros não são desenvolvidas ou suportadas pela Oracle. Informações básicas sobre seu uso e capacidades são fornecidas aqui apenas para fins de referência.

Todas as APIs de linguagem de terceiros são desenvolvidas usando um de dois métodos: usando `libmysqlclient` ou implementando um driver nativo. As duas soluções oferecem benefícios diferentes:

* O uso de *`libmysqlclient`* oferece compatibilidade completa com o MySQL porque ele utiliza as mesmas bibliotecas que as aplicações cliente MySQL. No entanto, o conjunto de recursos é limitado à implementação e às interfaces expostas através do `libmysqlclient` e o desempenho pode ser menor, pois os dados são copiados entre a linguagem nativa e os componentes da MySQL API.

* Os *drivers nativos* são uma implementação do protocolo de rede MySQL inteiramente dentro da linguagem ou ambiente host. Os drivers nativos são rápidos, pois há menos cópia de dados entre os componentes, e eles podem oferecer funcionalidades avançadas não disponíveis através da MySQL API padrão. Os drivers nativos também são mais fáceis para os usuários finais compilarem e implantarem, pois nenhuma cópia das bibliotecas cliente MySQL é necessária para construir os componentes do driver nativo.

[Tabela 27.1, “APIs e Interfaces MySQL”](connectors-apis.html#connectors-apis-summary "Tabela 27.1 APIs e Interfaces MySQL") lista muitas das bibliotecas e interfaces disponíveis para MySQL.

**Tabela 27.1 APIs e Interfaces MySQL**

<table summary="Resumo das APIs e interfaces MySQL mostrando o ambiente, a API, o tipo e as notas relacionadas."><col style="width: 10%"/><col style="width: 35%"/><col style="width: 15%"/><col style="width: 40%"/><thead><tr> <th>Ambiente</th> <th>API</th> <th>Tipo</th> <th>Notas</th> </tr></thead><tbody><tr> <th>Ada</th> <td>GNU Ada MySQL Bindings</td> <td><code>libmysqlclient</code></td> <td>Consulte MySQL Bindings for GNU Ada</td> </tr><tr> <th>C</th> <td>C API</td> <td><code>libmysqlclient</code></td> <td>Consulte o Guia do Desenvolvedor do MySQL 5.7 C API.</td> </tr><tr> <th>C++</th> <td>Connector/C++</td> <td><code>libmysqlclient</code></td> <td>Consulte o Guia do Desenvolvedor do MySQL Connector/C++ 9.5.</td> </tr><tr> <th></th> <td>MySQL++</td> <td><code>libmysqlclient</code></td> <td>Consulte o website MySQL++.</td> </tr><tr> <th></th> <td>MySQL wrapped</td> <td><code>libmysqlclient</code></td> <td>Consulte MySQL wrapped.</td> </tr><tr> <th>Cocoa</th> <td>MySQL-Cocoa</td> <td><code>libmysqlclient</code></td> <td>Compatível com o ambiente Objective-C Cocoa. Consulte http://mysql-cocoa.sourceforge.net/</td> </tr><tr> <th>D</th> <td>MySQL for D</td> <td><code>libmysqlclient</code></td> <td>Consulte MySQL for D.</td> </tr><tr> <th>Eiffel</th> <td>Eiffel MySQL</td> <td><code>libmysqlclient</code></td> <td>Consulte a Seção 27.13, “Wrapper Eiffel MySQL”.</td> </tr><tr> <th>Erlang</th> <td><code>erlang-mysql-driver</code></td> <td><code>libmysqlclient</code></td> <td>Consulte <code>erlang-mysql-driver</code>.</td> </tr><tr> <th>Haskell</th> <td>Haskell MySQL Bindings</td> <td>Native Driver</td> <td>Consulte as pure Haskell MySQL bindings de Brian O'Sullivan.</td> </tr><tr> <th></th> <td><code>hsql-mysql</code></td> <td><code>libmysqlclient</code></td> <td>Consulte MySQL driver for Haskell.</td> </tr><tr> <th>Java/JDBC</th> <td>Connector/J</td> <td>Native Driver</td> <td>Consulte o Guia do Desenvolvedor do MySQL Connector/J.</td> </tr><tr> <th>Kaya</th> <td>MyDB</td> <td><code>libmysqlclient</code></td> <td>Consulte MyDB.</td> </tr><tr> <th>Lua</th> <td>LuaSQL</td> <td><code>libmysqlclient</code></td> <td>Consulte LuaSQL.</td> </tr><tr> <th>.NET/Mono</th> <td>Connector/NET</td> <td>Native Driver</td> <td>Consulte o Guia do Desenvolvedor do MySQL Connector/NET.</td> </tr><tr> <th>Objective Caml</th> <td>OBjective Caml MySQL Bindings</td> <td><code>libmysqlclient</code></td> <td>Consulte MySQL Bindings for Objective Caml.</td> </tr><tr> <th>Octave</th> <td>Database bindings for GNU Octave</td> <td><code>libmysqlclient</code></td> <td>Consulte Database bindings for GNU Octave.</td> </tr><tr> <th>ODBC</th> <td>Connector/ODBC</td> <td><code>libmysqlclient</code></td> <td>Consulte o Guia do Desenvolvedor do MySQL Connector/ODBC.</td> </tr><tr> <th>Perl</th> <td><code>DBI</code>/<code>DBD::mysql</code></td> <td><code>libmysqlclient</code></td> <td>Consulte a Seção 27.9, “MySQL Perl API”.</td> </tr><tr> <th></th> <td><code>Net::MySQL</code></td> <td>Native Driver</td> <td>Consulte <code>Net::MySQL</code> no CPAN</td> </tr><tr> <th>PHP</th> <td><code>mysql</code>, interface <code>ext/mysql</code> (obsoleta)</td> <td><code>libmysqlclient</code></td> <td>Consulte MySQL e PHP.</td> </tr><tr> <th></th> <td><code>mysqli</code>, interface <code>ext/mysqli</code></td> <td><code>libmysqlclient</code></td> <td>Consulte MySQL e PHP.</td> </tr><tr> <th></th> <td><code>PDO_MYSQL</code></td> <td><code>libmysqlclient</code></td> <td>Consulte MySQL e PHP.</td> </tr><tr> <th></th> <td>PDO mysqlnd</td> <td>Native Driver</td> <td></td> </tr><tr> <th>Python</th> <td>Connector/Python</td> <td>Native Driver</td> <td>Consulte o Guia do Desenvolvedor do MySQL Connector/Python.</td> </tr><tr> <th>Python</th> <td>Connector/Python C Extension</td> <td><code>libmysqlclient</code></td> <td>Consulte o Guia do Desenvolvedor do MySQL Connector/Python.</td> </tr><tr> <th></th> <td>MySQLdb</td> <td><code>libmysqlclient</code></td> <td>Consulte a Seção 27.10, “MySQL Python API”.</td> </tr><tr> <th>Ruby</th> <td>mysql2</td> <td><code>libmysqlclient</code></td> <td>Usa <code>libmysqlclient</code>. Consulte a Seção 27.11, “MySQL Ruby APIs”.</td> </tr><tr> <th>Scheme</th> <td><code>Myscsh</code></td> <td><code>libmysqlclient</code></td> <td>Consulte <code>Myscsh</code>.</td> </tr><tr> <th>SPL</th> <td><code>sql_mysql</code></td> <td><code>libmysqlclient</code></td> <td>Consulte <code>sql_mysql</code> para SPL.</td> </tr><tr> <th>Tcl</th> <td>MySQLtcl</td> <td><code>libmysqlclient</code></td> <td>Consulte a Seção 27.12, “MySQL Tcl API”.</td> </tr></tbody></table>