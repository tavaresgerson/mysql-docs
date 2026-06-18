### 8.4.6 Limites de tamanho da tabela

O tamanho máximo efetivo da tabela para bancos de dados MySQL é geralmente determinado pelas restrições do sistema operacional em relação ao tamanho dos arquivos, e não pelos limites internos do MySQL. Para obter informações atualizadas sobre os limites de tamanho de arquivo do sistema operacional, consulte a documentação específica do seu sistema operacional.

Usuários do Windows, por favor, observe que o FAT e o VFAT (FAT32) *não* são considerados adequados para uso produtivo com o MySQL. Use o NTFS.

Se você encontrar um erro de tabela cheia, há várias razões pelas quais isso pode ter ocorrido:

- O disco pode estar cheio.

- Você está usando tabelas `InnoDB` e esgotou o espaço em um arquivo de espaço de tabelas `InnoDB`. O tamanho máximo do espaço de tabelas também é o tamanho máximo de uma tabela. Para limites de tamanho de espaço de tabelas, consulte a Seção 14.23, “Limites do InnoDB”.

  Geralmente, a partição de tabelas em vários arquivos de espaço de tabela é recomendada para tabelas maiores que 1 TB de tamanho.

- Você atingiu o limite de tamanho de arquivo do sistema operacional. Por exemplo, você está usando tabelas `MyISAM` em um sistema operacional que suporta arquivos com tamanho máximo de 2 GB e você atingiu esse limite para o arquivo de dados ou o arquivo de índice.

- Você está usando uma tabela `MyISAM` e o espaço necessário para a tabela excede o permitido pelo tamanho do ponteiro interno. `MyISAM` permite que os arquivos de dados e índices cresçam até 256TB por padrão, mas esse limite pode ser alterado até o tamanho máximo permitido de 65.536TB (2567 − 1 bytes).

  Se você precisar de uma tabela `MyISAM` maior que o limite padrão e o seu sistema operacional suportar arquivos grandes, a instrução `CREATE TABLE` suporta as opções `AVG_ROW_LENGTH` e `MAX_ROWS`. Veja a Seção 13.1.18, “Instrução CREATE TABLE”. O servidor usa essas opções para determinar o tamanho máximo de uma tabela permitida.

  Se o tamanho do ponteiro for muito pequeno para uma tabela existente, você pode alterar as opções com `ALTER TABLE` para aumentar o tamanho máximo permitido de uma tabela. Veja a Seção 13.1.8, “Instrução ALTER TABLE”.

  ```sql
  ALTER TABLE tbl_name MAX_ROWS=1000000000 AVG_ROW_LENGTH=nnn;
  ```

  Você precisa especificar `AVG_ROW_LENGTH` apenas para tabelas com colunas `BLOB` ou `TEXT`; nesse caso, o MySQL não pode otimizar o espaço necessário com base apenas no número de linhas.

  Para alterar o limite de tamanho padrão para tabelas `MyISAM`, defina o `myisam_data_pointer_size`, que define o número de bytes usados para ponteiros internos de linha. O valor é usado para definir o tamanho do ponteiro para novas tabelas se você não especificar a opção `MAX_ROWS`. O valor de `myisam_data_pointer_size` pode variar de 2 a 7. Por exemplo, para tabelas que usam o formato de armazenamento dinâmico, um valor de 4 permite tabelas de até 4 GB; um valor de 6 permite tabelas de até 256 TB. Tabelas que usam o formato de armazenamento fixo têm um comprimento de dados máximo maior. Para características de formato de armazenamento, consulte a Seção 15.2.3, “Formatos de Armazenamento de Tabelas MyISAM”.

  Você pode verificar o tamanho máximo de dados e índices usando esta declaração:

  ```sql
  SHOW TABLE STATUS FROM db_name LIKE 'tbl_name';
  ```

  Você também pode usar **myisamchk -dv /caminho/para/arquivo-de-índice-da-tabela**. Veja a Seção 13.7.5, “Declarações SHOW”, ou a Seção 4.6.3, “myisamchk — Ferramenta de Manutenção de Tabelas MyISAM”.

  Outras maneiras de contornar os limites de tamanho de arquivo para tabelas `MyISAM` são as seguintes:

  - Se a sua tabela grande for apenas de leitura, você pode usar o **myisampack** para comprá-la. O **myisampack** geralmente comprime uma tabela em pelo menos 50%, então você pode ter, na verdade, tabelas muito maiores. O **myisampack** também pode unir várias tabelas em uma única tabela. Veja a Seção 4.6.5, “**myisampack** — Gerar tabelas MyISAM comprimidas e apenas de leitura”.

  - O MySQL inclui uma biblioteca `MERGE` que permite gerenciar uma coleção de tabelas `MyISAM` que têm estrutura idêntica a uma única tabela `MERGE`. Veja a Seção 15.7, “O Motor de Armazenamento MERGE”.

- Você está usando o mecanismo de armazenamento `MEMORY` (`HEAP`); nesse caso, você precisa aumentar o valor da variável de sistema `max_heap_table_size`. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.
