### 28.3.13 A Tabela ENGINES da INFORMATION_SCHEMA

A tabela `ENGINES` fornece informações sobre os motores de armazenamento. Isso é particularmente útil para verificar se um motor de armazenamento é suportado ou para ver qual é o motor padrão.

A tabela `ENGINES` tem as seguintes colunas:

* `ENGINE`

  O nome do motor de armazenamento.

* `SUPPORT`

  O nível de suporte do servidor para o motor de armazenamento, conforme mostrado na tabela a seguir.

  <table summary="Valores para a coluna SUPPORT na tabela INFORMATION_SCHEMA.ENGINES."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Valor</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>YES</code></td> <td>O motor é suportado e está ativo</td> </tr><tr> <td><code>DEFAULT</code></td> <td>Como <code>YES</code>, além disso, este é o motor padrão</td> </tr><tr> <td><code>NO</code></td> <td>O motor não é suportado</td> </tr><tr> <td><code>DISABLED</code></td> <td>O motor é suportado, mas foi desativado</td> </tr></tbody></table>

  Um valor de `NO` significa que o servidor foi compilado sem suporte para o motor, portanto, ele não pode ser habilitado em tempo de execução.

  Um valor de `DISABLED` ocorre porque o servidor foi iniciado com uma opção que desativa o motor ou porque não foram fornecidas todas as opções necessárias para habilitá-lo. No último caso, o log de erro deve conter uma razão indicando por que a opção está desativada. Veja a Seção 7.4.2, “O Log de Erro”.

Você também pode ver `DESABILITADO` para um motor de armazenamento se o servidor foi compilado para suportar, mas foi iniciado com a opção `--skip-engine_name`. Para o motor de armazenamento `NDB`, `DESABILITADO` significa que o servidor foi compilado com suporte para NDB Cluster, mas não foi iniciado com a opção `--ndbcluster`.

Todos os servidores MySQL suportam tabelas `MyISAM`. Não é possível desabilitar `MyISAM`.

* `COMMENT`

  Uma breve descrição do motor de armazenamento.

* `TRANSACTIONS`

  Se o motor de armazenamento suporta transações.

* `XA`

  Se o motor de armazenamento suporta transações XA.

* `SAVEPOINTS`

  Se o motor de armazenamento suporta savepoints.

#### Notas

* `ENGINES` é uma tabela `INFORMATION_SCHEMA` não padrão.

As informações do motor de armazenamento também estão disponíveis na declaração `SHOW ENGINES`. Veja a Seção 15.7.7.18, “Declaração SHOW ENGINES”. As seguintes declarações são equivalentes:

```
SELECT * FROM INFORMATION_SCHEMA.ENGINES

SHOW ENGINES
```