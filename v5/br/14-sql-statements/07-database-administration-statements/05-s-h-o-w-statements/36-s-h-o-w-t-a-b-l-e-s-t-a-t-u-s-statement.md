#### 13.7.5.36 Declaração de Status da Tabela

```sql
SHOW TABLE STATUS
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW TABLE STATUS` funciona como `SHOW TABLES`, mas fornece uma grande quantidade de informações sobre cada tabela que não é `TEMPORARY`. Você também pode obter essa lista usando o comando **mysqlshow --status *`db_name`***. A cláusula `LIKE` (funções de comparação de strings#operador_like), se presente, indica quais nomes de tabela devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido em Seção 24.8, “Extensões para Declarações SHOW”.

Essa declaração também exibe informações sobre visualizações.

A saída `SHOW TABLE STATUS` tem essas colunas:

- `Nome`

  O nome da tabela.

- Motor

  O mecanismo de armazenamento para a tabela. Veja Capítulo 14, *O Mecanismo de Armazenamento InnoDB* e Capítulo 15, *Mecanismos de Armazenamento Alternativos*.

  Para tabelas particionadas, o `Engine` mostra o nome do motor de armazenamento usado por todas as partições.

- `Versão`

  O número da versão do arquivo `.frm` da tabela.

- `Row_format`

  O formato de armazenamento em linha (`Fixed`, `Dynamic`, `Compressed`, `Redundant`, `Compact`). Para as tabelas `MyISAM`, `Dynamic` corresponde ao que o **myisamchk -dvv** relata como `Packed`. O formato de tabela `InnoDB` é `Redundant` ou `Compact` ao usar o formato de arquivo `Antelope`, ou `Compressed` ou `Dynamic` ao usar o formato de arquivo `Barracuda`.

- `Linhas`

  O número de linhas. Alguns motores de armazenamento, como `MyISAM`, armazenam o número exato. Para outros motores de armazenamento, como `InnoDB`, esse valor é uma aproximação e pode variar de até 40% a 50% do valor real. Nesses casos, use `SELECT COUNT(*)` para obter um contagem precisa.

  O valor `Rows` é `NULL` para as tabelas do `INFORMATION_SCHEMA`.

  Para as tabelas de `InnoDB`, o número de linhas é apenas uma estimativa aproximada usada na otimização do SQL. (Isso também é verdadeiro se a tabela de `InnoDB` estiver particionada.)

- `Avg_row_length`

  O comprimento médio da linha.

  Consulte as notas no final desta seção para obter informações relacionadas.

- `Data_length`

  Para `MyISAM`, `Data_length` é o comprimento do arquivo de dados, em bytes.

  Para o `InnoDB`, `Data_length` é a quantidade aproximada de espaço alocada para o índice agrupado, em bytes. Especificamente, é o tamanho do índice agrupado, em páginas, multiplicado pelo tamanho da página do `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

- `Max_data_length`

  Para `MyISAM`, `Max_data_length` é o comprimento máximo do arquivo de dados. Esse é o número total de bytes de dados que podem ser armazenados na tabela, considerando o tamanho do ponteiro de dados utilizado.

  Não utilizado para `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

- `Index_length`

  Para `MyISAM`, `Index_length` é o comprimento do arquivo de índice, em bytes.

  Para o `InnoDB`, `Index_length` é a quantidade aproximada de espaço alocada para índices não agrupados, em bytes. Especificamente, é a soma dos tamanhos dos índices não agrupados, em páginas, multiplicada pelo tamanho da página do `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

- `Data_free`

  O número de bytes alocados, mas não utilizados.

  As tabelas `InnoDB` relatam o espaço livre do tablespace ao qual a tabela pertence. Para uma tabela localizada no tablespace compartilhado, esse é o espaço livre do tablespace compartilhado. Se você estiver usando vários tablespaces e a tabela tiver seu próprio tablespace, o espaço livre é apenas para essa tabela. Espaço livre significa o número de bytes em extensões completamente livres, menos uma margem de segurança. Mesmo que o espaço livre seja exibido como 0, pode ser possível inserir linhas, desde que novas extensões não precisem ser alocadas.

  Para o NDB Cluster, `Data_free` mostra o espaço alocado no disco para, mas não utilizado por, uma tabela ou fragmento de dados de disco. (O uso do recurso de dados em memória é relatado pela coluna `Data_length`.)

  Para tabelas particionadas, esse valor é apenas uma estimativa e pode não ser absolutamente correto. Um método mais preciso de obter essas informações nesses casos é consultar a tabela `INFORMATION_SCHEMA [`PARTITIONS\`]\(information-schema-partitions-table.html), conforme mostrado neste exemplo:

  ```sql
  SELECT SUM(DATA_FREE)
      FROM  INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_SCHEMA = 'mydb'
      AND   TABLE_NAME   = 'mytable';
  ```

  Para mais informações, consulte Seção 24.3.16, “A Tabela INFORMATION_SCHEMA PARTITIONS”.

- `Auto_increment`

  O próximo valor `AUTO_INCREMENT`.

- `Create_time`

  Quando a tabela foi criada.

- `Update_time`

  Quando o arquivo de dados foi atualizado pela última vez. Para alguns motores de armazenamento, esse valor é `NULL`. Por exemplo, o `InnoDB` armazena várias tabelas em seu espaço de tabelas do sistema e o timestamp do arquivo de dados não se aplica. Mesmo com o modo arquivo por tabela com cada tabela `InnoDB` em um arquivo `.ibd` separado, a alteração de bufferização pode atrasar a escrita no arquivo de dados, então o tempo de modificação do arquivo é diferente do tempo da última inserção, atualização ou exclusão. Para o `MyISAM`, o timestamp do arquivo de dados é usado; no entanto, no Windows, o timestamp não é atualizado por atualizações, então o valor é impreciso.

  `Update_time` exibe um valor de marcação de tempo para a última atualização (`UPDATE`) (`update.html`), (`INSERT`) (`insert.html`) ou (`DELETE`) realizada em tabelas `InnoDB` que não estão particionadas. Para o MVCC, o valor de marcação de tempo reflete o horário do `COMMIT` (`commit.html`), que é considerado o último horário de atualização. Os timestamps não são persistidos quando o servidor é reiniciado ou quando a tabela é removida do cache do dicionário de dados `InnoDB`.

  A coluna `Update_time` também exibe essa informação para tabelas `InnoDB` particionadas.

- `Check_time`

  Quando a tabela foi verificada pela última vez. Nem todos os motores de armazenamento são atualizados dessa vez, caso contrário, o valor é sempre `NULL`.

  Para tabelas particionadas de `InnoDB`, `Check_time` é sempre `NULL`.

- `Colaboração`

  A collation padrão da tabela. A saída não lista explicitamente o conjunto de caracteres padrão da tabela, mas o nome da collation começa com o nome do conjunto de caracteres.

- `Checksum`

  O valor do checksum ao vivo, se houver.

- `Create_options`

  Opções extras usadas com `CREATE TABLE`.

  `Create_options` mostra `partitioned` para uma tabela particionada.

  `Create_options` exibe a opção `ENCRYPTION` especificada ao criar ou alterar um espaço de tabela por arquivo.

  Ao criar uma tabela com o modo estrito desativado, o formato de linha padrão do mecanismo de armazenamento é usado se o formato de linha especificado não for suportado. O formato de linha real da tabela é relatado na coluna `Row_format`. `Create_options` mostra o formato de linha que foi especificado na instrução `CREATE TABLE`.

  Ao alterar o motor de armazenamento de uma tabela, as opções da tabela que não são aplicáveis ao novo motor de armazenamento são mantidas na definição da tabela para permitir a reversão da tabela com suas opções previamente definidas para o motor de armazenamento original, se necessário. `Create_options` pode exibir opções retidas.

- `Comentário`

  O comentário usado ao criar a tabela (ou informações sobre o motivo pelo qual o MySQL não conseguiu acessar as informações da tabela).

##### Notas

- Para as tabelas do `InnoDB`, o comando `SHOW TABLE STATUS` não fornece estatísticas precisas, exceto pelo tamanho físico reservado pela tabela. O número de linhas é apenas uma estimativa aproximada usada na otimização do SQL.

- Para as tabelas `NDB`, o resultado desta declaração mostra valores apropriados para as colunas `Avg_row_length` e `Data_length`, com a exceção de que as colunas `BLOB` não são consideradas.

- Para as tabelas ``NDB`, `Data_length`inclui dados armazenados apenas na memória principal; as colunas`Max_data_length`e`Data_free\` se aplicam aos dados em disco.

- Para as tabelas de dados de disco do NDB Cluster, o `Max_data_length` mostra o espaço alocado para a parte de disco de uma tabela ou fragmento de Dados de disco. (O uso do recurso de dados em memória é relatado pela coluna `Data_length`.)

- Para as tabelas `MEMORY`, os valores `Data_length`, `Max_data_length` e `Index_length` aproximam a quantidade real de memória alocada. O algoritmo de alocação reserva memória em grandes quantidades para reduzir o número de operações de alocação.

- Para as visualizações, todas as colunas exibidas por `SHOW TABLE STATUS` são `NULL`, exceto que `Nome` indica o nome da visualização e `Comentário` diz `VISUALIZAÇÃO`.

As informações sobre as tabelas também estão disponíveis na tabela `INFORMATION_SCHEMA` `TABLES`. Veja Seção 24.3.25, “A Tabela INFORMATION_SCHEMA TABLES”.
