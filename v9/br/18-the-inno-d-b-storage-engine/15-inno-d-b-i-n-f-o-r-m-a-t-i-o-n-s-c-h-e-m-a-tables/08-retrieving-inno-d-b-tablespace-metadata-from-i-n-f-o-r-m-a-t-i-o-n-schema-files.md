### 17.15.8 Recuperação dos metadados do espaço de tabelas InnoDB a partir da tabela INFORMATION_SCHEMA.FILES

A tabela `FILES` do Esquema de Informações fornece metadados sobre todos os tipos de espaços de tabelas `InnoDB`, incluindo espaços de tabelas por arquivo, espaços de tabelas gerais, o espaço de tabelas do sistema, espaços de tabelas temporárias e espaços de tabelas de rollback (se presentes).

Esta seção fornece exemplos de uso específicos para `InnoDB`. Para obter mais informações sobre os dados fornecidos pela tabela `FILES` do Esquema de Informações, consulte a Seção 28.3.15, “A tabela INFORMATION_SCHEMA FILES”.

Observação

As tabelas `INNODB_TABLESPACES` e `INNODB_DATAFILES` também fornecem metadados sobre os espaços de tabelas `InnoDB`, mas os dados são limitados aos espaços de tabelas por arquivo, gerais e de rollback.

Esta consulta recupera metadados sobre o espaço de tabelas do sistema `InnoDB` a partir de campos da tabela `FILES` do Esquema de Informações que são pertinentes para os espaços de tabelas `InnoDB`. As colunas `FILES` que não são relevantes para `InnoDB` sempre retornam `NULL` e são excluídas da consulta.

```
mysql> SELECT FILE_ID, FILE_NAME, FILE_TYPE, TABLESPACE_NAME, FREE_EXTENTS,
    ->     TOTAL_EXTENTS,  EXTENT_SIZE, INITIAL_SIZE, MAXIMUM_SIZE, AUTOEXTEND_SIZE, DATA_FREE, STATUS ENGINE
    ->     FROM INFORMATION_SCHEMA.FILES WHERE TABLESPACE_NAME LIKE 'innodb_system' \G
*************************** 1. row ***************************
        FILE_ID: 0
      FILE_NAME: ./ibdata1
      FILE_TYPE: TABLESPACE
TABLESPACE_NAME: innodb_system
   FREE_EXTENTS: 0
  TOTAL_EXTENTS: 12
    EXTENT_SIZE: 1048576
   INITIAL_SIZE: 12582912
   MAXIMUM_SIZE: NULL
AUTOEXTEND_SIZE: 67108864
      DATA_FREE: 4194304
         ENGINE: NORMAL
```

Esta consulta recupera o `FILE_ID` (equivalente ao ID do espaço) e o `FILE_NAME` (que inclui informações de caminho) para os espaços de arquivo por tabela e gerais `InnoDB`. Os espaços de arquivo por tabela e gerais têm a extensão de arquivo `.ibd`.

```
mysql> SELECT FILE_ID, FILE_NAME FROM INFORMATION_SCHEMA.FILES
    ->     WHERE FILE_NAME LIKE '%.ibd%' ORDER BY FILE_ID;
    +---------+---------------------------------------+
    | FILE_ID | FILE_NAME                             |
    +---------+---------------------------------------+
    |       2 | ./mysql/plugin.ibd                    |
    |       3 | ./mysql/servers.ibd                   |
    |       4 | ./mysql/help_topic.ibd                |
    |       5 | ./mysql/help_category.ibd             |
    |       6 | ./mysql/help_relation.ibd             |
    |       7 | ./mysql/help_keyword.ibd              |
    |       8 | ./mysql/time_zone_name.ibd            |
    |       9 | ./mysql/time_zone.ibd                 |
    |      10 | ./mysql/time_zone_transition.ibd      |
    |      11 | ./mysql/time_zone_transition_type.ibd |
    |      12 | ./mysql/time_zone_leap_second.ibd     |
    |      13 | ./mysql/innodb_table_stats.ibd        |
    |      14 | ./mysql/innodb_index_stats.ibd        |
    |      15 | ./mysql/slave_relay_log_info.ibd      |
    |      16 | ./mysql/slave_master_info.ibd         |
    |      17 | ./mysql/slave_worker_info.ibd         |
    |      18 | ./mysql/gtid_executed.ibd             |
    |      19 | ./mysql/server_cost.ibd               |
    |      20 | ./mysql/engine_cost.ibd               |
    |      21 | ./sys/sys_config.ibd                  |
    |      23 | ./test/t1.ibd                         |
    |      26 | /home/user/test/test/t2.ibd           |
    +---------+---------------------------------------+
```

Esta consulta recupera o `FILE_ID` e `FILE_NAME` para o espaço de tabelas temporárias globais `InnoDB`. Os nomes de arquivos dos espaços de tabelas temporárias globais são prefixados por `ibtmp`.

```
mysql> SELECT FILE_ID, FILE_NAME FROM INFORMATION_SCHEMA.FILES
       WHERE FILE_NAME LIKE '%ibtmp%';
+---------+-----------+
| FILE_ID | FILE_NAME |
+---------+-----------+
|      22 | ./ibtmp1  |
+---------+-----------+
```

Da mesma forma, os nomes de arquivos dos espaços de tabelas de rollback `InnoDB` são prefixados por `undo`. A consulta a seguir retorna o `FILE_ID` e `FILE_NAME` para os espaços de tabelas de rollback `InnoDB`.

```
mysql> SELECT FILE_ID, FILE_NAME FROM INFORMATION_SCHEMA.FILES
       WHERE FILE_NAME LIKE '%undo%';
```