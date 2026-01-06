### 14.16.8 Recuperação dos metadados do espaço de tabela InnoDB a partir do INFORMATION\_SCHEMA.FILES

A tabela do esquema de informações `FILES` fornece metadados sobre todos os tipos de espaço de tabela `InnoDB`, incluindo espaços de tabela por arquivo, espaços de tabela gerais, o espaço de tabela do sistema, espaços de tabela de tabela temporária e espaços de tabela de desfazer (se presentes).

Esta seção fornece exemplos de uso específicos do InnoDB. Para mais informações, consulte a Seção 24.3.9, “A Tabela INFORMATION\_SCHEMA FILES”.

Nota

As tabelas `INNODB_SYS_TABLESPACES` e `INNODB_SYS_DATAFILES` também fornecem metadados sobre os espaços de tabelas do `InnoDB`, mas os dados são limitados a arquivos por tabela e espaços de tabelas gerais.

Essa consulta recupera metadados sobre o espaço de tabela do sistema `InnoDB` a partir das colunas da tabela do esquema de informações `FILES` que são pertinentes aos espaços de tabela `InnoDB`. As colunas `FILES` que não são relevantes para `InnoDB` sempre retornam `NULL` e são excluídas da consulta.

```sql
mysql> SELECT FILE_ID, FILE_NAME, FILE_TYPE, TABLESPACE_NAME, FREE_EXTENTS,
       TOTAL_EXTENTS,  EXTENT_SIZE, INITIAL_SIZE, MAXIMUM_SIZE, AUTOEXTEND_SIZE, DATA_FREE, STATUS ENGINE
       FROM INFORMATION_SCHEMA.FILES WHERE TABLESPACE_NAME LIKE 'innodb_system' \G
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

Essa consulta recupera o `FILE_ID` (equivalente à ID de espaço) e o `FILE_NAME` (que inclui informações de caminho) para os espaços de tabela e espaços de tabela gerais `InnoDB`. Os espaços de tabela e espaços de tabela gerais têm a extensão de arquivo `.ibd`.

```sql
mysql> SELECT FILE_ID, FILE_NAME FROM INFORMATION_SCHEMA.FILES
       WHERE FILE_NAME LIKE '%.ibd%' ORDER BY FILE_ID;
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

Essa consulta recupera o `FILE_ID` e `FILE_NAME` para os espaços de tabelas temporárias do `InnoDB`. Os nomes dos arquivos de espaço de tabela temporário são prefixados com `ibtmp`.

```sql
mysql> SELECT FILE_ID, FILE_NAME FROM INFORMATION_SCHEMA.FILES
       WHERE FILE_NAME LIKE '%ibtmp%';
+---------+-----------+
| FILE_ID | FILE_NAME |
+---------+-----------+
|      22 | ./ibtmp1  |
+---------+-----------+
```

Da mesma forma, os nomes dos arquivos de espaço de undo de `InnoDB` são prefixados por `undo`. A seguinte consulta retorna o `FILE_ID` e `FILE_NAME` para os espaços de undo de `InnoDB`, se espaços de undo separados forem configurados.

```sql
mysql> SELECT FILE_ID, FILE_NAME FROM INFORMATION_SCHEMA.FILES
       WHERE FILE_NAME LIKE '%undo%';
```
