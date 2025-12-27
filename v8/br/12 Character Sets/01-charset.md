# Capítulo 12 Conjuntos de caracteres, Colagens, Unicode

O MySQL inclui suporte a conjuntos de caracteres que permite armazenar dados usando uma variedade de conjuntos de caracteres e realizar comparações de acordo com uma variedade de colagens. O conjunto de caracteres e a colagem padrão do servidor MySQL são `utf8mb4` e `utf8mb4_0900_ai_ci`, mas você pode especificar conjuntos de caracteres no nível do servidor, banco de dados, tabela, coluna e literal de string. Para maximizar a interoperabilidade e a proteção futura dos seus dados e aplicações, recomendamos que você use o conjunto de caracteres `utf8mb4` sempre que possível.

::: info Nota

`UTF8` é um sinônimo desatualizado para `utf8mb3`, e você deve esperar que ele seja removido em uma versão futura do MySQL. Especifique `utfmb3` ou (de preferência) `utfmb4`.

:::

Este capítulo discute os seguintes tópicos:

* O que são conjuntos de caracteres e colagens?
* O sistema padrão de múltiplos níveis para atribuição de conjuntos de caracteres.
* Sintaxe para especificar conjuntos de caracteres e colagens.
* Funções e operações afetadas.
* Suporte a Unicode.
* Os conjuntos de caracteres e colagens disponíveis, com notas.
* Selecionando o idioma para mensagens de erro.
* Selecionando o local para nomes de dia e mês.

Problemas com conjuntos de caracteres afetam não apenas o armazenamento de dados, mas também a comunicação entre programas cliente e o servidor MySQL. Se você deseja que o programa cliente se comunique com o servidor usando um conjunto de caracteres diferente do padrão, você precisa indicar qual é. Por exemplo, para usar o conjunto de caracteres Unicode `latin1`, emita esta declaração após se conectar ao servidor:

```
SET NAMES 'latin1';
```

Para obter mais informações sobre a configuração de conjuntos de caracteres para uso de aplicativos e problemas relacionados a conjuntos de caracteres na comunicação cliente/servidor, consulte a Seção 12.5, “Configurando Conjunto de Caracteres e Colagem de Aplicativos”, e a Seção 12.4, “Conjunto de Caracteres e Colagens de Conexão”.