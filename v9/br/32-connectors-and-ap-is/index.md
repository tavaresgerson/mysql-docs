# Capítulo 31 Conectores e APIs

**Índice**

31.1 Conector/C++ MySQL

31.2 Conector/J MySQL

31.3 Conector/NET MySQL

31.4 Conector/ODBC MySQL

31.5 Conector/Python MySQL

31.6 Conector/Node.js MySQL

31.7 API C MySQL

31.8 API PHP MySQL

31.9 API Perl MySQL

31.10 API Python MySQL

31.11 APIs Ruby MySQL:   31.11.1 A API MySQL/Ruby

    31.11.2 A API Ruby/MySQL

31.12 API Tcl MySQL

31.13 Wrapper Eiffel MySQL

Os Conectores MySQL fornecem conectividade ao servidor MySQL para programas cliente. As APIs fornecem acesso de nível baixo aos recursos MySQL usando o protocolo MySQL clássico ou o Protocolo X. Tanto os Conectores quanto as APIs permitem que você conecte e execute instruções MySQL a partir de outra linguagem ou ambiente, incluindo ODBC, Java (JDBC), C++, Python, Node.js, PHP, Perl, Ruby e C.

## Conectores MySQL

A Oracle desenvolve vários conectores:

* O Conector/C++ permite que aplicativos em C++ se conectem ao MySQL.

* O Conector/J fornece suporte para o driver de conexão ao MySQL a partir de aplicativos Java usando a API padrão de Conectividade de Banco de Dados Java (JDBC).

* O Conector/NET permite que os desenvolvedores criem aplicativos .NET que se conectam ao MySQL. O Conector/NET implementa uma interface ADO.NET totalmente funcional e fornece suporte para uso com ferramentas conscientes de ADO.NET. Aplicações que usam o Conector/NET podem ser escritas em qualquer linguagem .NET suportada.

* O Conector/ODBC fornece suporte para o driver de conexão ao MySQL usando a API Open Database Connectivity (ODBC). O suporte está disponível para a conectividade ODBC de plataformas Windows, Unix e macOS.

* O Conector/Python fornece suporte para o driver de conexão ao MySQL a partir de aplicativos Python usando uma API que é compatível com a versão 2.0 do DB API Python. Não são necessários módulos adicionais de Python ou bibliotecas de cliente MySQL.

* `Connector/Node.js` oferece uma API assíncrona para conectar-se ao MySQL a partir de aplicações Node.js usando o Protocolo X. O Connector/Node.js suporta a gestão de sessões e esquemas de banco de dados, o trabalho com coleções do MySQL Document Store e o uso de instruções SQL brutas.

## A API C do MySQL

Para o acesso direto ao uso do MySQL de forma nativa dentro de uma aplicação C, a API C fornece acesso de nível baixo ao protocolo cliente/servidor do MySQL através da biblioteca de clientes `libmysqlclient`. Este é o método primário utilizado para se conectar a uma instância do servidor MySQL e é usado tanto pelos clientes de linha de comando do MySQL quanto por muitos dos Conectores MySQL e APIs de terceiros detalhados neste capítulo.

`libmysqlclient` está incluído nas distribuições do MySQL.

Veja também as Implementações da API C do MySQL.

Para acessar o MySQL a partir de uma aplicação C ou para construir uma interface para o MySQL para uma linguagem que não é suportada pelos Conectores ou APIs neste capítulo, a API C é o ponto de partida. Vários utilitários de programadores estão disponíveis para ajudar com o processo; veja a Seção 6.7, “Utilitários de Desenvolvimento de Programas”.

## APIs de Terceiros do MySQL

As APIs restantes descritas neste capítulo fornecem uma interface para o MySQL a partir de linguagens de aplicação específicas. Essas soluções de terceiros não são desenvolvidas ou suportadas pela Oracle. Informações básicas sobre seu uso e habilidades são fornecidas aqui apenas para referência.

Todas as APIs de linguagem de terceiros são desenvolvidas usando um dos dois métodos, usando `libmysqlclient` ou implementando um driver nativo. As duas soluções oferecem diferentes benefícios:

* O uso de *`libmysqlclient`* oferece compatibilidade completa com o MySQL, pois utiliza as mesmas bibliotecas que as aplicações do cliente MySQL. No entanto, o conjunto de recursos é limitado à implementação e interfaces expostas através do `libmysqlclient`, e o desempenho pode ser menor, pois os dados são copiados entre o idioma nativo e os componentes da API MySQL.

* Os *drivers nativos* são uma implementação do protocolo de rede MySQL inteiramente dentro da linguagem ou ambiente do host. Os drivers nativos são rápidos, pois há menos cópia de dados entre os componentes, e podem oferecer funcionalidades avançadas não disponíveis através da API MySQL padrão. Os drivers nativos também são mais fáceis de construir e implantar para os usuários finais, pois não é necessária uma cópia das bibliotecas do cliente MySQL para construir os componentes do driver nativo.

A Tabela 31.1, “APIs e Interfaces MySQL”, lista muitas das bibliotecas e interfaces disponíveis para o MySQL.

**Tabela 31.1 APIs e Interfaces MySQL**

<table summary="Resumo das APIs e interfaces do MySQL que mostram o ambiente, a API, o tipo e as notas relacionadas.">
<tr>
<th>Ambiente</th>
<th>API</th>
<th>Tipo</th>
<th>Notas</th>
</tr>
<tr>
<th>Ada</th>
<td>GNU Ada MySQL Bindings</td>
<td><code>libmysqlclient</code></td>
<td>Veja MySQL Bindings for GNU Ada</td>
</tr>
<tr>
<th>C</th>
<td>C API</td>
<td><code>libmysqlclient</code></td>
<td>Veja MySQL 9.5 C API Developer Guide.</td>
</tr>
<tr>
<th>C++</th>
<td>Connector/C++</td>
<td><code>libmysqlclient</code></td>
<td>Veja MySQL Connector/C++ 9.5 Developer Guide.</td>
</tr>
<tr>
<th></th>
<td>MySQL++</td>
<td><code>libmysqlclient</code></td>
<td>Veja MySQL++ website.</td>
</tr>
<tr>
<th></th>
<td>MySQL wrapped</td>
<td><code>libmysqlclient</code></td>
<td>Veja MySQL wrapped.</td>
</tr>
<tr>
<th>Cocoa</th>
<td>MySQL-Cocoa</td>
<td><code>libmysqlclient</code></td>
<td>Compatível com o ambiente Cocoa Objective-C. Veja http://mysql-cocoa.sourceforge.net/</td>
</tr>
<tr>
<th>D</th>
<td>MySQL for D</td>
<td><code>libmysqlclient</code></td>
<td>Veja MySQL for D.</td>
</tr>
<tr>
<th>Eiffel</th>
<td>Eiffel MySQL</td>
<td><code>libmysqlclient</code></td>
<td>Veja Seção 31.13, “MySQL Eiffel Wrapper”.</td>
</tr>
<tr>
<th>Erlang</th>
<td><code>erlang-mysql-driver</code></td>
<td><code>libmysqlclient</code></td>
<td>Veja <code>erlang-mysql-driver.</a></td>
</tr>
<tr>
<th>Haskell</th>
<td>Haskell MySQL Bindings</td>
<td>Driver nativo</td>
<td>Veja Brian O'Sullivan's pure Haskell MySQL bindings.</td>
</tr>
<tr>
<th></th>
<td><code>hsql-mysql</code></td>
<td><code>libmysqlclient</code></td>
<td>Veja <code>hsql-mysql</a></td>
</tr>
<tr>
<th>Java/JDBC</th>
<td>Connector/J</td>
<td>Driver nativo</td>
<td>Veja MySQL Connector/J Developer Guide.</td>
</tr>
<tr>
<th>Kaya</th>
<td>MyDB</td>
<td><code>libmysqlclient</code></td>
<td>Veja MyDB.</td>
</tr>
<tr>
<th>Lua</th>
<td>LuaSQL</td>
<td><code>libmysqlclient</code></td>
<td>Veja LuaSQL.</td>
</tr>
<tr>
<th>.NET/Mono</th>
<td>Connector/NET</td>
<td>Driver