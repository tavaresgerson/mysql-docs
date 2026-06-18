#### 15.7.7.16 DESCRIÇÃO DOS MOTORES DE EXIBIÇÃO

```
SHOW [STORAGE] ENGINES
```

`SHOW ENGINES` exibe informações de status sobre os motores de armazenamento do servidor. Isso é particularmente útil para verificar se um motor de armazenamento é suportado ou para ver qual é o motor padrão.

Para obter informações sobre os motores de armazenamento do MySQL, consulte o Capítulo 17, *O Motor de Armazenamento InnoDB*, e o Capítulo 18, *Motores de Armazenamento Alternativos*.

```
mysql> SHOW ENGINES\G
*************************** 1. row ***************************
      Engine: ARCHIVE
     Support: YES
     Comment: Archive storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 2. row ***************************
      Engine: BLACKHOLE
     Support: YES
     Comment: /dev/null storage engine (anything you write to it disappears)
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 3. row ***************************
      Engine: MRG_MYISAM
     Support: YES
     Comment: Collection of identical MyISAM tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 4. row ***************************
      Engine: FEDERATED
     Support: NO
     Comment: Federated MySQL storage engine
Transactions: NULL
          XA: NULL
  Savepoints: NULL
*************************** 5. row ***************************
      Engine: MyISAM
     Support: YES
     Comment: MyISAM storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 6. row ***************************
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 7. row ***************************
      Engine: InnoDB
     Support: DEFAULT
     Comment: Supports transactions, row-level locking, and foreign keys
Transactions: YES
          XA: YES
  Savepoints: YES
*************************** 8. row ***************************
      Engine: MEMORY
     Support: YES
     Comment: Hash based, stored in memory, useful for temporary tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 9. row ***************************
      Engine: CSV
     Support: YES
     Comment: CSV storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
```

A saída do `SHOW ENGINES` pode variar de acordo com a versão do MySQL utilizada e outros fatores.

A saída `SHOW ENGINES` tem essas colunas:

- `Engine`

  O nome do motor de armazenamento.

- `Support`

  O nível de suporte do servidor para o motor de armazenamento, conforme mostrado na tabela a seguir.

  <table summary="Valores para a coluna Support na saída da declaração SHOW ENGINES."><thead><tr> <th>Valor</th> <th>Significado</th> </tr></thead><tbody><tr> <td>[[<code>YES</code>]]</td> <td>O motor é suportado e está ativo</td> </tr><tr> <td>[[<code>DEFAULT</code>]]</td> <td>Como [[<code>YES</code>]], além disso, este é o motor padrão</td> </tr><tr> <td>[[<code>NO</code>]]</td> <td>O motor não é suportado</td> </tr><tr> <td>[[<code>DISABLED</code>]]</td> <td>O motor é suportado, mas foi desativado</td> </tr></tbody></table>

  Um valor de `NO` significa que o servidor foi compilado sem suporte para o motor, portanto, ele não pode ser habilitado em tempo de execução.

  Um valor de `DISABLED` ocorre porque o servidor foi iniciado com uma opção que desabilita o motor ou porque não foram fornecidas todas as opções necessárias para ativá-lo. Neste último caso, o log de erro deve conter uma razão que indique por que a opção está desativada. Veja a Seção 7.4.2, “O Log de Erro”.

  Você também pode ver `DISABLED` para um motor de armazenamento se o servidor foi compilado para suportar, mas foi iniciado com uma opção `--skip-engine_name`. Para o motor de armazenamento `NDB`, `DISABLED` significa que o servidor foi compilado com suporte para NDB Cluster, mas não foi iniciado com a opção `--ndbcluster`.

  Todos os servidores MySQL suportam as tabelas `MyISAM`. Não é possível desabilitar `MyISAM`.

- `Comment`

  Uma breve descrição do motor de armazenamento.

- `Transactions`

  Se o mecanismo de armazenamento suporta transações.

- `XA`

  Se o mecanismo de armazenamento suporta transações XA.

- `Savepoints`

  Se o mecanismo de armazenamento suporta savepoints.

As informações do mecanismo de armazenamento também estão disponíveis na tabela `INFORMATION_SCHEMA` `ENGINES`. Veja a Seção 28.3.13, “A Tabela INFORMATION\_SCHEMA ENGINES”.
