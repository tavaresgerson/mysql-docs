#### 13.7.5.35 Instrução SHOW STATUS

```sql
SHOW [GLOBAL | SESSION] STATUS
    [LIKE 'pattern' | WHERE expr]
```

Nota

O valor da variável de sistema [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) afeta as informações disponíveis e os privilégios necessários para a instrução aqui descrita. Para detalhes, consulte a descrição dessa variável em [Seção 5.1.7, “Variáveis de Sistema do Server”](server-system-variables.html "5.1.7 Server System Variables").

[`SHOW STATUS`](show-status.html "13.7.5.35 Instrução SHOW STATUS") fornece informações de Status do Server (consulte [Seção 5.1.9, “Variáveis de Status do Server”](server-status-variables.html "5.1.9 Server Status Variables")). Esta instrução não requer nenhum privilégio. Ela exige apenas a capacidade de se conectar ao Server.

As informações da variável de Status também estão disponíveis nestas fontes:

* Tabelas do Performance Schema. Consulte [Seção 25.12.14, “Tabelas de Variáveis de Status do Performance Schema”](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables").

* As tabelas [`GLOBAL_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") e [`SESSION_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables"). Consulte [Seção 24.3.10, “As Tabelas INFORMATION_SCHEMA GLOBAL_STATUS e SESSION_STATUS”](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables").

* O comando [**mysqladmin extended-status**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"). Consulte [Seção 4.5.2, “mysqladmin — Um Programa de Administração do MySQL Server”](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program").

Para [`SHOW STATUS`](show-status.html "13.7.5.35 Instrução SHOW STATUS"), uma cláusula [`LIKE`](string-comparison-functions.html#operator_like), se presente, indica quais nomes de variáveis devem ser correspondidos. Uma cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido em [Seção 24.8, “Extensões para Instruções SHOW”](extended-show.html "24.8 Extensions to SHOW Statements").

[`SHOW STATUS`](show-status.html "13.7.5.35 Instrução SHOW STATUS") aceita um modificador de escopo de variável opcional `GLOBAL` ou `SESSION`:

* Com um modificador `GLOBAL`, a instrução exibe os valores de Status Global. Uma variável de Status Global pode representar o Status para algum aspecto do próprio Server (por exemplo, `Aborted_connects`), ou o Status agregado em todas as conexões com o MySQL (por exemplo, `Bytes_received` e `Bytes_sent`). Se uma variável não tiver um valor Global, o valor Session é exibido.

* Com um modificador `SESSION`, a instrução exibe os valores da variável de Status para a conexão atual. Se uma variável não tiver um valor Session, o valor Global é exibido. `LOCAL` é um sinônimo para `SESSION`.

* Se nenhum modificador estiver presente, o padrão é `SESSION`.

O escopo para cada variável de Status está listado em [Seção 5.1.9, “Variáveis de Status do Server”](server-status-variables.html "5.1.9 Server Status Variables").

Cada invocação da instrução [`SHOW STATUS`](show-status.html "13.7.5.35 Instrução SHOW STATUS") usa uma tabela temporária interna e incrementa o valor Global [`Created_tmp_tables`](server-status-variables.html#statvar_Created_tmp_tables).

A saída parcial é mostrada aqui. A lista de nomes e valores pode ser diferente para o seu Server. O significado de cada variável é dado em [Seção 5.1.9, “Variáveis de Status do Server”](server-status-variables.html "5.1.9 Server Status Variables").

```sql
mysql> SHOW STATUS;
+--------------------------+------------+
| Variable_name            | Value      |
+--------------------------+------------+
| Aborted_clients          | 0          |
| Aborted_connects         | 0          |
| Bytes_received           | 155372598  |
| Bytes_sent               | 1176560426 |
| Connections              | 30023      |
| Created_tmp_disk_tables  | 0          |
| Created_tmp_tables       | 8340       |
| Created_tmp_files        | 60         |
...
| Open_tables              | 1          |
| Open_files               | 2          |
| Open_streams             | 0          |
| Opened_tables            | 44600      |
| Questions                | 2026873    |
...
| Table_locks_immediate    | 1920382    |
| Table_locks_waited       | 0          |
| Threads_cached           | 0          |
| Threads_created          | 30022      |
| Threads_connected        | 1          |
| Threads_running          | 1          |
| Uptime                   | 80380      |
+--------------------------+------------+
```

Com uma cláusula [`LIKE`](string-comparison-functions.html#operator_like), a instrução exibe apenas linhas para as variáveis cujos nomes correspondem ao padrão:

```sql
mysql> SHOW STATUS LIKE 'Key%';
+--------------------+----------+
| Variable_name      | Value    |
+--------------------+----------+
| Key_blocks_used    | 14955    |
| Key_read_requests  | 96854827 |
| Key_reads          | 162040   |
| Key_write_requests | 7589728  |
| Key_writes         | 3813196  |
+--------------------+----------+
```