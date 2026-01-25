### 17.7.2 Variáveis de Status do Group Replication

O MySQL 5.7 suporta uma variável de status que fornece informações sobre o Group Replication. Esta variável é descrita aqui:

* [`group_replication_primary_member`](server-status-variables.html#statvar_group_replication_primary_member)

  Mostra o UUID do Primary member quando o grupo está operando no single-primary mode. Se o grupo estiver operando no multi-primary mode, mostra uma string vazia. Consulte [Seção 17.5.1.3, “Encontrando o Primary”](group-replication-find-primary.html "17.5.1.3 Finding the Primary").