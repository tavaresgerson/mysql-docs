### 11.3.4 Os Tipos BLOB e TEXT

Um `BLOB` é um objeto binário grande (*binary large object*) que pode armazenar uma quantidade variável de dados. Os quatro tipos `BLOB` são `TINYBLOB`, `BLOB`, `MEDIUMBLOB` e `LONGBLOB`. Eles diferem apenas no comprimento máximo dos valores que podem armazenar. Os quatro tipos `TEXT` são `TINYTEXT`, `TEXT`, `MEDIUMTEXT` e `LONGTEXT`. Eles correspondem aos quatro tipos `BLOB` e têm os mesmos comprimentos máximos e requisitos de armazenamento. Consulte a Seção 11.7, “Data Type Storage Requirements”.

Valores `BLOB` são tratados como strings binárias (strings de byte). Eles têm o conjunto de caracteres e o *collation* `binary`, e a comparação e a ordenação (*sorting*) são baseadas nos valores numéricos dos bytes nos valores da coluna. Valores `TEXT` são tratados como strings não binárias (strings de caracteres). Eles têm um conjunto de caracteres diferente de `binary`, e os valores são ordenados e comparados com base no *collation* do conjunto de caracteres.

Se o modo SQL estrito não estiver habilitado e você atribuir um valor a uma coluna `BLOB` ou `TEXT` que exceda o comprimento máximo da coluna, o valor é truncado para caber e um *warning* (aviso) é gerado. Para o truncamento de caracteres que não são espaços, você pode fazer com que um erro ocorra (em vez de um *warning*) e suprimir a inserção do valor usando o modo SQL estrito. Consulte a Seção 5.1.10, “Server SQL Modes”.

O truncamento de espaços finais em excesso de valores a serem inseridos em colunas `TEXT` sempre gera um *warning*, independentemente do modo SQL.

Para colunas `TEXT` e `BLOB`, não há *padding* (preenchimento) na inserção e nenhum byte é removido no *select*.

Se uma coluna `TEXT` for indexada, as comparações de entrada do Index são preenchidas com espaço (*space-padded*) no final. Isso significa que, se o Index exigir valores únicos, erros de *duplicate-key* ocorrerão para valores que diferem apenas no número de espaços finais. Por exemplo, se uma tabela contiver `'a'`, uma tentativa de armazenar `'a '` causará um erro de *duplicate-key*. Isso não é verdade para colunas `BLOB`.

Na maioria dos aspectos, você pode considerar uma coluna `BLOB` como uma coluna `VARBINARY` que pode ser tão grande quanto você desejar. Da mesma forma, você pode considerar uma coluna `TEXT` como uma coluna `VARCHAR`. `BLOB` e `TEXT` diferem de `VARBINARY` e `VARCHAR` das seguintes maneiras:

* Para Indexes em colunas `BLOB` e `TEXT`, você deve especificar um comprimento de prefixo do Index. Para `CHAR` e `VARCHAR`, um comprimento de prefixo é opcional. Consulte a Seção 8.3.4, “Column Indexes”.
* Colunas `BLOB` e `TEXT` não podem ter valores `DEFAULT`.

Se você usar o atributo `BINARY` com um tipo de dados `TEXT`, a coluna recebe o *collation* binário (`_bin`) do conjunto de caracteres da coluna.

`LONG` e `LONG VARCHAR` são mapeados para o tipo de dados `MEDIUMTEXT`. Este é um recurso de compatibilidade.

O MySQL Connector/ODBC define valores `BLOB` como `LONGVARBINARY` e valores `TEXT` como `LONGVARCHAR`.

Como os valores `BLOB` e `TEXT` podem ser extremamente longos, você pode encontrar algumas restrições ao usá-los:

* Apenas os primeiros `max_sort_length` bytes da coluna são usados na ordenação (*sorting*). O valor padrão de `max_sort_length` é 1024. Você pode tornar mais bytes significativos na ordenação ou no agrupamento aumentando o valor de `max_sort_length` na inicialização ou em tempo de execução do servidor. Qualquer cliente pode alterar o valor de sua variável de sessão `max_sort_length`:

  ```sql
  mysql> SET max_sort_length = 2000;
  mysql> SELECT id, comment FROM t
      -> ORDER BY comment;
  ```

* Instâncias de colunas `BLOB` ou `TEXT` no resultado de uma Query que é processada usando uma tabela temporária faz com que o servidor use uma tabela em disco em vez de na memória, porque o *storage engine* `MEMORY` não suporta esses tipos de dados (consulte a Seção 8.4.4, “Internal Temporary Table Use in MySQL”). O uso de disco incorre em uma penalidade de performance, então inclua colunas `BLOB` ou `TEXT` no resultado da Query apenas se elas forem realmente necessárias. Por exemplo, evite usar `SELECT *`, que seleciona todas as colunas.

* O tamanho máximo de um objeto `BLOB` ou `TEXT` é determinado pelo seu tipo, mas o maior valor que você pode realmente transmitir entre o cliente e o servidor é determinado pela quantidade de memória disponível e pelo tamanho dos *buffers* de comunicação. Você pode alterar o tamanho do *buffer* de mensagem mudando o valor da variável `max_allowed_packet`, mas você deve fazer isso tanto para o servidor quanto para o seu programa cliente. Por exemplo, tanto o **mysql** quanto o **mysqldump** permitem que você altere o valor `max_allowed_packet` do lado do cliente. Consulte a Seção 5.1.1, “Configuring the Server”, Seção 4.5.1, “mysql — The MySQL Command-Line Client” e Seção 4.5.4, “mysqldump — A Database Backup Program”. Você também pode querer comparar os tamanhos de *packet* e o tamanho dos objetos de dados que você está armazenando com os requisitos de armazenamento, consulte a Seção 11.7, “Data Type Storage Requirements”.

Cada valor `BLOB` ou `TEXT` é representado internamente por um objeto alocado separadamente. Isso contrasta com todos os outros tipos de dados, para os quais o armazenamento é alocado uma vez por coluna quando a tabela é aberta.

Em alguns casos, pode ser desejável armazenar dados binários, como arquivos de mídia, em colunas `BLOB` ou `TEXT`. Você pode achar as funções de manipulação de strings do MySQL úteis para trabalhar com tais dados. Consulte a Seção 12.8, “String Functions and Operators”. Por razões de segurança e outras, geralmente é preferível fazer isso usando o código da aplicação em vez de conceder o privilégio `FILE` aos usuários da aplicação. Você pode discutir especificidades para várias linguagens e plataformas nos Fóruns MySQL (<http://forums.mysql.com/>).

**Nota:** No cliente **mysql**, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — The MySQL Command-Line Client”.