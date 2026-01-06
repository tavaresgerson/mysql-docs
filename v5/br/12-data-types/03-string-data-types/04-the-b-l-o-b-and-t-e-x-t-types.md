### 11.3.4 Os tipos BLOB e TEXTO

Um `BLOB` é um objeto grande binário que pode armazenar uma quantidade variável de dados. Os quatro tipos de `BLOB` são `TINYBLOB`, `BLOB`, `MEDIUMBLOB` e `LONGBLOB`. Eles diferem apenas no comprimento máximo dos valores que podem armazenar. Os quatro tipos de `TEXT` são `TINYTEXT`, `TEXT`, `MEDIUMTEXT` e `LONGTEXT`. Estes correspondem aos quatro tipos de `BLOB` e têm os mesmos comprimentos máximos e requisitos de armazenamento. Consulte a Seção 11.7, “Requisitos de Armazenamento de Tipos de Dados”.

Os valores `BLOB` são tratados como cadeias binárias (cadeias de bytes). Eles têm o conjunto de caracteres `binary` e a ordenação, e a comparação e ordenação são baseadas nos valores numéricos dos bytes nos valores da coluna. Os valores `TEXT` são tratados como cadeias não binárias (cadeias de caracteres). Eles têm um conjunto de caracteres diferente de `binary`, e os valores são ordenados e comparados com base na ordenação do conjunto de caracteres.

Se o modo SQL rigoroso não estiver habilitado e você atribuir um valor a uma coluna `BLOB` ou `TEXT` que exceda o comprimento máximo da coluna, o valor será truncado para caber e um aviso será gerado. Para o truncamento de caracteres não espaços, você pode causar um erro (em vez de um aviso) e suprimir a inserção do valor usando o modo SQL rigoroso. Veja a Seção 5.1.10, “Modos SQL do Servidor”.

A truncação de espaços em branco excessivos de valores a serem inseridos em colunas `TEXT` sempre gera uma mensagem de aviso, independentemente do modo SQL.

Para as colunas `TEXT` e `BLOB`, não há preenchimento no momento da inserção e nenhum byte é removido no momento da seleção.

Se uma coluna `TEXT` estiver indexada, as comparações de entradas de índice são preenchidas com espaços no final. Isso significa que, se o índice exigir valores únicos, erros de chave duplicada ocorrerão para valores que diferem apenas no número de espaços finais. Por exemplo, se uma tabela contém `'a'`, uma tentativa de armazenar `'a '` causa um erro de chave duplicada. Isso não é verdade para colunas `BLOB`.

Na maioria dos casos, você pode considerar uma coluna `BLOB` como uma coluna `VARBINARY`, que pode ser do tamanho que você quiser. Da mesma forma, você pode considerar uma coluna `TEXT` como uma coluna `VARCHAR`. `BLOB` e `TEXT` diferem de `VARBINARY` e `VARCHAR` da seguinte maneira:

- Para índices em colunas `BLOB` e `TEXT`, você deve especificar o comprimento do prefixo do índice. Para `CHAR` e `VARCHAR`, o comprimento do prefixo é opcional. Veja a Seção 8.3.4, “Indeks de Colunas”.

- As colunas `BLOB` e `TEXT` não podem ter valores `DEFAULT`.

Se você usar o atributo `BINARY` com um tipo de dado `TEXT`, a coluna receberá a collation binária (\_bin) do conjunto de caracteres da coluna.

`LONG` e `LONG VARCHAR` correspondem ao tipo de dados `MEDIUMTEXT`. Esse é um recurso de compatibilidade.

O MySQL Connector/ODBC define os valores `BLOB` como `LONGVARBINARY` e os valores `TEXT` como `LONGVARCHAR`.

Como os valores `BLOB` e `TEXT` podem ser extremamente longos, você pode encontrar algumas restrições ao usá-los:

- Apenas os primeiros `max_sort_length` bytes da coluna são usados durante o ordenamento. O valor padrão de `max_sort_length` é 1024. Você pode tornar mais bytes significativos no ordenamento ou agrupamento aumentando o valor de `max_sort_length` durante o início ou execução do servidor. Qualquer cliente pode alterar o valor da variável `max_sort_length` da sessão:

  ```sql
  mysql> SET max_sort_length = 2000;
  mysql> SELECT id, comment FROM t
      -> ORDER BY comment;
  ```

- Quando as colunas `BLOB` ou `TEXT` estão presentes no resultado de uma consulta processada usando uma tabela temporária, o servidor usa uma tabela no disco em vez de na memória, pois o mecanismo de armazenamento `MEMORY` não suporta esses tipos de dados (consulte a Seção 8.4.4, “Uso de Tabela Temporária Interna no MySQL”). O uso do disco implica uma penalidade de desempenho, portanto, inclua as colunas `BLOB` ou `TEXT` no resultado da consulta apenas se elas realmente forem necessárias. Por exemplo, evite usar `SELECT *`, que seleciona todas as colunas.

- O tamanho máximo de um objeto `BLOB` ou `TEXT` é determinado pelo seu tipo, mas o maior valor que você realmente pode transmitir entre o cliente e o servidor é determinado pela quantidade de memória disponível e pelo tamanho dos buffers de comunicação. Você pode alterar o tamanho do buffer de mensagem alterando o valor da variável `max_allowed_packet`, mas isso deve ser feito tanto para o servidor quanto para o seu programa cliente. Por exemplo, o **mysql** e o **mysqldump** permitem que você altere o valor do `max_allowed_packet` no lado do cliente. Veja a Seção 5.1.1, “Configurando o Servidor”, a Seção 4.5.1, “mysql — O Cliente de Linha de Comando do MySQL” e a Seção 4.5.4, “mysqldump — Um Programa de Backup de Bancos de Dados”. Você também pode querer comparar os tamanhos dos pacotes e o tamanho dos objetos de dados que está armazenando com os requisitos de armazenamento, veja a Seção 11.7, “Requisitos de Armazenamento de Tipos de Dados”

Cada valor `BLOB` ou `TEXT` é representado internamente por um objeto alocado separadamente. Isso contrasta com todos os outros tipos de dados, para os quais o armazenamento é alocado uma vez por coluna quando a tabela é aberta.

Em alguns casos, pode ser desejável armazenar dados binários, como arquivos de mídia, em colunas `BLOB` ou `TEXT`. Você pode achar as funções de manipulação de strings do MySQL úteis para trabalhar com esses dados. Veja a Seção 12.8, “Funções e Operadores de String”. Por motivos de segurança e outros, geralmente é preferível fazer isso usando código de aplicação, em vez de dar ao usuário da aplicação o privilégio `FILE`. Você pode discutir detalhes para várias linguagens e plataformas nos Fóruns do MySQL (<http://forums.mysql.com/>).

Nota

No cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”.
