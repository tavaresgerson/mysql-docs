#### 15.7.2.4 Declaração do Grupo de Recursos SET

```
SET RESOURCE GROUP group_name
    [FOR thread_id [, thread_id] ...]
```

`SET RESOURCE GROUP` é usado para a gestão de grupos de recursos (consulte a Seção 7.1.16, “Grupos de Recursos”). Esta declaração atribui threads a um grupo de recursos. Requer o privilégio `RESOURCE_GROUP_ADMIN` ou `RESOURCE_GROUP_USER`.

`group_name` identifica qual grupo de recursos será atribuído. Quaisquer valores de `thread_id` indicam os threads a serem atribuídos ao grupo. Os IDs dos threads podem ser determinados a partir da tabela do Schema de Desempenho `threads`. Se o grupo de recursos ou qualquer ID de thread nomeado não existir, ocorrerá um erro.

Sem a cláusula `FOR`, a instrução atribui o thread atual para a sessão ao grupo de recursos.

Com uma cláusula `FOR` que nomeia os IDs dos threads, a instrução atribui esses threads ao grupo de recursos.

Para tentativas de atribuir um fio do sistema a um grupo de recursos do usuário ou um fio do usuário a um grupo de recursos do sistema, ocorre um aviso.

Exemplos:

- Atribua o fio da sessão atual a um grupo:

  ```
  SET RESOURCE GROUP rg1;
  ```

- Atribua os threads nomeados a um grupo:

  ```
  SET RESOURCE GROUP rg2 FOR 14, 78, 4;
  ```

A gestão de grupos de recursos é local para o servidor em que ocorre. As instruções `SET RESOURCE GROUP` não são escritas no log binário e não são replicadas.

Uma alternativa ao `SET RESOURCE GROUP` é o `RESOURCE_GROUP` otimizador, que atribui instruções individuais a um grupo de recursos. Veja a Seção 10.9.3, “Dicas de otimização”.
