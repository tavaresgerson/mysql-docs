### 17.5.1 Implantação no modo Multi-Primary ou Single-Primary

17.5.1.1 Modo de Primordial Único

17.5.1.2 Modo Multi-Primario

17.5.1.3 Encontrar o primário

A replicação em grupo opera nos seguintes modos diferentes:

- modo único primário
- modo multi-primário

O modo padrão é único. Não é possível ter membros do grupo implantados em diferentes modos, por exemplo, um configurado no modo multi-primário enquanto outro está no modo único. Para alternar entre os modos, o grupo, e não o servidor, precisa ser reiniciado com uma configuração operacional diferente. Independentemente do modo implantado, a Replicação de Grupo não gerencia o fail-over no lado do cliente, que deve ser gerenciado pelo próprio aplicativo, um conector ou uma estrutura de middleware, como um proxy ou MySQL Router 8.0.

Quando implantado no modo multi-primário, as declarações são verificadas para garantir que sejam compatíveis com o modo. Os seguintes controles são realizados quando a Replicação em Grupo é implantada no modo multi-primário:

- Se uma transação for executada com o nível de isolamento SERIALIZABLE, seu commit falhará ao se sincronizar com o grupo.

- Se uma transação for executada contra uma tabela que possui chaves estrangeiras com restrições em cascata, então a transação não consegue ser confirmada ao se sincronizar com o grupo.

Esses verificações podem ser desativadas definindo a opção `group_replication_enforce_update_everywhere_checks` para `FALSE`. Quando implantado no modo single-primary, essa opção *deve* ser definida para `FALSE`.
