#### 15.7.7.37 Declaração de ESTADO DE SITUAÇÃO

```
SHOW [GLOBAL | SESSION] STATUS
    [LIKE 'pattern' | WHERE expr]
```

`SHOW STATUS` fornece informações sobre o status do servidor (consulte a Seção 7.1.10, “Variáveis de Status do Servidor”). Esta declaração não requer privilégio algum. Ela requer apenas a capacidade de se conectar ao servidor.

Informações de status variáveis também estão disponíveis nessas fontes:

- Tabelas do Schema de Desempenho. Veja a Seção 29.12.15, “Tabelas de Variáveis de Status do Schema de Desempenho”.

- O comando **mysqladmin status-extendido**. Veja a Seção 6.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

Para `SHOW STATUS`, uma cláusula `LIKE`, se presente, indica quais nomes de variáveis devem ser correspondidos. Uma cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”.

`SHOW STATUS` aceita um modificador opcional de escopo da variável `GLOBAL` ou `SESSION`:

- Com um modificador `GLOBAL`, a declaração exibe os valores de status global. Uma variável de status global pode representar o status de algum aspecto do próprio servidor (por exemplo, `Aborted_connects`), ou o status agregado sobre todas as conexões ao MySQL (por exemplo, `Bytes_received` e `Bytes_sent`). Se uma variável não tiver um valor global, o valor da sessão é exibido.

- Com o modificador `SESSION`, a declaração exibe os valores das variáveis de status para a conexão atual. Se uma variável não tiver um valor de sessão, o valor global será exibido. `LOCAL` é sinônimo de `SESSION`.

- Se nenhum modificador estiver presente, o padrão é `SESSION`.

O escopo de cada variável de status está listado na Seção 7.1.10, "Variáveis de Status do Servidor".

Cada invocação da declaração `SHOW STATUS` usa uma tabela temporária interna e incrementa o valor global `Created_tmp_tables`.

A saída parcial é mostrada aqui. A lista de nomes e valores pode diferir para o seu servidor. O significado de cada variável é fornecido na Seção 7.1.10, “Variáveis de Status do Servidor”.

```
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

Com uma cláusula `LIKE`, a declaração exibe apenas as linhas para aquelas variáveis com nomes que correspondem ao padrão:

```
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
