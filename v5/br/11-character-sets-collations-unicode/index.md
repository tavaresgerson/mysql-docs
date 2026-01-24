# Capítulo 10 Character Sets, Collations, Unicode

**Sumário**

10.1 Character Sets e Collations em Geral

10.2 Character Sets e Collations no MySQL : 10.2.1 Repertoire de Character Set

    10.2.2 UTF-8 para Metadata

10.3 Especificando Character Sets e Collations : 10.3.1 Convenções de Nomenclatura de Collation

    10.3.2 Character Set e Collation do Server

    10.3.3 Character Set e Collation do Database

    10.3.4 Character Set e Collation da Table

    10.3.5 Character Set e Collation da Column

    10.3.6 Character Set e Collation de String Literal de Caracteres

    10.3.7 O National Character Set

    10.3.8 Introducers de Character Set

    10.3.9 Exemplos de Atribuição de Character Set e Collation

    10.3.10 Compatibilidade com Outros DBMSs

10.4 Character Sets e Collations de Connection

10.5 Configurando Character Set e Collation da Aplicação

10.6 Character Set de Mensagem de Erro

10.7 Conversão de Character Set de Column

10.8 Questões de Collation : 10.8.1 Usando COLLATE em SQL Statements

    10.8.2 Precedência da Cláusula COLLATE

    10.8.3 Compatibilidade de Character Set e Collation

    10.8.4 Coercibilidade de Collation em Expressões

    10.8.5 O Collation binary Comparado aos Collations _bin

    10.8.6 Exemplos do Efeito do Collation

    10.8.7 Usando Collation em Buscas no INFORMATION_SCHEMA

10.9 Suporte a Unicode : 10.9.1 O Character Set utf8mb4 (Codificação UTF-8 Unicode de 4 Bytes)

    10.9.2 O Character Set utf8mb3 (Codificação UTF-8 Unicode de 3 Bytes)

    10.9.3 O Character Set utf8 (Alias para utf8mb3)

    10.9.4 O Character Set ucs2 (Codificação UCS-2 Unicode)

    10.9.5 O Character Set utf16 (Codificação UTF-16 Unicode)

    10.9.6 O Character Set utf16le (Codificação UTF-16LE Unicode)

    10.9.7 O Character Set utf32 (Codificação UTF-32 Unicode)

    10.9.8 Conversão Entre Character Sets Unicode de 3 Bytes e 4 Bytes

10.10 Character Sets e Collations Suportados : 10.10.1 Character Sets Unicode

    10.10.2 Character Sets da Europa Ocidental

    10.10.3 Character Sets da Europa Central

    10.10.4 Character Sets do Sul da Europa e Oriente Médio

    10.10.5 Character Sets Bálticos

    10.10.6 Character Sets Cirílicos

    10.10.7 Character Sets Asiáticos

    10.10.8 O Character Set Binary

10.11 Restrições em Character Sets

10.12 Definindo a Linguagem da Mensagem de Erro

10.13 Adicionando um Character Set : 10.13.1 Arrays de Definição de Caracteres

    10.13.2 Suporte a Collation de String para Character Sets Complexos

    10.13.3 Suporte a Caracteres Multi-Byte para Character Sets Complexos

10.14 Adicionando um Collation a um Character Set : 10.14.1 Tipos de Implementação de Collation

    10.14.2 Escolhendo um Collation ID

    10.14.3 Adicionando um Collation Simples a um Character Set de 8 Bits

    10.14.4 Adicionando um Collation UCA a um Character Set Unicode

10.15 Configuração de Character Set

10.16 Suporte a Locale do MySQL Server

O MySQL inclui suporte a character set que permite armazenar dados usando uma variedade de character sets e realizar comparações de acordo com uma variedade de collations. O character set e collation padrão do MySQL server são `latin1` e `latin1_swedish_ci`, mas você pode especificar character sets nos níveis de server, database, table, column e string literal.

Este capítulo discute os seguintes tópicos:

* O que são character sets e collations?
* O sistema de defaults de múltiplos níveis para atribuição de character set.
* A sintaxe para especificação de character sets e collations.
* Funções e operações afetadas.
* Suporte a Unicode.
* Os character sets e collations disponíveis, com notas.

* Seleção do idioma para mensagens de erro.
* Seleção do locale para nomes de dias e meses.

Questões de character set afetam não apenas o armazenamento de dados, mas também a comunicação entre os programas client e o MySQL server. Se você quiser que o programa client se comunique com o server usando um character set diferente do padrão, você precisará indicar qual. Por exemplo, para usar o character set Unicode `utf8`, execute esta statement após conectar-se ao server:

```sql
SET NAMES 'utf8';
```

Para mais informações sobre como configurar character sets para uso em aplicações e sobre questões relacionadas a character set na comunicação client/server, consulte a Seção 10.5, “Configurando Character Set e Collation da Aplicação”, e a Seção 10.4, “Character Sets e Collations de Connection”.
