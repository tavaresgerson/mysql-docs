### 24.3.7 A Tabela INFORMATION\_SCHEMA ENGINES

A tabela `ENGINES` fornece informações sobre os motores de armazenamento. Isso é particularmente útil para verificar se um motor de armazenamento é suportado ou para ver qual é o motor padrão.

A tabela `ENGINES` tem as seguintes colunas:

- `MOTOR`

  O nome do motor de armazenamento.

- `SUPORTE`

  O nível de suporte do servidor para o motor de armazenamento, conforme mostrado na tabela a seguir.

  <table summary="Valores para a coluna SUPPORT na tabela INFORMATION_SCHEMA.ENGINES."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Valor</th> <th>Significado</th> </tr></thead><tbody><tr> <td>[[<code>YES</code>]]</td> <td>O motor é suportado e está ativo</td> </tr><tr> <td>[[<code>DEFAULT</code>]]</td> <td>Como [[<code>YES</code>]], além disso, este é o motor padrão</td> </tr><tr> <td>[[<code>NO</code>]]</td> <td>O motor não é suportado</td> </tr><tr> <td>[[<code>DISABLED</code>]]</td> <td>O motor é suportado, mas foi desativado</td> </tr></tbody></table>

  Um valor de `NO` significa que o servidor foi compilado sem suporte para o motor, portanto, ele não pode ser habilitado em tempo de execução.

  Um valor de `DESABILITADO` ocorre porque o servidor foi iniciado com uma opção que desabilita o motor ou porque não foram fornecidas todas as opções necessárias para ativá-lo. Neste último caso, o log de erro deve conter uma razão que indique por que a opção está desabilitada. Consulte Seção 5.4.2, “O Log de Erro”.

  Você também pode ver `DESABILITADO` para um motor de armazenamento se o servidor foi compilado para suportar, mas foi iniciado com uma opção `--skip-engine_name`. Para o motor de armazenamento `NDB`, `DESABILITADO` significa que o servidor foi compilado com suporte para NDB Cluster, mas não foi iniciado com a opção `--ndbcluster`]\(mysql-cluster-options-variables.html#option\_mysqld\_ndbcluster).

  Todos os servidores MySQL suportam tabelas `MyISAM`. Não é possível desabilitar `MyISAM`.

- `COMENTÁRIO`

  Uma breve descrição do motor de armazenamento.

- `TRANSACOES`

  Se o mecanismo de armazenamento suporta transações.

- `XA`

  Se o mecanismo de armazenamento suporta transações XA.

- `SAVEPOINTS`

  Se o mecanismo de armazenamento suporta savepoints.

#### Notas

- `ENGINES` é uma tabela `INFORMATION_SCHEMA` não padrão.

As informações do mecanismo de armazenamento também estão disponíveis na declaração `SHOW ENGINES`. Veja Seção 13.7.5.16, “Declaração SHOW ENGINES”. As seguintes declarações são equivalentes:

```sql
SELECT * FROM INFORMATION_SCHEMA.ENGINES

SHOW ENGINES
```
