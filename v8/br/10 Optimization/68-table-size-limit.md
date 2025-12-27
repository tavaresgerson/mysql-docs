### 10.4.6 Limites de Tamanho de Tabelas

O tamanho máximo efetivo de uma tabela em bancos de dados MySQL é geralmente determinado pelas restrições do sistema operacional em relação ao tamanho dos arquivos, e não pelos limites internos do MySQL. Para obter informações atualizadas sobre os limites de tamanho de arquivo do sistema operacional, consulte a documentação específica do seu sistema operacional.

Usuários do Windows, observe que o FAT e o VFAT (FAT32) *não* são considerados adequados para uso produtivo com o MySQL. Use o NTFS.

Se você encontrar um erro de tabela cheia, há várias razões pelas quais isso pode ter ocorrido:

* O disco pode estar cheio.
* Você está usando tabelas `InnoDB` e esgotou o espaço em um arquivo de espaço de tabelas `InnoDB`. O tamanho máximo do espaço de tabela também é o tamanho máximo para uma tabela. Para limites de tamanho de espaço de tabela, consulte a Seção 17.21, “Limites do InnoDB”.

* Você atingiu um limite de tamanho de arquivo do sistema operacional. Por exemplo, você está usando tabelas `MyISAM` em um sistema operacional que suporta arquivos de até 2 GB de tamanho e atingiu esse limite para o arquivo de dados ou arquivo de índice.
* Você está usando uma tabela `MyISAM` e o espaço necessário para a tabela excede o permitido pelo tamanho do ponteiro interno. `MyISAM` permite que os arquivos de dados e índice cresçam até 256 TB por padrão, mas esse limite pode ser alterado até o tamanho máximo permitido de 65.536 TB (2567 − 1 bytes).

* Se você precisar de uma tabela `MyISAM` maior que o limite padrão e o seu sistema operacional suportar arquivos grandes, a instrução `CREATE TABLE` suporta as opções `AVG_ROW_LENGTH` e `MAX_ROWS`. Consulte a Seção 15.1.20, “Instrução CREATE TABLE”. O servidor usa essas opções para determinar o tamanho máximo permitido para uma tabela.

* Se o tamanho do ponteiro for muito pequeno para uma tabela existente, você pode alterar as opções com `ALTER TABLE` para aumentar o tamanho máximo permitido de uma tabela. Consulte a Seção 15.1.9, “Instrução ALTER TABLE”.

```
  ALTER TABLE tbl_name MAX_ROWS=1000000000 AVG_ROW_LENGTH=nnn;
  ```

Você precisa especificar `AVG_ROW_LENGTH` apenas para tabelas com colunas `BLOB` ou `TEXT`; nesse caso, o MySQL não pode otimizar o espaço necessário com base apenas no número de linhas.

Para alterar o limite de tamanho padrão para tabelas `MyISAM`, defina o `myisam_data_pointer_size`, que define o número de bytes usados para ponteiros internos de linha. O valor é usado para definir o tamanho do ponteiro para novas tabelas se você não especificar a opção `MAX_ROWS`. O valor de `myisam_data_pointer_size` pode variar de 2 a 7. Por exemplo, para tabelas que usam o formato de armazenamento dinâmico, um valor de 4 permite tabelas de até 4 GB; um valor de 6 permite tabelas de até 256 TB. Tabelas que usam o formato de armazenamento fixo têm um comprimento de dados máximo maior. Para características de formato de armazenamento, consulte a Seção 18.2.3, “Formatos de Armazenamento de Tabelas MyISAM”.

Você pode verificar os tamanhos de dados e índices máximos usando essa instrução:

```
  SHOW TABLE STATUS FROM db_name LIKE 'tbl_name';
  ```

Você também pode usar `myisamchk -dv /caminho/para/arquivo-de-índice-da-tabela`. Veja a Seção 15.7.7, “Instruções SHOW”, ou  Seção 6.6.4, “myisamchk — Ferramenta de Manutenção de Tabelas MyISAM”.

Outras maneiras de contornar os limites de tamanho de arquivo para tabelas `MyISAM` são as seguintes:

+ Se sua tabela grande for apenas de leitura, você pode usar `myisampack` para comprá-la. `myisampack` geralmente comprime uma tabela em pelo menos 50%, então você pode ter, na verdade, tabelas muito maiores. `myisampack` também pode unir várias tabelas em uma única tabela. Veja a Seção 6.6.6, “myisampack — Gerar Tabelas MyISAM Compridas e Apenas de Leitura”.

+ O MySQL inclui uma biblioteca `MERGE` que permite lidar com uma coleção de tabelas `MyISAM` que têm estrutura idêntica a uma única tabela `MERGE`. Veja a Seção 18.7, “O Motor de Armazenamento MERGE”.