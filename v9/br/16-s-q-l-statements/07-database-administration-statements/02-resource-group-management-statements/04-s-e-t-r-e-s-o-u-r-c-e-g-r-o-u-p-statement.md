#### 15.7.2.4 Declaração de GRUPO DE RECURSOS

```
SET RESOURCE GROUP group_name
    [FOR thread_id [, thread_id] ...]
```

O `SET RESOURCE GROUP` é usado para a gestão de grupos de recursos (consulte a Seção 7.1.16, “Grupos de Recursos”). Esta declaração atribui threads a um grupo de recursos. Requer o privilégio `RESOURCE_GROUP_ADMIN` ou `RESOURCE_GROUP_USER`.

*`group_name`* identifica qual grupo de recursos será atribuído. Quaisquer valores de `thread_id` indicam threads a serem atribuídos ao grupo. Os IDs de threads podem ser determinados a partir da tabela `threads` do Schema de Desempenho. Se o grupo de recursos ou qualquer ID de thread nomeado não existir, ocorre um erro.

Sem a cláusula `FOR`, a declaração atribui o thread atual para a sessão ao grupo de recursos.

Com uma cláusula `FOR` que nomeia os IDs de threads, a declaração atribui esses threads ao grupo de recursos.

Para tentativas de atribuir um thread do sistema a um grupo de recursos de usuário ou um thread de usuário a um grupo de recursos do sistema, ocorre um aviso.

Exemplos:

* Atribuir o thread atual da sessão a um grupo:

  ```
  SET RESOURCE GROUP rg1;
  ```

* Atribuir os threads nomeados a um grupo:

  ```
  SET RESOURCE GROUP rg2 FOR 14, 78, 4;
  ```

A gestão de grupos de recursos é local para o servidor em que ocorre. As declarações `SET RESOURCE GROUP` não são escritas no log binário e não são replicadas.

Uma alternativa ao `SET RESOURCE GROUP` é a dica de otimização `RESOURCE_GROUP`, que atribui declarações individuais a um grupo de recursos. Consulte a Seção 10.9.3, “Dicas de Otimização”.