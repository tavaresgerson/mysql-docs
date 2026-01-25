### 17.5.1 Implantação no Modo Multi-Primary ou Single-Primary

[17.5.1.1 Modo Single-Primary](group-replication-single-primary-mode.html)

[17.5.1.2 Modo Multi-Primary](group-replication-multi-primary-mode.html)

[17.5.1.3 Localizando o Primary](group-replication-find-primary.html)

O Group Replication opera nos seguintes modos diferentes:

* modo single-primary
* modo multi-primary

O modo padrão é o single-primary. Não é possível ter membros do grupo implantados em modos diferentes, por exemplo, um configurado no modo multi-primary enquanto outro está no modo single-primary. Para alternar entre os modos, o grupo, e não o servidor, precisa ser reiniciado com uma configuração operacional diferente. Independentemente do modo implantado, o Group Replication não gerencia o fail-over do lado do cliente, o que deve ser tratado pela própria aplicação, por um connector ou por uma estrutura de middleware, como um proxy ou o [MySQL Router 8.0](/doc/mysql-router/8.0/en/).

Quando implantado no modo multi-primary, as statements são verificadas para garantir que sejam compatíveis com o modo. As seguintes verificações são realizadas quando o Group Replication é implantado no modo multi-primary:

* Se uma transaction for executada sob o isolation level `SERIALIZABLE`, o seu commit falha ao sincronizar-se com o grupo.

* Se uma transaction for executada contra uma tabela que possui foreign keys com cascading constraints, a transaction falha ao realizar o commit quando sincroniza-se com o grupo.

Essas verificações podem ser desativadas configurando a opção [`group_replication_enforce_update_everywhere_checks`](group-replication-system-variables.html#sysvar_group_replication_enforce_update_everywhere_checks) para `FALSE`. Ao implantar no modo single-primary, esta opção *deve* ser configurada como `FALSE`.