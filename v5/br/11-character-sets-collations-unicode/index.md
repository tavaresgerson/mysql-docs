# Capítulo 10 Conjuntos de caracteres, collation, Unicode

**Índice**

10.1 Conjuntos de caracteres e codificações em geral

10.2 Conjuntos de caracteres e codificações no MySQL:   10.2.1 Repertório de conjuntos de caracteres

```
10.2.2 UTF-8 for Metadata
```

10.3 Especificação de Conjuntos de Caracteres e Colagens:   10.3.1 Convenções de Nomenclatura de Colagens

```
10.3.2 Server Character Set and Collation

10.3.3 Database Character Set and Collation

10.3.4 Table Character Set and Collation

10.3.5 Column Character Set and Collation

10.3.6 Character String Literal Character Set and Collation

10.3.7 The National Character Set

10.3.8 Character Set Introducers

10.3.9 Examples of Character Set and Collation Assignment

10.3.10 Compatibility with Other DBMSs
```

10.4 Conjuntos de caracteres de conexão e codificações

10.5 Configurando o Conjunto de Caracteres e a Cotação do Aplicativo

10.6 Conjunto de caracteres de mensagem de erro

10.7 Conversão do Conjunto de Caracteres da Coluna

10.8 Problemas de Colaboração:   10.8.1 Uso do COLLATE em Instruções SQL

```
10.8.2 COLLATE Clause Precedence

10.8.3 Character Set and Collation Compatibility

10.8.4 Collation Coercibility in Expressions

10.8.5 The binary Collation Compared to _bin Collations

10.8.6 Examples of the Effect of Collation

10.8.7 Using Collation in INFORMATION_SCHEMA Searches
```

10.9 Suporte a Unicode:   10.9.1 Conjunto de Caracteres utf8mb4 (Codificação Unicode UTF-8 de 4 bytes)

```
10.9.2 The utf8mb3 Character Set (3-Byte UTF-8 Unicode Encoding)

10.9.3 The utf8 Character Set (Alias for utf8mb3)

10.9.4 The ucs2 Character Set (UCS-2 Unicode Encoding)

10.9.5 The utf16 Character Set (UTF-16 Unicode Encoding)

10.9.6 The utf16le Character Set (UTF-16LE Unicode Encoding)

10.9.7 The utf32 Character Set (UTF-32 Unicode Encoding)

10.9.8 Converting Between 3-Byte and 4-Byte Unicode Character Sets
```

10.10 Conjuntos de caracteres e codificações suportados:   10.10.1 Conjuntos de caracteres Unicode

```
10.10.2 West European Character Sets

10.10.3 Central European Character Sets

10.10.4 South European and Middle East Character Sets

10.10.5 Baltic Character Sets

10.10.6 Cyrillic Character Sets

10.10.7 Asian Character Sets

10.10.8 The Binary Character Set
```

10.11 Restrições aos Conjuntos de Caracteres

10.12 Definindo o idioma da mensagem de erro

10.13 Adicionando um Conjunto de Caracteres:   10.13.1 Arrays de Definição de Caracteres

```
10.13.2 String Collating Support for Complex Character Sets

10.13.3 Multi-Byte Character Support for Complex Character Sets
```

10.14 Adicionando uma Coletânea a um Conjunto de Caracteres:   10.14.1 Tipos de Implementação de Coletânea

```
10.14.2 Choosing a Collation ID

10.14.3 Adding a Simple Collation to an 8-Bit Character Set

10.14.4 Adding a UCA Collation to a Unicode Character Set
```

10.15 Configuração do Conjunto de Caracteres

10.16 Suporte ao Local do MySQL Server

O MySQL inclui suporte para conjuntos de caracteres que permite armazenar dados usando uma variedade de conjuntos de caracteres e realizar comparações de acordo com uma variedade de colatações. O conjunto de caracteres e a colatação padrão do servidor MySQL são `latin1` e `latin1_swedish_ci`, mas você pode especificar conjuntos de caracteres nos níveis do servidor, banco de dados, tabela, coluna e literal de string.

Este capítulo discute os seguintes tópicos:

- O que são conjuntos de caracteres e collation?

- O sistema padrão de vários níveis para a atribuição do conjunto de caracteres.

- Sintaxe para especificar conjuntos de caracteres e colatações.

- Funções e operações afetadas.

- Suporte ao Unicode.

- Os conjuntos de caracteres e as codificações disponíveis, com notas.

- Selecionar o idioma para as mensagens de erro.

- Selecionando o idioma para os nomes de dia e mês.

Problemas com o conjunto de caracteres afetam não apenas o armazenamento de dados, mas também a comunicação entre os programas cliente e o servidor MySQL. Se você deseja que o programa cliente se comunique com o servidor usando um conjunto de caracteres diferente do padrão, você precisará indicar qual é. Por exemplo, para usar o conjunto de caracteres Unicode `utf8`, execute essa declaração após se conectar ao servidor:

```sql
SET NAMES 'utf8';
```

Para obter mais informações sobre a configuração de conjuntos de caracteres para uso de aplicativos e problemas relacionados a conjuntos de caracteres na comunicação cliente/servidor, consulte a Seção 10.5, “Configurar Conjunto de Caracteres e Codificação de Aplicativos”, e a Seção 10.4, “Conjunto de Caracteres e Codificações de Conexão”.
