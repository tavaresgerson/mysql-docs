#### 15.7.3.3 Declaração da Tabela CHECKSUM

```
CHECKSUM TABLE tbl_name [, tbl_name] ... [QUICK | EXTENDED]
```

`CHECKSUM TABLE` reporta um checksum para o conteúdo de uma tabela. Você pode usar essa declaração para verificar se o conteúdo é o mesmo antes e depois de um backup, rollback ou outra operação que tenha como objetivo colocar os dados de volta a um estado conhecido.

Esta declaração requer o privilégio `SELECT` para a tabela.

Esta declaração não é suportada para visualizações. Se você executar `CHECKSUM TABLE` contra uma visualização, o valor `Checksum` será sempre `NULL`, e um aviso será retornado.

Para uma tabela inexistente, `CHECKSUM TABLE` retorna `NULL` e gera um aviso.

Durante a operação de verificação de checksum, a tabela é bloqueada com um bloqueio de leitura para `InnoDB` e `MyISAM`.

##### Considerações sobre o desempenho

Por padrão, toda a tabela é lida linha por linha e o checksum é calculado. Para tabelas grandes, isso pode levar muito tempo, portanto, você só realizará essa operação ocasionalmente. Esse cálculo linha por linha é o que você obtém com a cláusula `EXTENDED`, com `InnoDB` e todos os outros motores de armazenamento, exceto `MyISAM`, e com tabelas `MyISAM` não criadas com a cláusula `CHECKSUM=1`.

Para as tabelas `MyISAM` criadas com a cláusula `CHECKSUM=1`, `CHECKSUM TABLE` ou `CHECKSUM TABLE ... QUICK`, `QUICK` retorna o checksum da tabela “viva” que pode ser retornado muito rapidamente. Se a tabela não atender a todas essas condições, o método `NULL` retorna `QUICK`. O método `QUICK` não é suportado com tabelas `InnoDB`. Veja a Seção 15.1.20, “Instrução CREATE TABLE” para a sintaxe da cláusula `CHECKSUM`.

O valor do checksum depende do formato da linha da tabela. Se o formato da linha mudar, o checksum também mudará. Por exemplo, o formato de armazenamento para tipos temporais como `TIME`, `DATETIME` e `TIMESTAMP` mudou no MySQL 5.6 antes do MySQL 5.6.5, então, se uma tabela de 5.5 for atualizada para o MySQL 5.6, o valor do checksum pode mudar.

Importante

Se os checksums de duas tabelas forem diferentes, então é quase certo que as tabelas sejam diferentes de alguma forma. No entanto, como a função de hashing usada pelo `CHECKSUM TABLE` não é garantidamente livre de colisões, há uma pequena chance de que duas tabelas que não são idênticas possam produzir o mesmo checksum.
