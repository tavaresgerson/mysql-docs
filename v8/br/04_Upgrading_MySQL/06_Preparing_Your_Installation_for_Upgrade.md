## 3.6 Preparando sua instalação para atualização

Antes de fazer a atualização para a versão mais recente do MySQL 8.0, certifique-se de que a instância do servidor atual do MySQL 5.7 ou MySQL 8.0 está pronta para a atualização, realizando as verificações preliminares descritas abaixo. Caso contrário, o processo de atualização pode falhar.

Dica

Considere usar o utilitário de verificação de atualização do MySQL Shell, que permite verificar se as instâncias do servidor MySQL estão prontas para atualização. Você pode selecionar uma versão do MySQL Server de destino para a qual planeja fazer a atualização, variando do MySQL Server 8.0.11 até o número de versão do MySQL Server que corresponde ao número atual do lançamento do MySQL Shell. O utilitário de verificação de atualização realiza as verificações automatizadas relevantes para a versão de destino especificada e aconselha você sobre as verificações adicionais relevantes que você deve realizar manualmente. O verificador de atualização funciona para todos os lançamentos Bugfix, Innovation e LTS do MySQL. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

Verificações preliminares:

1. Não devem estar presentes os seguintes problemas:

* Não deve haver tabelas que utilizem tipos de dados ou funções obsoletos.

A atualização in-place para o MySQL 8.0 não é suportada se as tabelas contiverem colunas temporais antigas no formato pré-5.6.4 (colunas `TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de frações de segundo). Se suas tabelas ainda usam o formato antigo da coluna temporal, atualize-as usando `REPAIR TABLE` antes de tentar uma atualização in-place para o MySQL 8.0. Para mais informações, consulte Alterações no servidor, no Manual de referência do MySQL 5.7.

* Não deve haver arquivos órfãos `.frm`.
* Os gatilhos não devem ter um definidor ausente ou vazio ou um contexto de criação inválido (indicado pelos atributos `character_set_client`, `collation_connection`, `Database Collation` exibidos pelo `SHOW TRIGGERS` ou a tabela `INFORMATION_SCHEMA` `TRIGGERS`). Qualquer gatilho desse tipo deve ser descartado e restaurado para corrigir o problema.

Para verificar esses problemas, execute este comando:

   ```
   mysqlcheck -u root -p --all-databases --check-upgrade
   ```

Se o **mysqlcheck** relatar quaisquer erros, corrija os problemas.

2. Não deve haver tabelas particionadas que utilizem um mecanismo de armazenamento que não tenha suporte nativo para particionamento. Para identificar essas tabelas, execute esta consulta:

   ```
   SELECT TABLE_SCHEMA, TABLE_NAME
   FROM INFORMATION_SCHEMA.TABLES
   WHERE ENGINE NOT IN ('innodb', 'ndbcluster')
   AND CREATE_OPTIONS LIKE '%partitioned%';
   ```

Qualquer tabela relatada pela consulta deve ser alterada para usar `InnoDB` ou tornar-se não particionada. Para alterar o mecanismo de armazenamento de uma tabela para `InnoDB`, execute esta declaração:

   ```
   ALTER TABLE table_name ENGINE = INNODB;
   ```

Para obter informações sobre a conversão de tabelas `MyISAM` para `InnoDB`, consulte a Seção 17.6.1.5, “Conversão de tabelas de MyISAM para InnoDB”.

Para tornar uma tabela particionada não particionada, execute esta declaração:

   ```
   ALTER TABLE table_name REMOVE PARTITIONING;
   ```

3. Alguns termos-chave podem estar reservados no MySQL 8.0 que não estavam reservados anteriormente. Veja a Seção 11.3, “Keywords e Palavras Reservadas”. Isso pode fazer com que palavras anteriormente usadas como identificadores se tornem ilegais. Para corrigir as declarações afetadas, use a citação de identificadores. Veja a Seção 11.2, “Nomes de Objetos do Esquema”.

4. Não deve haver tabelas no banco de dados do sistema MySQL 5.7 `mysql` que tenham o mesmo nome que uma tabela usada pelo dicionário de dados do MySQL 8.0. Para identificar tabelas com esses nomes, execute esta consulta:

   ```
   SELECT TABLE_SCHEMA, TABLE_NAME
   FROM INFORMATION_SCHEMA.TABLES
   WHERE LOWER(TABLE_SCHEMA) = 'mysql'
   and LOWER(TABLE_NAME) IN
   (
   'catalogs',
   'character_sets',
   'check_constraints',
   'collations',
   'column_statistics',
   'column_type_elements',
   'columns',
   'dd_properties',
   'events',
   'foreign_key_column_usage',
   'foreign_keys',
   'index_column_usage',
   'index_partitions',
   'index_stats',
   'indexes',
   'parameter_type_elements',
   'parameters',
   'resource_groups',
   'routines',
   'schemata',
   'st_spatial_reference_systems',
   'table_partition_values',
   'table_partitions',
   'table_stats',
   'tables',
   'tablespace_files',
   'tablespaces',
   'triggers',
   'view_routine_usage',
   'view_table_usage'
   );
   ```

Qualquer tabela relatada pela consulta deve ser eliminada ou renomeada (use `RENAME TABLE`). Isso também pode exigir alterações em aplicativos que utilizam as tabelas afetadas.

5. Não deve haver tabelas com nomes de restrição de chave estrangeira com mais de 64 caracteres. Use esta consulta para identificar tabelas com nomes de restrição que são muito longos:

   ```
   SELECT TABLE_SCHEMA, TABLE_NAME
   FROM INFORMATION_SCHEMA.TABLES
   WHERE TABLE_NAME IN
     (SELECT LEFT(SUBSTR(ID,INSTR(ID,'/')+1),
                  INSTR(SUBSTR(ID,INSTR(ID,'/')+1),'_ibfk_')-1)
      FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN
      WHERE CHAR_LENGTH(SUBSTR(ID,INSTR(ID,'/')+1))>64);
   ```

Para uma tabela com um nome de restrição que exceda 64 caracteres, exclua a restrição e adicione-a novamente com um nome de restrição que não exceda 64 caracteres (use [[`ALTER TABLE`]](alter-table.html "15.1.9 ALTER TABLE Statement")).

6. Não deve haver modos de SQL obsoletos definidos pela variável de sistema `sql_mode`. Tentar usar um modo de SQL obsoleto impede que o MySQL 8.0 seja iniciado. As aplicações que usam modos de SQL obsoletos devem ser revisadas para evitar isso. Para informações sobre os modos de SQL removidos no MySQL 8.0, consulte Alterações no servidor.

7. Atualize apenas uma instância do servidor MySQL que foi corretamente desligada. Se a instância desligar inesperadamente, então reinicie a instância e desligue-a com `innodb_fast_shutdown=0` antes da atualização.

8. Não deve haver visualizações com nomes de colunas explicitamente definidos que excedam 64 caracteres (visualizações com nomes de colunas de até 255 caracteres eram permitidas no MySQL 5.7). Para evitar erros de atualização, essas visualizações devem ser alteradas antes da atualização. Atualmente, o único método para identificar visualizações com nomes de colunas que excedem 64 caracteres é inspecionar a definição da visualização usando `SHOW CREATE VIEW`. Você também pode inspecionar as definições de visualizações fazendo uma consulta à tabela do Esquema de Informações `VIEWS`.

Não deve haver tabelas ou procedimentos armazenados com elementos de coluna individuais `ENUM` ou `SET` que excedam 255 caracteres ou 1020 bytes de comprimento. Antes do MySQL 8.0, o comprimento combinado máximo de elementos de coluna `ENUM` ou `SET` era de 64K. No MySQL 8.0, o comprimento máximo de caracteres de um elemento de coluna individual `ENUM` ou `SET` é de 255 caracteres, e o comprimento máximo em bytes é de 1020 bytes. (O limite de 1020 bytes suporta conjuntos de caracteres multibyte). Antes de fazer a atualização para o MySQL 8.0, modifique quaisquer elementos de coluna `ENUM` ou `SET` que excedam os novos limites. Se não fizer isso, a atualização falhará com um erro.

10. Antes de fazer a atualização para o MySQL 8.0.13 ou superior, não deve haver partições de tabela que residam em espaços de tabela compartilhados `InnoDB`, que incluem o espaço de tabela do sistema e os espaços de tabela gerais. Identifique as partições de tabela em espaços de tabela compartilhados consultando `INFORMATION_SCHEMA`:

Se você está atualizando do MySQL 5.7, execute esta consulta:

    ```
    SELECT DISTINCT NAME, SPACE, SPACE_TYPE FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES
      WHERE NAME LIKE '%#P#%' AND SPACE_TYPE NOT LIKE 'Single';
    ```

Se você está atualizando a partir de uma versão anterior do MySQL 8.0, execute esta consulta:

    ```
    SELECT DISTINCT NAME, SPACE, SPACE_TYPE FROM INFORMATION_SCHEMA.INNODB_TABLES
      WHERE NAME LIKE '%#P#%' AND SPACE_TYPE NOT LIKE 'Single';
    ```

Mude as partições de tabelas de espaços de tabelas compartilhados para espaços de tabelas por arquivo usando `ALTER TABLE ... REORGANIZE PARTITION` e (alter-table.html "15.1.9 ALTER TABLE Statement"):

    ```
    ALTER TABLE table_name REORGANIZE PARTITION partition_name
      INTO (partition_definition TABLESPACE=innodb_file_per_table);
    ```

Não deve haver consultas e definições de programas armazenados do MySQL 8.0.12 ou versões anteriores que utilizem os qualificadores `ASC` ou `DESC` para cláusulas `GROUP BY`. Caso contrário, a atualização para o MySQL 8.0.13 ou versões posteriores pode falhar, assim como a replicação para servidores replicadores do MySQL 8.0.13 ou versões posteriores. Para obter detalhes adicionais, consulte Mudanças no SQL.

12. Sua instalação do MySQL 5.7 não deve usar recursos que não são suportados pelo MySQL 8.0. Quaisquer alterações aqui são necessariamente específicas da instalação, mas o exemplo a seguir ilustra o tipo de coisa a ser procurada:

Algumas opções de inicialização do servidor e variáveis do sistema foram removidas no MySQL 8.0. Consulte as Características removidas no MySQL 8.0 e [Seção 1.4, “Variáveis e opções do servidor e status adicionadas, obsoletas ou removidas no MySQL 8.0”][(added-deprecated-removed.html "1.4 Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 8.0")]. Se você usar alguma dessas opções, uma atualização requer alterações de configuração.

Exemplo: Como o dicionário de dados fornece informações sobre objetos do banco de dados, o servidor não verifica mais os nomes de diretórios no diretório de dados para encontrar bancos de dados. Consequentemente, a opção `--ignore-db-dir` é desnecessária e foi removida. Para lidar com isso, remova quaisquer instâncias de `--ignore-db-dir` da sua configuração de inicialização. Além disso, remova ou mova as subdiretórios dos diretórios de dados nomeados antes de fazer a atualização para o MySQL 8.0. (Alternativamente, deixe o servidor 8.0 adicionar esses diretórios ao dicionário de dados como bancos de dados, e então remova cada um desses bancos de dados usando `DROP DATABASE`.).

13. Se você pretende alterar o ajuste `lower_case_table_names` para 1 no momento da atualização, certifique-se de que os nomes de esquema e tabela estejam em letras minúsculas antes da atualização. Caso contrário, pode ocorrer uma falha devido a uma incompatibilidade de letras maiúsculas no nome do esquema ou tabela. Você pode usar as seguintes consultas para verificar se os nomes de esquema e tabela contêm caracteres maiúsculos:

    ```
    mysql> select TABLE_NAME, if(sha(TABLE_NAME) !=sha(lower(TABLE_NAME)),'Yes','No') as UpperCase from information_schema.tables;
    ```

A partir do MySQL 8.0.19, se os nomes de tabela e esquema `lower_case_table_names=1` são verificados pelo processo de atualização para garantir que todos os caracteres sejam minúsculos. Se os nomes de tabela ou esquema forem encontrados com caracteres em maiúsculas, o processo de atualização falha com um erro.

Nota

Não é recomendado alterar o ajuste `lower_case_table_names` no momento da atualização.

Se a atualização para o MySQL 8.0 falhar devido a qualquer um dos problemas descritos acima, o servidor reverte todas as alterações no diretório de dados. Neste caso, remova todos os arquivos de registro de revisão e reinicie o servidor MySQL 5.7 no diretório de dados existente para corrigir os erros. Os arquivos de registro de revisão (`ib_logfile*`) residem no diretório de dados do MySQL por padrão. Após os erros serem corrigidos, realize um desligamento lento (definindo `innodb_fast_shutdown=0`) antes de tentar a atualização novamente.