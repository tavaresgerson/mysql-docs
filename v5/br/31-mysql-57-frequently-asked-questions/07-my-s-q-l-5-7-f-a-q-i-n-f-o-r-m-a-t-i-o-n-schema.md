## A.7 FAQ do MySQL 5.7: INFORMATION_SCHEMA

A.7.1. [Onde posso encontrar a documentação para o Database INFORMATION_SCHEMA do MySQL?](faqs-information-schema.html#faq-mysql-where-docs-information-schema)

A.7.2. [Existe um fórum de discussão para INFORMATION_SCHEMA?](faqs-information-schema.html#faq-mysql-where-forum-information-schema)

A.7.3. [Onde posso encontrar a especificação ANSI SQL 2003 para INFORMATION_SCHEMA?](faqs-information-schema.html#faq-mysql-where-ansi-information-schema)

A.7.4. [Qual é a diferença entre o Dicionário de Dados do Oracle e o INFORMATION_SCHEMA do MySQL?](faqs-information-schema.html#faq-mysql-compare-oracle-data-dir-info-schema)

A.7.5. [Posso adicionar ou modificar de outra forma as tabelas encontradas no Database INFORMATION_SCHEMA?](faqs-information-schema.html#faq-mysql-can-modify-information-schema)

***

**A.7.1. Onde posso encontrar a documentação para o Database `INFORMATION_SCHEMA` do MySQL?**

Consulte o Capítulo 24, *INFORMATION_SCHEMA Tables*.

Você também pode achar os Fóruns de Usuários do MySQL úteis.

**A.7.2. Existe um fórum de discussão para `INFORMATION_SCHEMA`?**

Consulte os Fóruns de Usuários do MySQL.

**A.7.3. Onde posso encontrar a especificação ANSI SQL 2003 para `INFORMATION_SCHEMA`?**

Infelizmente, as especificações oficiais não estão disponíveis gratuitamente. (A ANSI as disponibiliza para compra.) No entanto, existem livros disponíveis, como *SQL-99 Complete, Really* de Peter Gulutzan e Trudy Pelzer, que fornecem uma visão abrangente do padrão, incluindo `INFORMATION_SCHEMA`.

**A.7.4. Qual é a diferença entre o Dicionário de Dados (Data Dictionary) do Oracle e o `INFORMATION_SCHEMA` do MySQL?**

Tanto o Oracle quanto o MySQL fornecem metadata em tabelas. No entanto, o Oracle e o MySQL usam nomes de tabela e nomes de coluna diferentes. A implementação do MySQL é mais semelhante àquelas encontradas no DB2 e no SQL Server, que também suportam `INFORMATION_SCHEMA` conforme definido no padrão SQL.

**A.7.5. Posso adicionar ou modificar de outra forma as tabelas encontradas no Database `INFORMATION_SCHEMA`?**

Não. Visto que as aplicações podem depender de uma determinada estrutura padrão, ela não deve ser modificada. Por essa razão, *não podemos oferecer suporte a bugs ou outros problemas resultantes da modificação das tabelas ou dados de `INFORMATION_SCHEMA`*.