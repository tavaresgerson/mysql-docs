#### 13.7.5.35 Declaração de ESTADO DE SITUAÇÃO

```sql
SHOW [GLOBAL | SESSION] STATUS
    [LIKE 'pattern' | WHERE expr]
```

Nota

O valor da variável de sistema `show_compatibility_56` afeta as informações disponíveis e os privilégios necessários para a declaração descrita aqui. Para obter detalhes, consulte a descrição dessa variável em Seção 5.1.7, "Variáveis de Sistema do Servidor".

`SHOW STATUS` fornece informações sobre o status do servidor (veja Seção 5.1.9, “Variáveis de Status do Servidor”). Esta declaração não requer privilégio algum. Ela requer apenas a capacidade de se conectar ao servidor.

Informações de status variáveis também estão disponíveis nessas fontes:

- Tabelas do Schema de Desempenho. Consulte Seção 25.12.14, “Tabelas de Variáveis de Status do Schema de Desempenho”.

- As tabelas `GLOBAL_STATUS` e `SESSION_STATUS` (information-schema-status-table.html). Veja Seção 24.3.10, “As tabelas INFORMATION_SCHEMA GLOBAL_STATUS e SESSION_STATUS”.

- O comando **mysqladmin extended-status**. Veja Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

Para `SHOW STATUS`, uma cláusula de comparação de strings `LIKE`, se presente, indica quais nomes de variáveis devem ser correspondidos. Uma cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido em Seção 24.8, “Extensões para Declarações SHOW”.

O `SHOW STATUS` aceita um modificador opcional de escopo da variável `GLOBAL` ou `SESSION`:

- Com o modificador `GLOBAL`, a declaração exibe os valores de status globais. Uma variável de status global pode representar o status de algum aspecto do próprio servidor (por exemplo, `Aborted_connects`) ou o status agregado sobre todas as conexões ao MySQL (por exemplo, `Bytes_received` e `Bytes_sent`). Se uma variável não tiver um valor global, o valor da sessão é exibido.

- Com o modificador `SESSION`, a instrução exibe os valores das variáveis de status para a conexão atual. Se uma variável não tiver um valor de sessão, o valor global é exibido. `LOCAL` é sinônimo de `SESSION`.

- Se nenhum modificador estiver presente, o padrão é `SESSION`.

O escopo de cada variável de status está listado na Seção 5.1.9, "Variáveis de Status do Servidor".

Cada invocação da instrução `SHOW STATUS` usa uma tabela temporária interna e incrementa o valor global `Created_tmp_tables`.

Aqui é mostrado o resultado parcial. A lista de nomes e valores pode diferir para o seu servidor. O significado de cada variável está descrito em Seção 5.1.9, “Variáveis de Status do Servidor”.

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

Com uma cláusula `LIKE` (funções de comparação de strings.html#operador_like), a instrução exibe apenas as linhas para aquelas variáveis com nomes que correspondem ao padrão:

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
