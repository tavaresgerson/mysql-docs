## 3.6 Preparar a sua instalação para a atualização

Antes de atualizar para a versão mais recente do MySQL 8.4, certifique-se da prontidão de atualização de sua instância de servidor MySQL 8.3 ou MySQL 8.4 atual, realizando as verificações preliminares descritas abaixo. Caso contrário, o processo de atualização pode falhar.

Dicas

Considere usar o utilitário de verificação de atualização do MySQL Shell que permite verificar se as instâncias do servidor MySQL estão prontas para atualização. Você pode selecionar uma versão do MySQL Server de destino para a qual planeja atualizar, variando do MySQL Server 8.0.11 até o número de versão do MySQL Server que corresponde ao número de versão atual do MySQL Shell. O utilitário de verificação de atualização realiza as verificações automatizadas que são relevantes para a versão de destino especificada e aconselha você sobre outras verificações relevantes que você deve fazer manualmente. O verificador de atualização funciona para todas as versões de correção de bugs, inovação e LTS do MySQL. As instruções de instalação para o MySQL Shell podem ser encontradas aqui.

Verificações preliminares:

1. As seguintes questões não devem estar presentes:

   - Não devem existir tabelas que utilizem tipos ou funções de dados obsoletos.
   - Não deve haver arquivos órfãos `.frm`.
   - Os gatilhos não devem ter um definidor em falta ou vazio ou um contexto de criação inválido (indicado pelos atributos `character_set_client`, `collation_connection`, `Database Collation` exibidos pela tabela `SHOW TRIGGERS` ou \[\[PH\_CODE\_PH\_CODE\_5]]).

   Para verificar estes problemas, execute este comando:

   ```bash
   mysqlcheck -u root -p --all-databases --check-upgrade
   ```

   Se o `mysqlcheck` informar algum erro, corrija os problemas.
2. Não deve haver tabelas particionadas que usem um motor de armazenamento que não tenha suporte de particionamento nativo. Para identificar tais tabelas, execute esta consulta:

   ```
   SELECT TABLE_SCHEMA, TABLE_NAME
       FROM INFORMATION_SCHEMA.TABLES
       WHERE ENGINE NOT IN ('innodb', 'ndbcluster')
           AND CREATE_OPTIONS LIKE '%partitioned%';
   ```

   Qualquer tabela relatada pela consulta deve ser alterada para usar `InnoDB` ou ser não particionada. Para alterar um mecanismo de armazenamento de tabela para `InnoDB`, execute esta instrução:

   ```
   ALTER TABLE table_name ENGINE = INNODB;
   ```

   Para obter informações sobre a conversão de tabelas `MyISAM` para `InnoDB`, consulte a Seção 17.6.1.5, "Conversão de tabelas do MyISAM para o InnoDB".

   Para tornar uma tabela particionada não particionada, execute esta instrução:

   ```
   ALTER TABLE table_name REMOVE PARTITIONING;
   ```
3. Algumas palavras-chave podem ser reservadas no MySQL 8.4 que não foram reservadas anteriormente. Veja Seção 11.3, "Palavras-chave e Palavras Reservadas". Isso pode fazer com que palavras usadas anteriormente como identificadores se tornem ilegais. Para corrigir as instruções afetadas, use citações de identificador. Veja Seção 11.2, "Nomes de Objetos de Esquema".
4. Não deve haver tabelas no banco de dados do sistema MySQL 8.3 `mysql` que tenham o mesmo nome de uma tabela usada pelo dicionário de dados MySQL 8.4. Para identificar tabelas com esses nomes, execute esta consulta:

   ```
   SELECT TABLE_SCHEMA, TABLE_NAME
   FROM INFORMATION_SCHEMA.TABLES
   WHERE
       LOWER(TABLE_SCHEMA) = 'mysql'
       AND
       LOWER(TABLE_NAME) IN
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

   Qualquer tabela relatada pela consulta deve ser descartada ou renomeada (use `RENAME TABLE`). Isso também pode implicar alterações nas aplicações que usam as tabelas afetadas.
5. Não deve haver tabelas que tenham nomes de restrição de chave estrangeira com mais de 64 caracteres. Use esta consulta para identificar tabelas com nomes de restrição que são muito longos:

   ```
   SELECT TABLE_SCHEMA, TABLE_NAME
   FROM INFORMATION_SCHEMA.TABLES
   WHERE TABLE_NAME IN
     (SELECT LEFT(SUBSTR(ID,INSTR(ID,'/')+1),
                  INSTR(SUBSTR(ID,INSTR(ID,'/')+1),'_ibfk_')-1)
      FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN
      WHERE LENGTH(SUBSTR(ID,INSTR(ID,'/')+1))>64);
   ```

   Para uma tabela com um nome de restrição que exceda 64 caracteres, solte a restrição e adicione-a novamente com o nome de restrição que não exceda 64 caracteres (use `ALTER TABLE`).
6. Não deve haver modos SQL obsoletos definidos pela variável de sistema `sql_mode`. Tentando usar um modo SQL obsoleto impede o MySQL 8.4 de iniciar. Aplicativos que usam modos SQL obsoletos devem ser revisados para evitá-los.
7. Apenas atualize uma instância do servidor MySQL que tenha sido fechada corretamente. Se a instância fechar inesperadamente, reinicie a instância e feche-a com `innodb_fast_shutdown=0` antes da atualização.
8. Não deve haver visualizações com nomes de colunas explicitamente definidos que excedam 64 caracteres (visualizações com nomes de colunas até 255 caracteres foram permitidos no MySQL 5.7). Para evitar erros de atualização, tais visualizações devem ser alteradas antes da atualização. Atualmente, o único método de identificar visualizações com nomes de colunas que excedem 64 caracteres é inspecionar a definição de visualização usando `SHOW CREATE VIEW`. Você também pode inspecionar as definições de visualização consultando a tabela de Esquema de Informação `VIEWS`.
9. Não deve haver tabelas ou procedimentos armazenados com elementos de coluna individuais `ENUM` ou `SET` que excedam os 255 caracteres ou 1020 bytes de comprimento. Antes do MySQL 8.4, o comprimento máximo combinado dos elementos de coluna `ENUM` ou `SET` era `64K`. No MySQL 8.4, o comprimento máximo de caracteres de um elemento de coluna individual `ENUM` ou `SET` é de 255 caracteres, e o comprimento máximo de bytes é de 1020 bytes. (O limite de 1020 bytes suporta caracteres multibyte). Antes de atualizar para o MySQL 8.0, modifique qualquer conjunto de elementos de coluna `ENUM` ou `SET` que excedam os novos limites. Fazer isso causa o fracasso da atualização com um erro.
10. Sua instalação do MySQL 8.3 não deve usar recursos que não são suportados pelo MySQL 8.4.

    Algumas opções de inicialização do servidor e variáveis do sistema foram removidas no MySQL 8.4.
11. Se você pretende alterar a configuração de `lower_case_table_names` para 1 no momento da atualização, certifique-se de que os nomes de esquema e de tabela são minúsculos antes da atualização. Caso contrário, pode ocorrer uma falha devido a uma incompatibilidade de letras maiúsculas de um esquema ou nome de tabela. Você pode usar as seguintes consultas para verificar se os nomes de esquema e de tabela contêm caracteres maiúsculos:

    ```
    mysql> select TABLE_NAME, if(sha(TABLE_NAME) !=sha(lower(TABLE_NAME)),'Yes','No') as UpperCase from information_schema.tables;
    ```

    Se `lower_case_table_names=1`, os nomes das tabelas e esquemas são verificados pelo processo de atualização para garantir que todos os caracteres são minúsculos. Se os nomes das tabelas ou esquemas forem encontrados para conter caracteres maiúsculos, o processo de atualização falha com um erro.

    ::: info Note

    Não é recomendado alterar a configuração `lower_case_table_names` no momento da atualização.

    :::

Se a atualização para o MySQL 8.4 falhar devido a qualquer um dos problemas descritos acima, o servidor reverterá todas as alterações no diretório de dados. Neste caso, remova todos os arquivos de registro de redirecionamento e reinicie o servidor MySQL 8.3 no diretório de dados existente para corrigir os erros. Os arquivos de registro de redirecionamento (`ib_logfile*`) residem no diretório de dados do MySQL por padrão. Depois que os erros forem corrigidos, execute um desligamento lento (definindo `innodb_fast_shutdown=0`) antes de tentar a atualização novamente.
