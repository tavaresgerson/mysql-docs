#### 13.6.6.5 Restrições aos cursors no lado do servidor

Os cursors do lado do servidor são implementados na API C usando a função `mysql_stmt_attr_set()`. A mesma implementação é usada para cursors em rotinas armazenadas. Um cursor do lado do servidor permite que um conjunto de resultados seja gerado no lado do servidor, mas não transferido para o cliente, exceto para as linhas solicitadas pelo cliente. Por exemplo, se um cliente executa uma consulta, mas está interessado apenas na primeira linha, as linhas restantes não são transferidas.

No MySQL, um cursor do lado do servidor é materializado em uma tabela temporária interna. Inicialmente, é uma tabela `MEMORY`, mas é convertida em uma tabela `MyISAM` quando seu tamanho excede o valor mínimo das variáveis de sistema `max_heap_table_size` e `tmp_table_size`. As mesmas restrições se aplicam às tabelas temporárias internas criadas para armazenar o conjunto de resultados de um cursor, assim como para outros usos de tabelas temporárias internas. Veja Seção 8.4.4, “Uso de Tabelas Temporárias Internas no MySQL”. Uma limitação da implementação é que, para um conjunto de resultados grande, recuperar suas linhas por meio de um cursor pode ser lento.

Os cursors são apenas de leitura; você não pode usar um cursor para atualizar linhas.

`UPDATE WHERE CURRENT OF` e `DELETE WHERE CURRENT OF` não são implementados, porque os cursors atualizáveis não são suportados.

Os cursors não podem ser mantidos abertos (não ficam abertos após um commit).

Os cursors são sensíveis.

Os cursors não são roláveis.

Os cursors não têm nomes. O manipulador de declarações atua como o ID do cursor.

Você pode ter apenas um cursor aberto por declaração preparada. Se você precisar de vários cursors, você deve preparar várias declarações.

Você não pode usar um cursor para uma declaração que gera um conjunto de resultados se a declaração não for suportada no modo preparado. Isso inclui declarações como `CHECK TABLE`, `HANDLER READ` e `SHOW BINLOG EVENTS`.
