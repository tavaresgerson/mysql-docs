#### 15.7.2.1 Declaração de ALTER RESOURCE GROUP

```
ALTER RESOURCE GROUP group_name
    [VCPU [=] vcpu_spec [, vcpu_spec] ...]
    [THREAD_PRIORITY [=] N]
    [ENABLE|DISABLE [FORCE]]

vcpu_spec: {N | M - N}
```

O `ALTER RESOURCE GROUP` é usado para gerenciar grupos de recursos (veja a Seção 7.1.16, “Grupos de Recursos”). Esta declaração altera atributos modificáveis de um grupo de recursos existente. Requer o privilégio `RESOURCE_GROUP_ADMIN`.

*`group_name`* identifica qual grupo de recursos será alterado. Se o grupo não existir, ocorrerá um erro.

Os atributos de afinidade de CPU, prioridade e se o grupo está habilitado podem ser modificados com `ALTER RESOURCE GROUP`. Esses atributos são especificados da mesma maneira que descrito para `CREATE RESOURCE GROUP` (veja a Seção 15.7.2.2, “Declaração CREATE RESOURCE GROUP”). Apenas os atributos especificados são alterados. Atributos não especificados retêm seus valores atuais.

O modificador `FORCE` é usado com `DISABLE`. Ele determina o comportamento da declaração se o grupo de recursos tiver quaisquer threads atribuídos a ele:

* Se `FORCE` não for fornecido, os threads existentes no grupo continuam a ser executados até que terminem, mas novos threads não podem ser atribuídos ao grupo.

* Se `FORCE` for fornecido, os threads existentes no grupo são movidos para seus respectivos grupos padrão (threads do sistema para `SYS_default`, threads do usuário para `USR_default`).

Os atributos de nome e tipo são definidos no momento da criação do grupo e não podem ser modificados posteriormente com `ALTER RESOURCE GROUP`.

Exemplos:

* Alterar a afinidade de CPU de um grupo:

  ```
  ALTER RESOURCE GROUP rg1 VCPU = 0-63;
  ```

* Alterar a prioridade de um thread de um grupo:

  ```
  ALTER RESOURCE GROUP rg2 THREAD_PRIORITY = 5;
  ```

* Desabilitar um grupo, movendo quaisquer threads atribuídos a ele para os grupos padrão:

  ```
  ALTER RESOURCE GROUP rg3 DISABLE FORCE;
  ```

A gestão de grupos de recursos é local para o servidor em que ocorre. As declarações `ALTER RESOURCE GROUP` não são escritas no log binário e não são replicadas.