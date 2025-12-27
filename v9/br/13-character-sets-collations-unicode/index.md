# Capítulo 12 Conjuntos de Caracteres, Colagens, Unicode

**Índice**

12.1 Conjuntos de Caracteres e Colagens em Geral

12.2 Conjuntos de Caracteres e Colagens no MySQL:   12.2.1 Repertório de Conjuntos de Caracteres

    12.2.2 UTF-8 para Metadados

12.3 Especificação de Conjuntos de Caracteres e Colagens:   12.3.1 Convenções de Nomenclatura de Colagens

    12.3.2 Conjunto de Caracteres do Servidor e Colagem

    12.3.3 Conjunto de Caracteres do Banco de Dados e Colagem

    12.3.4 Conjunto de Caracteres da Tabela e Colagem

    12.3.5 Conjunto de Caracteres da Coluna e Colagem

    12.3.6 Conjunto de Caracteres Literal de Caracteres de String

    12.3.7 O Conjunto de Caracteres Nacional

    12.3.8 Introdutores de Conjunto de Caracteres

    12.3.9 Exemplos de Atribuição de Conjuntos de Caracteres e Colagens

    12.3.10 Compatibilidade com Outros SGBD

12.4 Conjuntos de Caracteres e Colagens de Conexão

12.5 Configuração do Conjunto de Caracteres e Colagem da Aplicação

12.6 Conjunto de Caracteres de Mensagem de Erro

12.7 Conversão de Conjunto de Caracteres da Coluna

12.8 Problemas de Colagem:   12.8.1 Uso da cláusula COLLATE em Instruções SQL

    12.8.2 Precedência da Cláusula COLLATE

    12.8.3 Compatibilidade de Conjunto de Caracteres e Colagem

    12.8.4 Coercibilidade da Colagem em Expressões

    12.8.5 A Colagem Binária Comparada às Colagens \_bin

    12.8.6 Exemplos do Efeito da Colagem

    12.8.7 Uso da Colagem em Pesquisas do INFORMATION_SCHEMA

12.9 Suporte a Unicode:   12.9.1 O Conjunto de Caracteres utf8mb4 (Codificação Unicode UTF-8 de 4 Bytes)

    12.9.2 O Conjunto de Caracteres utf8mb3 (Codificação Unicode UTF-8 de 3 Bytes)

    12.9.3 O Conjunto de Caracteres utf8 (Alias desatualizado para utf8mb3)

    12.9.4 O Conjunto de Caracteres ucs2 (Codificação Unicode UCS-2)

    12.9.5 O Conjunto de Caracteres utf16 (Codificação Unicode UTF-16)

    12.9.6 O Conjunto de Caracteres utf16le (Codificação Unicode UTF-16LE)

    12.9.7 O Conjunto de Caracteres utf32 (Codificação Unicode UTF-32)

12.9.8 Conversão entre conjuntos de caracteres Unicode de 3 e 4 bytes

12.10 Conjuntos de caracteres e ordenações suportados:   12.10.1 Conjuntos de caracteres Unicode

    12.10.2 Conjuntos de caracteres da Europa Ocidental

    12.10.3 Conjuntos de caracteres da Europa Central

    12.10.4 Conjuntos de caracteres da Europa do Sul e do Oriente Médio

    12.10.5 Conjuntos de caracteres bálticos

    12.10.6 Conjuntos de caracteres cirílicos

    12.10.7 Conjuntos de caracteres asiáticos

    12.10.8 O conjunto de caracteres binário

12.11 Restrições aos conjuntos de caracteres

12.12 Definindo o idioma da mensagem de erro

12.13 Adicionando um conjunto de caracteres:   12.13.1 Arrays de definição de caracteres

    12.13.2 Suporte de ordenação de strings para conjuntos de caracteres complexos

    12.13.3 Suporte a caracteres multi-bytes para conjuntos de caracteres complexos

12.14 Adicionando uma ordenação a um conjunto de caracteres:   12.14.1 Tipos de implementação de ordenação

    12.14.2 Escolhendo um ID de ordenação

    12.14.3 Adicionando uma ordenação simples a um conjunto de caracteres de 8 bits

    12.14.4 Adicionando uma ordenação UCA a um conjunto de caracteres Unicode

12.15 Configuração do conjunto de caracteres

12.16 Suporte do MySQL Server Locale

O MySQL inclui suporte a conjuntos de caracteres que permite que você armazene dados usando uma variedade de conjuntos de caracteres e realize comparações de acordo com uma variedade de ordenações. O conjunto de caracteres e a ordenação padrão do servidor MySQL são `utf8mb4` e `utf8mb4_0900_ai_ci`, mas você pode especificar conjuntos de caracteres nos níveis do servidor, banco de dados, tabela, coluna e literal de string. Para maximizar a interoperabilidade e a proteção futura dos seus dados e aplicações, recomendamos que você use o conjunto de caracteres `utf8mb4` sempre que possível.

Nota

`UTF8` é um sinônimo desatualizado para `utf8mb3`, e você deve esperar que ele seja removido em uma versão futura do MySQL. Especifique `utfmb3` ou (de preferência) `utfmb4`.

Este capítulo discute os seguintes tópicos:

* O que são conjuntos de caracteres e coligações?
* O sistema padrão de vários níveis para a atribuição de conjuntos de caracteres.
* Sintaxe para especificar conjuntos de caracteres e coligações.
* Funções e operações afetadas.
* Suporte a Unicode.
* Os conjuntos de caracteres e coligações disponíveis, com notas.

* Selecionando o idioma para mensagens de erro.
* Selecionando o local para nomes de dia e mês.

Problemas com conjuntos de caracteres afetam não apenas o armazenamento de dados, mas também a comunicação entre programas cliente e o servidor MySQL. Se você deseja que o programa cliente se comunique com o servidor usando um conjunto de caracteres diferente do padrão, você precisa indicar qual é. Por exemplo, para usar o conjunto de caracteres Unicode `latin1`, execute esta declaração após se conectar ao servidor:

```
SET NAMES 'latin1';
```

Para obter mais informações sobre a configuração de conjuntos de caracteres para uso de aplicativos e problemas relacionados a conjuntos de caracteres na comunicação cliente/servidor, consulte a Seção 12.5, “Configurando Conjunto de Caracteres e Coligação de Aplicativos”, e a Seção 12.4, “Conjunto de Caracteres e Coligações de Conexão”.