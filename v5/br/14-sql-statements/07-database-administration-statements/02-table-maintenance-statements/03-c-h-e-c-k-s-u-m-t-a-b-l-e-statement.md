#### 13.7.2.3 Instrução CHECKSUM TABLE

```sql
CHECKSUM TABLE tbl_name [, tbl_name] ... [QUICK | EXTENDED]
```

A instrução [`CHECKSUM TABLE`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") reporta um [checksum](glossary.html#glos_checksum "checksum") para o conteúdo de uma table. Você pode usar esta instrução para verificar se os conteúdos são os mesmos antes e depois de um backup, rollback, ou outra operação que visa retornar os dados a um estado conhecido.

Esta instrução requer o privilégio [`SELECT`](privileges-provided.html#priv_select) para a table.

Esta instrução não é suportada para views. Se você executar [`CHECKSUM TABLE`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") contra uma view, o valor de `Checksum` é sempre `NULL`, e um warning é retornado.

Para uma table inexistente, [`CHECKSUM TABLE`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") retorna `NULL` e gera um warning.

Durante a operação de checksum, a table é travada com um read lock para `InnoDB` e `MyISAM`.

##### Considerações de Performance

Por padrão, a table inteira é lida linha por linha e o checksum é calculado. Para tables grandes, isso pode levar muito tempo, portanto, você deve realizar esta operação apenas ocasionalmente. Este cálculo linha por linha é o que você obtém com a cláusula `EXTENDED`, com `InnoDB` e todos os outros storage engines, exceto `MyISAM`, e com tables `MyISAM` que não foram criadas com a cláusula `CHECKSUM=1`.

Para tables `MyISAM` criadas com a cláusula `CHECKSUM=1`, a instrução [`CHECKSUM TABLE`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") ou [`CHECKSUM TABLE ... QUICK`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") retorna o checksum da table "live" (ao vivo), que pode ser retornado muito rapidamente. Se a table não atender a todas essas condições, o método `QUICK` retorna `NULL`. O método `QUICK` não é suportado com tables `InnoDB`. Consulte [Seção 13.1.18, “Instrução CREATE TABLE”](create-table.html "13.1.18 CREATE TABLE Statement") para a sintaxe da cláusula `CHECKSUM`.

O valor do checksum depende do row format da table. Se o row format mudar, o checksum também muda. Por exemplo, o formato de armazenamento para tipos temporais como [`TIME`](time.html "11.2.3 The TIME Type"), [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") e [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") mudou no MySQL 5.6 antes do MySQL 5.6.5, portanto, se uma table 5.5 for atualizada para o MySQL 5.6, o valor do checksum pode mudar.

Importante

Se os checksums para duas tables forem diferentes, é quase certo que as tables são diferentes de alguma forma. No entanto, como a função de hashing usada por [`CHECKSUM TABLE`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") não tem garantia de ser livre de colisões (collision-free), há uma pequena chance de que duas tables não idênticas possam produzir o mesmo checksum.