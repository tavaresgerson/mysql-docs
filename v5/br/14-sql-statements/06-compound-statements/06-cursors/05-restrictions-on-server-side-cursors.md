#### 13.6.6.5 Restrições em Cursors do Lado do Servidor

Cursors do lado do servidor (Server-Side Cursors) são implementados na C API usando a função [`mysql_stmt_attr_set()`](/doc/c-api/5.7/en/mysql-stmt-attr-set.html). A mesma implementação é usada para cursors em Stored Routines. Um Server-Side Cursor permite que um Result Set seja gerado no lado do servidor, mas não transferido para o cliente, exceto pelas linhas que o cliente solicita. Por exemplo, se um cliente executa uma Query, mas está interessado apenas na primeira linha, as linhas restantes não são transferidas.

No MySQL, um Server-Side Cursor é materializado em uma Internal Temporary Table. Inicialmente, esta é uma tabela `MEMORY`, mas é convertida para uma tabela `MyISAM` quando seu tamanho excede o valor mínimo das variáveis de sistema [`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size) e [`tmp_table_size`](server-system-variables.html#sysvar_tmp_table_size). As mesmas restrições aplicam-se às Internal Temporary Tables criadas para armazenar o Result Set de um Cursor, assim como para outros usos de Internal Temporary Tables. Consulte [Seção 8.4.4, “Uso de Internal Temporary Table no MySQL”](internal-temporary-tables.html "8.4.4 Internal Temporary Table Use in MySQL"). Uma limitação da implementação é que, para um Result Set grande, recuperar suas linhas através de um Cursor pode ser lento.

Cursors são somente leitura (*read only*); você não pode usar um Cursor para atualizar linhas.

`UPDATE WHERE CURRENT OF` e `DELETE WHERE CURRENT OF` não são implementados, pois cursors atualizáveis não são suportados.

Cursors são *nonholdable* (não permanecem abertos após um Commit).

Cursors são *asensitive*.

Cursors são *nonscrollable*.

Cursors não são nomeados. O *statement handler* atua como o ID do Cursor.

Você pode ter apenas um único Cursor aberto por *prepared statement*. Se você precisar de vários Cursors, deve preparar vários *statements*.

Você não pode usar um Cursor para um *statement* que gera um Result Set se o *statement* não for suportado no modo *prepared*. Isso inclui *statements* como [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement"), `HANDLER READ`, e [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement").