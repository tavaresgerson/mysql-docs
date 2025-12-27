## 3.6 Preparando sua instalação para atualização

Antes de atualizar para a versão mais recente do MySQL 9.5, certifique-se de que a instância do servidor MySQL 9.4 ou MySQL 8.4 atualizável está pronta para a atualização, realizando as verificações preliminares descritas abaixo. Caso contrário, o processo de atualização pode falhar.

Dica

Considere usar o utilitário de verificação de atualização do MySQL Shell, que permite verificar se as instâncias do servidor MySQL estão prontas para atualização. Você pode selecionar uma versão do MySQL Server de destino para a qual planeja fazer a atualização, variando de MySQL Server 8.0.11 até a versão do MySQL Server que corresponde ao número atual do lançamento do MySQL Shell. O utilitário de verificação de atualização realiza as verificações automatizadas relevantes para a versão de destino especificada e avisa sobre as verificações adicionais relevantes que você deve realizar manualmente. O utilitário de verificação de atualização funciona para todas as versões Bugfix, Innovation e LTS do MySQL. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

Verificações preliminares:

1. Os seguintes problemas não devem estar presentes:

   * Não deve haver tabelas que usem tipos de dados ou funções obsoletas.

   * Não deve haver arquivos `.frm` órfãos.
   * Os gatilhos não devem ter um definidor ausente ou vazio ou um contexto de criação inválido (indicado pelos atributos `character_set_client`, `collation_connection`, `Database Collation` exibidos por `SHOW TRIGGERS` ou a tabela `TRIGGERS` do `INFORMATION_SCHEMA`. Quaisquer gatilhos com esses problemas devem ser dumpados e restaurados para corrigir o problema.

Para verificar esses problemas, execute este comando:

```
   mysqlcheck -u root -p --all-databases --check-upgrade
   ```

Se o **mysqlcheck** relatar erros, corrija os problemas.

2. Não deve haver tabelas particionadas que usem um mecanismo de armazenamento que não tenha suporte nativo para particionamento. Para identificar essas tabelas, execute esta consulta:

   ```
   SELECT TABLE_SCHEMA, TABLE_NAME
       FROM INFORMATION_SCHEMA.TABLES
       WHERE ENGINE NOT IN ('innodb', 'ndbcluster')
           AND CREATE_OPTIONS LIKE '%partitioned%';
   ```

Qualquer tabela relatada pela consulta deve ser alterada para usar `InnoDB` ou tornar-se não particionada. Para alterar o motor de armazenamento de uma tabela para `InnoDB`, execute a seguinte instrução:

```
   ALTER TABLE table_name ENGINE = INNODB;
   ```

Para obter informações sobre a conversão de tabelas `MyISAM` para `InnoDB`, consulte a Seção 17.6.1.5, “Conversão de tabelas de MyISAM para InnoDB”.

Para tornar uma tabela particionada não particionada, execute a seguinte instrução:

```
   ALTER TABLE table_name REMOVE PARTITIONING;
   ```

3. Algumas palavras-chave podem estar reservadas no MySQL 9.5 que não estavam reservadas anteriormente. Consulte a Seção 11.3, “Palavras-chave e Palavras Reservadas”. Isso pode fazer com que palavras anteriormente usadas como identificadores se tornem ilegais. Para corrigir as declarações afetadas, use a citação de identificadores. Consulte a Seção 11.2, “Nomes de Objetos do Schema”.

4. Não deve haver tabelas no banco de dados do sistema `mysql` do MySQL 9.4 com o mesmo nome de uma tabela usada pelo dicionário de dados do MySQL 9.5. Para identificar tabelas com esses nomes, execute a seguinte consulta:

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

Quaisquer tabelas relatadas pela consulta devem ser excluídas ou renomeadas (use `RENAME TABLE`). Isso também pode envolver alterações em aplicativos que usam as tabelas afetadas.

5. Não deve haver tabelas que tenham nomes de restrições de chave estrangeira com mais de 64 caracteres. Use esta consulta para identificar tabelas com nomes de restrições que são muito longos:

```
   SELECT TABLE_SCHEMA, TABLE_NAME
   FROM INFORMATION_SCHEMA.TABLES
   WHERE TABLE_NAME IN
     (SELECT LEFT(SUBSTR(ID,INSTR(ID,'/')+1),
                  INSTR(SUBSTR(ID,INSTR(ID,'/')+1),'_ibfk_')-1)
      FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN
      WHERE LENGTH(SUBSTR(ID,INSTR(ID,'/')+1))>64);
   ```

Para uma tabela com um nome de restrição que excede 64 caracteres, exclua a restrição e adicione-a novamente com um nome de restrição que não exceda 64 caracteres (use `ALTER TABLE`).

6. Não deve haver modos SQL obsoletos definidos pela variável de sistema `sql_mode`. Tentar usar um modo SQL obsoleto impede que o MySQL 9.5 seja iniciado. Aplicações que usam modos SQL obsoletos devem ser revisadas para evitar isso. Para obter informações sobre os modos SQL removidos no MySQL 9.5, consulte Alterações no Servidor.

7. Atualize apenas uma instância do servidor MySQL que foi corretamente desligada. Se a instância desligar inesperadamente, reinicie-a e desligue-a com `innodb_fast_shutdown=0` antes da atualização.

8. Não deve haver views com nomes de colunas definidos explicitamente que excedam 64 caracteres (views com nomes de colunas de até 255 caracteres eram permitidos no MySQL 5.7). Para evitar erros de atualização, essas views devem ser alteradas antes da atualização. Atualmente, o único método de identificar views com nomes de colunas que excedem 64 caracteres é inspecionar a definição da view usando `SHOW CREATE VIEW`. Você também pode inspecionar as definições de views consultando a tabela do Schema de Informações `VIEWS`.

9. Não deve haver tabelas ou procedimentos armazenados com elementos de colunas `ENUM` ou `SET` individuais que excedam 255 caracteres ou 1020 bytes de comprimento. Antes do MySQL 9.5, o comprimento combinado máximo de elementos de colunas `ENUM` ou `SET` era de 64K. No MySQL 9.5, o comprimento máximo de caracteres de um elemento de coluna `ENUM` ou `SET` individual é de 255 caracteres, e o comprimento máximo em bytes é de 1020 bytes. (O limite de 1020 bytes suporta conjuntos de caracteres multibyte). Antes de atualizar para o MySQL 8.0, modifique quaisquer elementos de colunas `ENUM` ou `SET` que excedam os novos limites. Se não fizer isso, a atualização falhará com um erro.

10. Sua instalação do MySQL 9.4 não deve usar recursos que não são suportados pelo MySQL 9.5. Quaisquer alterações aqui são necessariamente específicas da instalação, mas o exemplo a seguir ilustra o tipo de coisa a procurar:

    Algumas opções de inicialização do servidor e variáveis de sistema foram removidas no MySQL 9.5. Veja Recursos Removidos no MySQL 9.5 e a Seção 1.5, “Variáveis e Opções de Status do Servidor e Adicionadas, Desatualizadas ou Removidas no MySQL 9.5”. Se você usar qualquer uma dessas, uma atualização requer alterações na configuração.

11. Se você pretende alterar o ajuste `lower_case_table_names` para 1 durante a atualização, certifique-se de que os nomes de esquema e tabelas estejam em minúsculas antes de atualizar. Caso contrário, pode ocorrer uma falha devido a uma incompatibilidade de maiúsculas e minúsculas nos nomes de esquema ou tabela. Você pode usar as seguintes consultas para verificar se os nomes de esquema e tabelas contêm caracteres maiúsculos:

    ```
    mysql> select TABLE_NAME, if(sha(TABLE_NAME) !=sha(lower(TABLE_NAME)),'Yes','No') as UpperCase from information_schema.tables;
    ```

    Se `lower_case_table_names=1`, os nomes de tabela e esquema são verificados pelo processo de atualização para garantir que todos os caracteres estejam em minúsculas. Se os nomes de tabela ou esquema forem encontrados contendo caracteres maiúsculos, o processo de atualização falha com um erro.

    Nota

    Não é recomendado alterar o ajuste `lower_case_table_names` durante a atualização.

Se a atualização para o MySQL 9.5 falhar devido a algum dos problemas descritos acima, o servidor reverte todas as alterações para o diretório de dados. Nesse caso, remova todos os arquivos de log de redo e reinicie o servidor MySQL 9.4 no diretório de dados existente para corrigir os erros. Os arquivos de log de redo (`ib_logfile*`) residem no diretório de dados do MySQL por padrão. Após corrigir os erros, realize uma parada lenta (definindo `innodb_fast_shutdown=0`) antes de tentar a atualização novamente.