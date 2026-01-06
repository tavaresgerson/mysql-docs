#### 16.4.1.38 Replicação e visualizações

As visualizações são sempre replicadas para réplicas. As visualizações são filtradas pelo próprio nome, e não pelas tabelas às quais se referem. Isso significa que uma visualização pode ser replicada para a réplica, mesmo que a visualização contenha uma tabela que normalmente seria filtrada pelas regras `replication-ignore-table`. Portanto, é importante ter cuidado para garantir que as visualizações não repliquem dados de tabelas que normalmente seriam filtrados por razões de segurança.

A replicação de uma tabela para uma visão com o mesmo nome é suportada usando o registro baseado em instruções, mas não quando o registro baseado em linhas estiver em vigor. Tentar fazer isso quando o registro baseado em linhas estiver em vigor causa um erro. (Bug #11752707, Bug #43975)
