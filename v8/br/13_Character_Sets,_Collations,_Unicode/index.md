# Capítulo 12 Conjuntos de caracteres, colatinas, Unicode

O MySQL inclui suporte para conjuntos de caracteres que permite armazenar dados usando uma variedade de conjuntos de caracteres e realizar comparações de acordo com uma variedade de colatinas. O conjunto de caracteres e a collation padrão do servidor MySQL são `utf8mb4` e `utf8mb4_0900_ai_ci`, mas você pode especificar conjuntos de caracteres nos níveis do servidor, banco de dados, tabela, coluna e literal de string. Para maximizar a interoperabilidade e a proteção do seu futuro, recomendamos que você use o conjunto de caracteres `utf8mb4` sempre que possível.

Nota

`UTF8` é um sinônimo descontinuado para `utf8mb3`, e você deve esperar que ele seja removido em uma versão futura do MySQL. Especifique `utfmb3` ou (de preferência) `utfmb4` em vez disso.

Este capítulo discute os seguintes tópicos:

* O que são conjuntos de caracteres e codificações? * O sistema padrão de múltiplos níveis para atribuição de conjuntos de caracteres. * Sintaxe para especificar conjuntos de caracteres e codificações. * Funções e operações afetadas. * Suporte Unicode. * Os conjuntos de caracteres e codificações disponíveis, com notas.

* Selecionar o idioma para mensagens de erro. * Selecionar o local para os nomes de dia e mês.

Problemas com o conjunto de caracteres afetam não apenas o armazenamento de dados, mas também a comunicação entre os programas cliente e o servidor MySQL. Se você deseja que o programa cliente se comunique com o servidor usando um conjunto de caracteres diferente do padrão, é necessário indicar qual é esse conjunto. Por exemplo, para usar o conjunto de caracteres Unicode `latin1`, faça essa declaração após se conectar ao servidor:

```
SET NAMES 'latin1';
```

Para obter mais informações sobre a configuração de conjuntos de caracteres para uso de aplicativos e questões relacionadas a conjuntos de caracteres na comunicação cliente/servidor, consulte a Seção 12.5, “Configurando o Conjunto de Caracteres e Coligação do Aplicativo”, e a Seção 12.4, “Conjunto de Caracteres e Coligações de Conexão”.