### 8.4.6 Limites de Tamanho de Tabela

O tamanho máximo efetivo de uma tabela para databases MySQL é geralmente determinado por restrições do sistema operacional sobre o tamanho dos arquivos, e não por limites internos do MySQL. Para informações atualizadas sobre limites de tamanho de arquivos do sistema operacional, consulte a documentação específica do seu sistema operacional.

Usuários do Windows, observem que FAT e VFAT (FAT32) *não* são considerados adequados para uso em produção com MySQL. Utilize NTFS em seu lugar.

Se você encontrar um erro de tabela cheia (*full-table error*), existem várias razões pelas quais isso pode ter ocorrido:

* O disco pode estar cheio.
* Você está usando tabelas `InnoDB` e esgotou o espaço em um arquivo de `tablespace` do `InnoDB`. O tamanho máximo do `tablespace` é também o tamanho máximo para uma tabela. Para limites de tamanho de `tablespace`, consulte a Seção 14.23, “InnoDB Limits”.

  Geralmente, o particionamento de tabelas em múltiplos arquivos de `tablespace` é recomendado para tabelas maiores que 1TB.

* Você atingiu um limite de tamanho de arquivo do sistema operacional. Por exemplo, você está usando tabelas `MyISAM` em um sistema operacional que suporta arquivos de até apenas 2GB e você atingiu este limite para o arquivo de dados ou arquivo de `Index`.

* Você está usando uma tabela `MyISAM` e o espaço requerido para a tabela excede o que é permitido pelo tamanho interno do `pointer`. Por padrão, o `MyISAM` permite que arquivos de dados e `Index` cresçam até 256TB, mas este limite pode ser alterado até o tamanho máximo permitido de 65.536TB (2567 − 1 bytes).

  Se você precisa de uma tabela `MyISAM` maior do que o limite padrão e seu sistema operacional suporta arquivos grandes, a instrução `CREATE TABLE` suporta as opções `AVG_ROW_LENGTH` e `MAX_ROWS`. Consulte a Seção 13.1.18, “CREATE TABLE Statement”. O `server` utiliza estas opções para determinar o quão grande uma tabela pode ser permitida.

  Se o tamanho do `pointer` for muito pequeno para uma tabela existente, você pode alterar as opções com `ALTER TABLE` para aumentar o tamanho máximo permitido da tabela. Consulte a Seção 13.1.8, “ALTER TABLE Statement”.

  ```sql
  ALTER TABLE tbl_name MAX_ROWS=1000000000 AVG_ROW_LENGTH=nnn;
  ```

  Você deve especificar `AVG_ROW_LENGTH` apenas para tabelas com colunas `BLOB` ou `TEXT`; neste caso, o MySQL não consegue otimizar o espaço necessário baseado apenas no número de linhas.

  Para alterar o limite de tamanho padrão para tabelas `MyISAM`, defina a variável `myisam_data_pointer_size`, que estabelece o número de bytes usados para `row pointers` internos. O valor é usado para definir o tamanho do `pointer` para novas tabelas se você não especificar a opção `MAX_ROWS`. O valor de `myisam_data_pointer_size` pode variar de 2 a 7. Por exemplo, para tabelas que usam o formato de armazenamento dinâmico, um valor de 4 permite tabelas de até 4GB; um valor de 6 permite tabelas de até 256TB. Tabelas que usam o formato de armazenamento fixo têm um comprimento máximo de dados maior. Para características de formato de armazenamento, consulte a Seção 15.2.3, “MyISAM Table Storage Formats”.

  Você pode verificar os tamanhos máximos de dados e `Index` usando esta instrução:

  ```sql
  SHOW TABLE STATUS FROM db_name LIKE 'tbl_name';
  ```

  Você também pode usar **myisamchk -dv /caminho/para/o-arquivo-index-da-tabela**. Consulte a Seção 13.7.5, “SHOW Statements”, ou a Seção 4.6.3, “myisamchk — MyISAM Table-Maintenance Utility”.

  Outras maneiras de contornar os limites de tamanho de arquivo para tabelas `MyISAM` são as seguintes:

  + Se sua tabela grande for somente leitura (*read only*), você pode usar **myisampack** para compactá-la. O **myisampack** geralmente compacta uma tabela em pelo menos 50%, para que você possa ter, na prática, tabelas muito maiores. O **myisampack** também pode unir múltiplas tabelas em uma única tabela. Consulte a Seção 4.6.5, “myisampack — Generate Compressed, Read-Only MyISAM Tables”.

  + O MySQL inclui uma biblioteca `MERGE` que permite lidar com uma coleção de tabelas `MyISAM` que possuem estrutura idêntica como uma única tabela `MERGE`. Consulte a Seção 15.7, “The MERGE Storage Engine”.

* Você está usando o `storage engine` `MEMORY` (`HEAP`); neste caso, você precisa aumentar o valor da variável de sistema `max_heap_table_size`. Consulte a Seção 5.1.7, “Server System Variables”.