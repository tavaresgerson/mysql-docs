# Capítulo 12 Conjuntos de caracteres, collation, Unicode

**Índice**

12.1 Conjuntos de caracteres e codificações em geral

12.2 Conjuntos de caracteres e codificações no MySQL:   12.2.1 Repertório de conjuntos de caracteres

```
12.2.2 UTF-8 for Metadata
```

12.3 Especificação de Conjuntos de Caracteres e Colagens:   12.3.1 Convenções de Nomenclatura de Colagens

```
12.3.2 Server Character Set and Collation

12.3.3 Database Character Set and Collation

12.3.4 Table Character Set and Collation

12.3.5 Column Character Set and Collation

12.3.6 Character String Literal Character Set and Collation

12.3.7 The National Character Set

12.3.8 Character Set Introducers

12.3.9 Examples of Character Set and Collation Assignment

12.3.10 Compatibility with Other DBMSs
```

12.4 Conjuntos de caracteres de conexão e codificações

12.5 Configurando o Conjunto de Caracteres e a Cotação do Aplicativo

12.6 Conjunto de caracteres de mensagem de erro

12.7 Conversão do Conjunto de Caracteres da Coluna

12.8 Problemas de Colaboração:   12.8.1 Uso do COLLATE em Instruções SQL

```
12.8.2 COLLATE Clause Precedence

12.8.3 Character Set and Collation Compatibility

12.8.4 Collation Coercibility in Expressions

12.8.5 The binary Collation Compared to _bin Collations

12.8.6 Examples of the Effect of Collation

12.8.7 Using Collation in INFORMATION_SCHEMA Searches
```

12.9 Suporte a Unicode:   12.9.1 Conjunto de Caracteres utf8mb4 (Codificação Unicode UTF-8 de 4 bytes)

```
12.9.2 The utf8mb3 Character Set (3-Byte UTF-8 Unicode Encoding)

12.9.3 The utf8 Character Set (Deprecated alias for utf8mb3)

12.9.4 The ucs2 Character Set (UCS-2 Unicode Encoding)

12.9.5 The utf16 Character Set (UTF-16 Unicode Encoding)

12.9.6 The utf16le Character Set (UTF-16LE Unicode Encoding)

12.9.7 The utf32 Character Set (UTF-32 Unicode Encoding)

12.9.8 Converting Between 3-Byte and 4-Byte Unicode Character Sets
```

12.10 Conjuntos de caracteres e codificações suportados:   12.10.1 Conjuntos de caracteres Unicode

```
12.10.2 West European Character Sets

12.10.3 Central European Character Sets

12.10.4 South European and Middle East Character Sets

12.10.5 Baltic Character Sets

12.10.6 Cyrillic Character Sets

12.10.7 Asian Character Sets

12.10.8 The Binary Character Set
```

12.11 Restrições aos Conjuntos de Caracteres

12.12 Definindo o idioma da mensagem de erro

12.13 Adicionando um Conjunto de Caracteres:   12.13.1 Arrays de Definição de Caracteres

```
12.13.2 String Collating Support for Complex Character Sets

12.13.3 Multi-Byte Character Support for Complex Character Sets
```

12.14 Adicionando uma Coletânea a um Conjunto de Caracteres:   12.14.1 Tipos de Implementação de Coletânea

```
12.14.2 Choosing a Collation ID

12.14.3 Adding a Simple Collation to an 8-Bit Character Set

12.14.4 Adding a UCA Collation to a Unicode Character Set
```

12.15 Configuração do Conjunto de Caracteres

12.16 Suporte ao Local do Servidor MySQL

O MySQL inclui suporte para conjuntos de caracteres que permite armazenar dados usando uma variedade de conjuntos de caracteres e realizar comparações de acordo com uma variedade de colatações. O conjunto de caracteres e a colatação padrão do servidor MySQL são `utf8mb4` e `utf8mb4_0900_ai_ci`, mas você pode especificar conjuntos de caracteres nos níveis do servidor, banco de dados, tabela, coluna e literal de string. Para maximizar a interoperabilidade e a proteção futura dos seus dados e aplicações, recomendamos que você use o conjunto de caracteres `utf8mb4` sempre que possível.

Nota

`UTF8` é um sinônimo desatualizado para `utf8mb3`, e você deve esperar que ele seja removido em uma versão futura do MySQL. Especifique `utfmb3` ou (de preferência) `utfmb4` em vez disso.

Este capítulo discute os seguintes tópicos:

- O que são conjuntos de caracteres e collation?

- O sistema padrão de vários níveis para a atribuição do conjunto de caracteres.

- Sintaxe para especificar conjuntos de caracteres e colatações.

- Funções e operações afetadas.

- Suporte ao Unicode.

- Os conjuntos de caracteres e as codificações disponíveis, com notas.

- Selecionar o idioma para as mensagens de erro.

- Selecionando o idioma para os nomes de dia e mês.

Problemas com o conjunto de caracteres afetam não apenas o armazenamento de dados, mas também a comunicação entre os programas cliente e o servidor MySQL. Se você deseja que o programa cliente se comunique com o servidor usando um conjunto de caracteres diferente do padrão, é necessário indicar qual é. Por exemplo, para usar o conjunto de caracteres Unicode `latin1`, execute esta declaração após se conectar ao servidor:

```
SET NAMES 'latin1';
```

Para obter mais informações sobre a configuração de conjuntos de caracteres para uso de aplicativos e problemas relacionados a conjuntos de caracteres na comunicação cliente/servidor, consulte a Seção 12.5, “Configurando Conjunto de Caracteres e Coletânea de Aplicativos”, e a Seção 12.4, “Conjunto de Caracteres e Coletações de Conexão”.
