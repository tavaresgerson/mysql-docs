#### 15.7.3.3 Declaração de TABELA CHECKSUM

```
CHECKSUM TABLE tbl_name [, tbl_name] ... [QUICK | EXTENDED]
```

A declaração `CHECKSUM TABLE` reporta um checksum dos conteúdos de uma tabela. Você pode usar essa declaração para verificar se os conteúdos são os mesmos antes e depois de um backup, rollback ou outra operação que tenha como objetivo colocar os dados de volta a um estado conhecido.

Essa declaração requer o privilégio `SELECT` para a tabela.

Essa declaração não é suportada para visualizações. Se você executar `CHECKSUM TABLE` contra uma visualização, o valor `Checksum` será sempre `NULL` e será retornado um aviso.

Para uma tabela inexistente, `CHECKSUM TABLE` retorna `NULL` e gera um aviso.

Durante a operação de checksum, a tabela é bloqueada com um bloqueio de leitura para `InnoDB` e `MyISAM`.

##### Considerações de Desempenho

Por padrão, toda a tabela é lida linha por linha e o checksum é calculado. Para tabelas grandes, isso pode levar muito tempo, portanto, você só executará essa operação ocasionalmente. Esse cálculo linha por linha é o que você obtém com a cláusula `EXTENDED`, com `InnoDB` e todos os outros motores de armazenamento, exceto `MyISAM`, e com tabelas `MyISAM` não criadas com a cláusula `CHECKSUM=1`.

Para tabelas `MyISAM` criadas com a cláusula `CHECKSUM=1`, `CHECKSUM TABLE` ou `CHECKSUM TABLE ... QUICK` retorna o checksum da tabela "viva" que pode ser retornado muito rapidamente. Se a tabela não atender a todas essas condições, o método `QUICK` retorna `NULL`. O método `QUICK` não é suportado com tabelas `InnoDB`. Consulte a Seção 15.1.24, “Declaração CREATE TABLE” para a sintaxe da cláusula `CHECKSUM`.

O valor do checksum depende do formato da linha da tabela. Se o formato da linha mudar, o checksum também mudará. Por exemplo, o formato de armazenamento para tipos temporais, como `TIME`, `DATETIME` e `TIMESTAMP`, mudou no MySQL 5.6 antes do MySQL 5.6.5, então, se uma tabela da versão 5.5 for atualizada para o MySQL 5.6, o valor do checksum pode mudar.

Importante

Se os checksums de duas tabelas forem diferentes, é quase certo que as tabelas sejam diferentes de alguma forma. No entanto, como a função de hashing usada pelo `CHECKSUM TABLE` não é garantida para ser livre de colisões, há uma pequena chance de que duas tabelas que não são idênticas possam produzir o mesmo checksum.