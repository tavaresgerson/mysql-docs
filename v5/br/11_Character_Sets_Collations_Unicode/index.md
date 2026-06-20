# Capítulo 10 Conjuntos de caracteres, colatinas, Unicode

O MySQL inclui suporte para conjuntos de caracteres que permite armazenar dados usando uma variedade de conjuntos de caracteres e realizar comparações de acordo com uma variedade de colatões. O conjunto de caracteres e o colatão padrão do servidor MySQL são `latin1` e `latin1_swedish_ci`, mas você pode especificar conjuntos de caracteres nos níveis do servidor, banco de dados, tabela, coluna e literal de string.

Este capítulo discute os seguintes tópicos:

* O que são conjuntos de caracteres e codificações? * O sistema padrão de múltiplos níveis para atribuição de conjuntos de caracteres. * Sintaxe para especificar conjuntos de caracteres e codificações. * Funções e operações afetadas. * Suporte Unicode. * Os conjuntos de caracteres e codificações disponíveis, com notas.

* Selecionar o idioma para mensagens de erro. * Selecionar o local para os nomes de dia e mês.

Problemas com o conjunto de caracteres afetam não apenas o armazenamento de dados, mas também a comunicação entre os programas cliente e o servidor MySQL. Se você deseja que o programa cliente se comunique com o servidor usando um conjunto de caracteres diferente do padrão, você precisará indicar qual é. Por exemplo, para usar o conjunto de caracteres Unicode `utf8`, faça esta declaração após se conectar ao servidor:

```sql
SET NAMES 'utf8';
```

Para obter mais informações sobre a configuração de conjuntos de caracteres para uso de aplicativos e questões relacionadas a conjuntos de caracteres na comunicação cliente/servidor, consulte a Seção 10.5, “Configurando o Conjunto de Caracteres e Colaboração do Aplicativo”, e a Seção 10.4, “Conjunto de Caracteres e Colaborações de Conexão”.