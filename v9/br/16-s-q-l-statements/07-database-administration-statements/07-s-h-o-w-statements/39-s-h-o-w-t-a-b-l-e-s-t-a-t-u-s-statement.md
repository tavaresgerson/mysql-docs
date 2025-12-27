#### 15.7.7.39 Declaração `SHOW TABLE STATUS`

```
SHOW TABLE STATUS
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW TABLE STATUS` funciona como `SHOW TABLES`, mas fornece uma grande quantidade de informações sobre cada tabela que não é `TEMPORARY`. Você também pode obter essa lista usando o comando **mysqlshow --status *`db_name`***. A cláusula `LIKE`, se presente, indica quais nomes de tabela devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 28.8, *Extensões para Declarações SHOW*.

Esta declaração também exibe informações sobre visualizações.

A saída da declaração `SHOW TABLE STATUS` tem essas colunas:

* `Name`

  O nome da tabela.

* `Engine`

  O motor de armazenamento para a tabela. Veja o Capítulo 17, *O Motor de Armazenamento InnoDB*, e o Capítulo 18, *Motores de Armazenamento Alternativos*.

  Para tabelas particionadas, `Engine` mostra o nome do motor de armazenamento usado por todas as particionamentos.

* `Version`

  Esta coluna é inutilizada. Com a remoção dos arquivos `.frm` no MySQL 8.0, esta coluna agora reporta um valor hardcoded de `10`, que era a última versão do arquivo `.frm` usada no MySQL 5.7.

* `Row_format`

  O formato de armazenamento de linhas (`Fixed`, `Dynamic`, `Compressed`, `Redundant`, `Compact`). Para tabelas `MyISAM`, `Dynamic` corresponde ao que **myisamchk -dvv** relata como `Packed`.

* `Rows`

  O número de linhas. Alguns motores de armazenamento, como `MyISAM`, armazenam o contagem exata. Para outros motores de armazenamento, como `InnoDB`, esse valor é uma aproximação e pode variar de até 40% a 50% do valor real. Nesses casos, use `SELECT COUNT(*)` para obter uma contagem precisa.

  O valor `Rows` é `NULL` para tabelas do `INFORMATION_SCHEMA`.

  Para tabelas `InnoDB`, o número de linhas é apenas uma estimativa grosseira usada na otimização do SQL. (Isso também é verdadeiro se a tabela `InnoDB` estiver particionada.)

* `Avg_row_length`

  O comprimento médio da linha.

* `Data_length`

  Para `MyISAM`, `Data_length` é o comprimento do arquivo de dados, em bytes.

  Para `InnoDB`, `Data_length` é a quantidade aproximada de espaço alocado para o índice agrupado, em bytes. Especificamente, é o tamanho do índice agrupado, em páginas, multiplicado pelo tamanho da página do `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

* `Max_data_length`

  Para `MyISAM`, `Max_data_length` é o comprimento máximo do arquivo de dados. Este é o número total de bytes de dados que podem ser armazenados na tabela, dado o tamanho do ponteiro de dados usado.

  Não utilizado para `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

* `Index_length`

  Para `MyISAM`, `Index_length` é o comprimento do arquivo de índice, em bytes.

  Para `InnoDB`, `Index_length` é a quantidade aproximada de espaço alocado para índices não agrupados, em bytes. Especificamente, é a soma dos tamanhos dos índices não agrupados, em páginas, multiplicada pelo tamanho da página do `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

* `Data_free`

  O número de bytes alocados, mas não utilizados.

  As tabelas `InnoDB` relatam o espaço livre do espaço de tabelas ao qual a tabela pertence. Para uma tabela localizada no espaço de tabelas compartilhado, este é o espaço livre do espaço de tabelas compartilhado. Se você estiver usando vários espaços de tabelas e a tabela tiver seu próprio espaço de tabela, o espaço livre é apenas para essa tabela. Espaço livre significa o número de bytes em extensões completamente livres, menos uma margem de segurança. Mesmo que o espaço livre seja exibido como 0, pode ser possível inserir linhas, desde que novos extensões não precisem ser alocadas.

Para o NDB Cluster, `Data_free` mostra o espaço alocado no disco para, mas não utilizado por, uma tabela ou fragmento de dados de disco. (O uso do recurso de dados na memória é relatado pela coluna `Data_length`.)

Para tabelas particionadas, esse valor é apenas uma estimativa e pode não ser absolutamente correto. Um método mais preciso de obter essa informação nesses casos é consultar a tabela `INFORMATION_SCHEMA` `PARTITIONS`, conforme mostrado neste exemplo:

```
  SELECT SUM(DATA_FREE)
      FROM  INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_SCHEMA = 'mydb'
      AND   TABLE_NAME   = 'mytable';
  ```

Para mais informações, consulte a Seção 28.3.26, “A Tabela INFORMATION\_SCHEMA PARTITIONS”.

* `Auto_increment`

  O próximo valor de `AUTO_INCREMENT`.

* `Create_time`

  Quando a tabela foi criada.

* `Update_time`

  Quando o arquivo de dados foi atualizado pela última vez. Para alguns motores de armazenamento, esse valor é `NULL`. Por exemplo, o `InnoDB` armazena múltiplas tabelas em seu espaço de tabela do sistema e o timestamp do arquivo de dados não se aplica. Mesmo com o modo de arquivo por tabela com cada tabela `InnoDB` em um arquivo `.ibd` separado, a mudança de buffer pode atrasar a escrita no arquivo de dados, então o tempo de modificação do arquivo é diferente do tempo da última inserção, atualização ou exclusão. Para o `MyISAM`, o timestamp do arquivo de dados é usado; no entanto, em Windows, o timestamp não é atualizado por atualizações, então o valor é impreciso.

  `Update_time` exibe um valor de timestamp para a última `UPDATE`, `INSERT` ou `DELETE` realizada em tabelas `InnoDB` que não são particionadas. Para MVCC, o valor de timestamp reflete o tempo de `COMMIT`, que é considerado o último tempo de atualização. Os timestamps não são persistidos quando o servidor é reiniciado ou quando a tabela é ejetada do cache do dicionário de dados do `InnoDB`.

* `Check_time`

  Quando a tabela foi verificada pela última vez. Nem todos os motores de armazenamento atualizam esse tempo, no caso, o valor é sempre `NULL`.

Para tabelas `InnoDB` particionadas, `Check_time` é sempre `NULL`.

* `Collation`

  A collation padrão da tabela. A saída não lista explicitamente o conjunto de caracteres padrão da tabela, mas o nome da collation começa com o nome do conjunto de caracteres.

* `Checksum`

  O valor do checksum ao vivo, se houver.

* `Create_options`

  Opções extras usadas com `CREATE TABLE`.

  `Create_options` mostra `partitioned` para uma tabela particionada.

  `Create_options` mostra a cláusula `ENCRYPTION` para espaços de tabelas por arquivo se a tabela estiver criptografada ou se o criptograma especificado for diferente do criptograma do esquema. A cláusula de criptografia não é mostrada para tabelas criadas em espaços de tabelas gerais. Para identificar espaços de tabelas criptografados por arquivo e gerais, consulte a coluna `INNODB_TABLESPACES` `ENCRYPTION`.

  Ao criar uma tabela com o modo estrito desativado, o formato de linha padrão do motor de armazenamento é usado se o formato de linha especificado não for suportado. O formato de linha real da tabela é relatado na coluna `Row_format`. `Create_options` mostra o formato de linha especificado na instrução `CREATE TABLE`.

  Ao alterar o motor de armazenamento de uma tabela, as opções da tabela que não são aplicáveis ao novo motor de armazenamento são mantidas na definição da tabela para permitir a reversão da tabela com suas opções previamente definidas para o motor de armazenamento original, se necessário. `Create_options` pode mostrar opções retidas.

* `Comment`

  O comentário usado ao criar a tabela (ou informações sobre o motivo pelo qual o MySQL não conseguiu acessar as informações da tabela).

##### Notas

* Para tabelas `InnoDB`, `SHOW TABLE STATUS` não fornece estatísticas precisas, exceto pelo tamanho físico reservado pela tabela. O número de linhas é apenas uma estimativa aproximada usada na otimização do SQL.

* Para as tabelas `NDB`, o resultado desta declaração mostra os valores apropriados para as colunas `Avg_row_length` e `Data_length`, com a exceção de que as colunas `BLOB` não são consideradas.

* Para as tabelas `NDB`, `Data_length` inclui dados armazenados na memória principal apenas; as colunas `Max_data_length` e `Data_free` se aplicam aos dados em disco.

* Para as tabelas de dados em disco do NDB Cluster, `Max_data_length` mostra o espaço alocado para a parte em disco de uma tabela ou fragmento de dados em disco. (O uso do recurso de memória em memória é reportado pela coluna `Data_length`.)

* Para as tabelas `MEMORY`, os valores de `Data_length`, `Max_data_length` e `Index_length` aproximam a quantidade real de memória alocada. O algoritmo de alocação reserva memória em grandes quantidades para reduzir o número de operações de alocação.

* Para as visualizações, a maioria das colunas exibidas pelo `SHOW TABLE STATUS` é 0 ou `NULL`, exceto que `Name` indica o nome da visualização, `Create_time` indica o tempo de criação e `Comment` diz `VIEW`.

As informações da tabela também estão disponíveis na tabela `INFORMATION_SCHEMA` `TABLES`. Veja a Seção 28.3.44, “A Tabela INFORMATION\_SCHEMA”.