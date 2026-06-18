# Capítulo 31 Conectores e APIs

**Índice**

31.1 MySQL Connector/C++

31.2 MySQL Connector/J

31.3 MySQL Connector/NET

31.4 MySQL Connector/ODBC

31.5 MySQL Connector/Python

31.6 MySQL Connector/Node.js

31.7 API C para MySQL

31.8 MySQL PHP API

31.9 API MySQL Perl

31.10 API MySQL Python

31.11 APIs MySQL Ruby:   31.11.1 API MySQL/Ruby

```
31.11.2 The Ruby/MySQL API
```

31.12 API MySQL Tcl

31.13 MySQL Eiffel Wrapper

Os Conectores MySQL fornecem conectividade ao servidor MySQL para programas cliente. As APIs fornecem acesso de baixo nível aos recursos do MySQL usando o protocolo MySQL clássico ou o Protocolo X. Tanto os Conectores quanto as APIs permitem que você conecte e execute instruções MySQL a partir de outra linguagem ou ambiente, incluindo ODBC, Java (JDBC), C++, Python, Node.js, PHP, Perl, Ruby e C.

## Conectores MySQL

A Oracle desenvolve vários conectores:

- O Connector/C++ permite que as aplicações em C++ se conectem ao MySQL.

- O Connector/J oferece suporte ao driver para conectar-se ao MySQL a partir de aplicações Java usando a API padrão de Conectividade de Banco de Dados Java (JDBC).

- O Connector/NET permite que os desenvolvedores criem aplicativos .NET que se conectam ao MySQL. O Connector/NET implementa uma interface ADO.NET totalmente funcional e oferece suporte para uso com ferramentas que reconhecem o ADO.NET. Os aplicativos que utilizam o Connector/NET podem ser escritos em qualquer linguagem .NET suportada.

- O Connector/ODBC oferece suporte ao driver para conectar-se ao MySQL usando a API de Conectividade de Banco de Dados Aberta (ODBC). O suporte está disponível para a conectividade ODBC das plataformas Windows, Unix e macOS.

- O Connector/Python oferece suporte a drivers para conectar-se ao MySQL a partir de aplicativos Python usando uma API que é compatível com a versão 2.0 do Python DB API. Não são necessários módulos adicionais do Python ou bibliotecas de cliente do MySQL.

- O `Connector/Node.js` fornece uma API assíncrona para conectar-se ao MySQL a partir de aplicações Node.js usando o Protocolo X. O Connector/Node.js suporta a gestão de sessões e esquemas de banco de dados, o trabalho com coleções do MySQL Document Store e o uso de instruções SQL brutas.

## A API C do MySQL

Para o acesso direto ao uso do MySQL de forma nativa dentro de uma aplicação C, a API C fornece acesso de nível baixo ao protocolo cliente/servidor do MySQL através da biblioteca de clientes `libmysqlclient`. Este é o método primário utilizado para se conectar a uma instância do servidor MySQL e é usado tanto pelos clientes de linha de comando do MySQL quanto por muitos dos Conectores MySQL e APIs de terceiros detalhados aqui.

`libmysqlclient` está incluído nas distribuições do MySQL.

Veja também as Implementações da API C do MySQL.

Para acessar o MySQL a partir de uma aplicação em C ou para criar uma interface para o MySQL para uma linguagem que não seja suportada pelos Conectadores ou APIs neste capítulo, a API em C é o ponto de partida. Vários utilitários para programadores estão disponíveis para ajudar nesse processo; consulte a Seção 6.7, “Utilitários de Desenvolvimento de Programas”.

## APIs de terceiros para MySQL

As APIs restantes descritas neste capítulo fornecem uma interface para o MySQL a partir de linguagens de aplicação específicas. Essas soluções de terceiros não são desenvolvidas ou suportadas pela Oracle. Informações básicas sobre seu uso e capacidades são fornecidas aqui apenas para referência.

Todas as APIs de idiomas de terceiros são desenvolvidas usando um dos dois métodos, utilizando `libmysqlclient` ou implementando um driver nativo. As duas soluções oferecem benefícios diferentes:

- Usar `libmysqlclient` oferece compatibilidade total com o MySQL, pois utiliza as mesmas bibliotecas que as aplicações do cliente MySQL. No entanto, o conjunto de recursos é limitado à implementação e interfaces expostas através de `libmysqlclient` e o desempenho pode ser menor, pois os dados são copiados entre o código nativo e os componentes da API MySQL.

- *Os drivers nativos* são uma implementação do protocolo de rede MySQL inteiramente dentro da linguagem ou ambiente do host. Os drivers nativos são rápidos, pois há menos cópia de dados entre os componentes, e podem oferecer funcionalidades avançadas não disponíveis através da API padrão do MySQL. Os drivers nativos também são mais fáceis de construir e implantar para os usuários finais, pois não é necessário copiar as bibliotecas do cliente MySQL para construir os componentes do driver nativo.

A Tabela 31.1, “APIs e interfaces do MySQL”, lista muitas das bibliotecas e interfaces disponíveis para o MySQL.

**Tabela 31.1 APIs e interfaces do MySQL**

<table summary="Resumo das APIs e interfaces do MySQL, mostrando o ambiente, a API, o tipo e as notas relacionadas."><thead><tr> <th scope="col">Meio Ambiente</th> <th scope="col">API</th> <th scope="col">Tipo</th> <th scope="col">Notas</th> </tr></thead><tbody><tr> <th>Ada</th> <td>GNU Ada MySQL Bindings</td> <td>[[PH_HTML_CODE_<code>erlang-mysql-driver</code>]</td> <td>Veja Ligações de MySQL para GNU Ada</td> </tr><tr> <th>C</th> <td>C API</td> <td>[[PH_HTML_CODE_<code>erlang-mysql-driver</code>]</td> <td>Veja o Guia do Desenvolvedor da API C do MySQL 8.0.</td> </tr><tr> <th>C++</th> <td>Conector/C++</td> <td>[[PH_HTML_CODE_<code>libmysqlclient</code>]</td> <td>Veja o Guia do Desenvolvedor do MySQL Connector/C++ 9.5.</td> </tr><tr> <th></th> <td>MySQL++</td> <td>[[PH_HTML_CODE_<code>libmysqlclient</code>]</td> <td>Consulte o site do MySQL++.</td> </tr><tr> <th></th> <td>MySQL envolto</td> <td>[[PH_HTML_CODE_<code>libmysqlclient</code>]</td> <td>Veja MySQL envolto.</td> </tr><tr> <th>Cacao</th> <td>MySQL-Cocoa</td> <td>[[PH_HTML_CODE_<code>libmysqlclient</code>]</td> <td>Compatível com o ambiente Cocoa do Objective-C. Veja http://mysql-cocoa.sourceforge.net/</td> </tr><tr> <th>D</th> <td>MySQL para D</td> <td>[[PH_HTML_CODE_<code>libmysqlclient</code>]</td> <td>Veja MySQL para D.</td> </tr><tr> <th>Eiffel</th> <td>Eiffel MySQL</td> <td>[[PH_HTML_CODE_<code>libmysqlclient</code>]</td> <td>Veja a Seção 31.13, “MySQL Eiffel Wrapper”.</td> </tr><tr> <th>Erlang</th> <td>[[PH_HTML_CODE_<code>DBI</code>]</td> <td>[[PH_HTML_CODE_<code>DBD::mysql</code>]</td> <td>Veja [[<code>erlang-mysql-driver</code>]].</td> </tr><tr> <th>Haskell</th> <td>Ligações Haskell MySQL</td> <td>Driver nativo</td> <td>Veja os bindings puros do Haskell para MySQL de Brian O'Sullivan.</td> </tr><tr> <th></th> <td>[[<code>libmysqlclient</code><code>erlang-mysql-driver</code>]</td> <td>[[<code>libmysqlclient</code>]]</td> <td>Veja o driver MySQL para Haskell.</td> </tr><tr> <th>Java/JDBC</th> <td>Conector/J</td> <td>Driver nativo</td> <td>Veja o Guia do Desenvolvedor do MySQL Connector/J.</td> </tr><tr> <th>Kaya</th> <td>MyDB</td> <td>[[<code>libmysqlclient</code>]]</td> <td>Veja o MyDB.</td> </tr><tr> <th>Lua</th> <td>LuaSQL</td> <td>[[<code>libmysqlclient</code>]]</td> <td>Veja LuaSQL.</td> </tr><tr> <th>.NET/Mono</th> <td>Conector/NET</td> <td>Driver nativo</td> <td>Veja o Guia do Desenvolvedor do MySQL Connector/NET.</td> </tr><tr> <th>Objetivo Caml</th> <td>Ligações Objetivo Caml MySQL</td> <td>[[<code>libmysqlclient</code>]]</td> <td>Veja Bindungen MySQL para Objective Caml.</td> </tr><tr> <th>Octave</th> <td>Ligações de banco de dados para GNU Octave</td> <td>[[<code>libmysqlclient</code>]]</td> <td>Consulte Ligações de banco de dados para o GNU Octave.</td> </tr><tr> <th>ODBC</th> <td>Conector/ODBC</td> <td>[[<code>libmysqlclient</code>]]</td> <td>Veja o Guia do Desenvolvedor do Conectivo MySQL/ODBC.</td> </tr><tr> <th>Perl</th> <td>[[<code>DBI</code>]]/[[<code>DBD::mysql</code>]]</td> <td>[[<code>libmysqlclient</code><code>erlang-mysql-driver</code>]</td> <td>Veja a Seção 31.9, “API MySQL Perl”.</td> </tr><tr> <th></th> <td>[[<code>libmysqlclient</code><code>erlang-mysql-driver</code>]</td> <td>Driver nativo</td> <td>Veja [[<code>libmysqlclient</code><code>libmysqlclient</code>] no CPAN</td> </tr><tr> <th>PHP</th> <td>interface [[<code>libmysqlclient</code><code>libmysqlclient</code>], [[<code>libmysqlclient</code><code>libmysqlclient</code>] (desatualizada)</td> <td>[[<code>libmysqlclient</code><code>libmysqlclient</code>]</td> <td>Veja MySQL e PHP.</td> </tr><tr> <th></th> <td>interface [[<code>libmysqlclient</code><code>libmysqlclient</code>], [[<code>libmysqlclient</code><code>libmysqlclient</code>]</td> <td>[[<code>libmysqlclient</code><code>DBI</code>]</td> <td>Veja MySQL e PHP.</td> </tr><tr> <th></th> <td>[[<code>libmysqlclient</code><code>DBD::mysql</code>]</td> <td>[[<code>libmysqlclient</code><code>erlang-mysql-driver</code>]</td> <td>Veja MySQL e PHP.</td> </tr><tr> <th></th> <td>PDO mysqlnd</td> <td>Driver nativo</td> <td></td> </tr><tr> <th>Python</th> <td>Conector/Python</td> <td>Driver nativo</td> <td>Veja o Guia do Desenvolvedor do Conector MySQL/Python.</td> </tr><tr> <th>Python</th> <td>Extensão C para Python/Conector</td> <td>[[<code>libmysqlclient</code><code>erlang-mysql-driver</code>]</td> <td>Veja o Guia do Desenvolvedor do Conector MySQL/Python.</td> </tr><tr> <th></th> <td>MySQLdb</td> <td>[[<code>libmysqlclient</code><code>libmysqlclient</code>]</td> <td>Veja a Seção 31.10, “API Python do MySQL”.</td> </tr><tr> <th>Rubi</th> <td>mysql2</td> <td>[[<code>libmysqlclient</code><code>libmysqlclient</code>]</td> <td>Usa [[<code>libmysqlclient</code><code>libmysqlclient</code>]. Veja a Seção 31.11, “APIs Ruby do MySQL”.</td> </tr><tr> <th>Sistema</th> <td>[[<code>libmysqlclient</code><code>libmysqlclient</code>]</td> <td>[[<code>libmysqlclient</code><code>libmysqlclient</code>]</td> <td>Veja [[<code>libmysqlclient</code><code>libmysqlclient</code>].</td> </tr><tr> <th>SPL</th> <td>[[<code>libmysqlclient</code><code>DBI</code>]</td> <td>[[<code>libmysqlclient</code><code>DBD::mysql</code>]</td> <td>Consulte [[<code>libmysqlclient</code><code>erlang-mysql-driver</code>] para SPL.</td> </tr><tr> <th>Tcl</th> <td>MySQLtcl</td> <td>[[<code>libmysqlclient</code><code>erlang-mysql-driver</code>]</td> <td>Veja a Seção 31.12, “API MySQL Tcl”.</td> </tr></tbody></table>
