### 13.3.4 Os tipos BLOB e TEXT

Um `BLOB` é um objeto grande binário que pode armazenar uma quantidade variável de dados. Os quatro tipos `BLOB` são `TINYBLOB`, `BLOB`, `MEDIUMBLOB` e `LONGBLOB`. Esses tipos diferem apenas no comprimento máximo dos valores que podem armazenar. Os quatro tipos `TEXT` são `TINYTEXT`, `TEXT`, `MEDIUMTEXT` e `LONGTEXT`. Esses correspondem aos quatro tipos `BLOB` e têm os mesmos comprimentos máximos e requisitos de armazenamento. Veja a Seção 13.7, “Requisitos de Armazenamento de Tipos de Dados”.

Os valores de `BLOB` são tratados como strings binárias (strings de bytes). Eles têm o conjunto de caracteres `binary` e a ordenação, e a comparação e ordenação são baseadas nos valores numéricos dos bytes nos valores das colunas. Os valores de `TEXT` são tratados como strings não binárias (strings de caracteres). Eles têm um conjunto de caracteres diferente de `binary`, e os valores são ordenados e comparados com base na ordenação do conjunto de caracteres.

Se o modo SQL rigoroso não estiver habilitado e você atribuir um valor a uma coluna `BLOB` ou `TEXT` que exceda o comprimento máximo da coluna, o valor é truncado para caber e um aviso é gerado. Para a truncagem de caracteres não espaços, você pode causar um erro (em vez de um aviso) e suprimir a inserção do valor usando o modo SQL rigoroso. Veja a Seção 7.1.11, “Modos SQL do Servidor”.

A truncagem de espaços excessivos de valores a serem inseridos em colunas `TEXT` sempre gera um aviso, independentemente do modo SQL.

Para colunas `TEXT` e `BLOB`, não há preenchimento no momento da inserção e nenhum byte é removido no momento da seleção.

Se uma coluna `TEXT` estiver indexada, as comparações de entradas de índice são preenchidas com espaços no final. Isso significa que, se o índice exigir valores únicos, erros de chave duplicada ocorrerão para valores que diferem apenas no número de espaços finais. Por exemplo, se uma tabela contém `'a'`, uma tentativa de armazenar `'a '` causa um erro de chave duplicada. Isso não é verdade para colunas `BLOB`.

Na maioria dos casos, você pode considerar uma coluna `BLOB` como uma coluna `VARBINARY`, que pode ter o tamanho que você desejar. Da mesma forma, você pode considerar uma coluna `TEXT` como uma coluna `VARCHAR`. `BLOB` e `TEXT` diferem de `VARBINARY` e `VARCHAR` da seguinte maneira:

* Para índices em colunas `BLOB` e `TEXT`, você deve especificar o comprimento do prefixo do índice. Para `CHAR` e `VARCHAR`, o comprimento do prefixo é opcional. Consulte a Seção 10.3.5, “Indekses de Colunas”.
* Colunas `BLOB` e `TEXT` não podem ter valores `DEFAULT`.

Se você usar o atributo `BINARY` com um tipo de dados `TEXT`, a coluna é atribuída a uma collation binária (`_bin`) do conjunto de caracteres da coluna.

`LONG` e `LONG VARCHAR` correspondem ao tipo de dados `MEDIUMTEXT`. Esse é um recurso de compatibilidade.

O MySQL Connector/ODBC define valores `BLOB` como `LONGVARBINARY` e valores `TEXT` como `LONGVARCHAR`.

Como os valores de `BLOB` e `TEXT` podem ser extremamente longos, você pode encontrar algumas restrições ao usá-los:

* Apenas os primeiros `max_sort_length` bytes da coluna são usados ao ordenar. O valor padrão de `max_sort_length` é 1024. Você pode tornar mais bytes significativos ao ordenar ou agrupar, aumentando o valor de `max_sort_length` durante o inicialização ou execução do servidor. Qualquer cliente pode alterar o valor da variável de sessão `max_sort_length`:

```
  mysql> SET max_sort_length = 2000;
  mysql> SELECT id, comment FROM t
      -> ORDER BY comment;
  ```
* Instâncias de colunas `BLOB` ou `TEXT` no resultado de uma consulta processada usando uma tabela temporária fazem com que o servidor use uma tabela no disco em vez de na memória, porque o mecanismo de armazenamento `MEMORY` não suporta esses tipos de dados (veja a Seção 10.4.4, “Uso de Tabela Temporária Interna no MySQL”). O uso do disco implica uma penalidade de desempenho, então inclua colunas `BLOB` ou `TEXT` no resultado da consulta apenas se elas realmente forem necessárias. Por exemplo, evite usar `SELECT *`, que seleciona todas as colunas.
* O tamanho máximo de um objeto `BLOB` ou `TEXT` é determinado por seu tipo, mas o valor maior que você realmente pode transmitir entre o cliente e o servidor é determinado pela quantidade de memória disponível e pelo tamanho dos buffers de comunicação. Você pode alterar o tamanho do buffer de mensagem alterando o valor da variável `max_allowed_packet`, mas você deve fazer isso tanto para o servidor quanto para o seu programa cliente. Por exemplo, tanto o `mysql` quanto o  `mysqldump` permitem que você altere o valor do `max_allowed_packet` do lado do cliente. Veja a Seção 7.1.1, “Configurando o Servidor”, a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL” e a Seção 6.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”. Você também pode querer comparar os tamanhos dos pacotes e o tamanho dos objetos de dados que você está armazenando com os requisitos de armazenamento, veja a Seção 13.7, “Requisitos de Armazenamento de Tipos de Dados”

Cada valor `BLOB` ou `TEXT` é representado internamente por um objeto alocado separadamente. Isso contrasta com todos os outros tipos de dados, para os quais o armazenamento é alocado uma vez por coluna quando a tabela é aberta.

Em alguns casos, pode ser desejável armazenar dados binários, como arquivos de mídia, em colunas `BLOB` ou `TEXT`. Você pode achar as funções de manipulação de strings do MySQL úteis para trabalhar com esses dados. Veja a Seção 14.8, “Funções e Operadores de String”. Por motivos de segurança e outros, geralmente é preferível fazer isso usando código de aplicação, em vez de dar ao usuário da aplicação o privilégio `FILE`. Você pode discutir detalhes para várias linguagens e plataformas nos Fóruns do MySQL (<http://forums.mysql.com/>).

::: info Nota

Dentro do cliente `mysql`, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, veja a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.