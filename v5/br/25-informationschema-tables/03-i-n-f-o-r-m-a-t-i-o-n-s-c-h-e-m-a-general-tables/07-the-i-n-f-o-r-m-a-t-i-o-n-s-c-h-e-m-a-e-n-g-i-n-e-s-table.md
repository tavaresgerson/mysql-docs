### 24.3.7 A Tabela ENGINES do INFORMATION_SCHEMA

A tabela `ENGINES` fornece informações sobre storage engines. Isso é particularmente útil para verificar se um storage engine é suportado ou para ver qual é o Engine padrão (default).

A tabela `ENGINES` possui as seguintes colunas:

* `ENGINE`

  O nome do storage engine.

* `SUPPORT`

  O nível de suporte do servidor para o storage engine, conforme mostrado na tabela a seguir.

  <table summary="Valores para a coluna SUPPORT na tabela INFORMATION_SCHEMA.ENGINES."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Valor</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>YES</code></td> <td>O Engine é suportado e está ativo</td> </tr><tr> <td><code>DEFAULT</code></td> <td>Semelhante a <code>YES</code>, e este é o Engine padrão (default)</td> </tr><tr> <td><code>NO</code></td> <td>O Engine não é suportado</td> </tr><tr> <td><code>DISABLED</code></td> <td>O Engine é suportado, mas foi desabilitado</td> </tr> </tbody></table>

  Um valor `NO` significa que o servidor foi compilado sem suporte para o Engine, portanto, ele não pode ser habilitado em tempo de execução (runtime).

  Um valor `DISABLED` ocorre porque o servidor foi iniciado com uma opção que desabilita o Engine, ou porque nem todas as opções necessárias para habilitá-lo foram fornecidas. Neste último caso, o error log deve conter um motivo indicando por que a opção está desabilitada. Consulte Seção 5.4.2, “O Error Log”.

  Você também pode ver `DISABLED` para um storage engine se o servidor foi compilado para suportá-lo, mas foi iniciado com a opção `--skip-engine_name`. Para o storage engine `NDB`, `DISABLED` significa que o servidor foi compilado com suporte para NDB Cluster, mas não foi iniciado com a opção `--ndbcluster`.

  Todos os servidores MySQL suportam tabelas `MyISAM`. Não é possível desabilitar o `MyISAM`.

* `COMMENT`

  Uma breve descrição do storage engine.

* `TRANSACTIONS`

  Se o storage engine suporta Transactions.

* `XA`

  Se o storage engine suporta XA Transactions.

* `SAVEPOINTS`

  Se o storage engine suporta Savepoints.

#### Observações

* `ENGINES` é uma tabela `INFORMATION_SCHEMA` não padrão.

Informações sobre storage engines também estão disponíveis através da instrução `SHOW ENGINES`. Consulte Seção 13.7.5.16, “Instrução SHOW ENGINES”. As seguintes instruções são equivalentes:

```sql
SELECT * FROM INFORMATION_SCHEMA.ENGINES

SHOW ENGINES
```