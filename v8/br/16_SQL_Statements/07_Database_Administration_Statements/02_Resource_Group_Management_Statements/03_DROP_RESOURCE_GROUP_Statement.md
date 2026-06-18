#### 15.7.2.3 Declaração de GRUPO DE RECURSOS DROP

```
DROP RESOURCE GROUP group_name [FORCE]
```

`DROP RESOURCE GROUP` é usado para a gestão de grupos de recursos (consulte a Seção 7.1.16, “Grupos de Recursos”). Esta declaração remove um grupo de recursos. Requer o privilégio `RESOURCE_GROUP_ADMIN`.

`group_name` identifica qual grupo de recursos deve ser excluído. Se o grupo não existir, ocorrerá um erro.

O modificador `FORCE` determina o comportamento da declaração se o grupo de recursos tiver quaisquer threads atribuídos a ele:

- Se `FORCE` não for fornecido e qualquer thread for atribuído ao grupo, ocorrerá um erro.

- Se `FORCE` for fornecido, os threads existentes no grupo são movidos para seus respectivos grupos padrão (threads do sistema para `SYS_default`, threads de usuário para `USR_default`).

Exemplos:

- Desça um grupo, falhando se o grupo contiver quaisquer threads:

  ```
  DROP RESOURCE GROUP rg1;
  ```

- Desça um grupo e mova os tópicos existentes para os grupos padrão:

  ```
  DROP RESOURCE GROUP rg2 FORCE;
  ```

A gestão de grupos de recursos é local para o servidor em que ocorre. As instruções `DROP RESOURCE GROUP` não são escritas no log binário e não são replicadas.
