#### 16.4.1.38 Replicação e Views

Views são sempre replicadas para as replicas. As Views são filtradas pelo seu próprio nome, e não pelas Tables que elas referenciam. Isso significa que uma View pode ser replicada para a replica mesmo que a View contenha uma Table que seria normalmente filtrada pelas regras de `replication-ignore-table`. Portanto, deve-se ter cautela para garantir que as Views não repliquem dados de Tables que seriam normalmente filtrados por motivos de segurança.

A Replication de uma Table para uma View com o mesmo nome é suportada usando statement-based logging, mas não quando se utiliza row-based logging. Tentar fazer isso quando o row-based logging está ativo causa um erro. (Bug #11752707, Bug #43975)