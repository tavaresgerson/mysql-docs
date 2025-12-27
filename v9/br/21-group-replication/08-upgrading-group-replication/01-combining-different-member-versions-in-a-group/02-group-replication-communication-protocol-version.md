#### 20.8.1.2 Protocolo de Comunicação de Replicação de Grupo Versão

Um grupo de replicação usa um protocolo de comunicação de replicação de grupo que difere da versão do MySQL Server dos membros. Para verificar a versão do protocolo de comunicação do grupo, execute a seguinte declaração em qualquer membro:

```
SELECT @@version, group_replication_get_communication_protocol();
+------------------------------------------------------------+
| @@version | group_replication_get_communication_protocol() |
+------------------------------------------------------------+
| 8.4.0     | 8.0.27                                         |
+------------------------------------------------------------+
```

Como demonstrado, a série MySQL 8.4 LTS usa o protocolo de comunicação `8.0.27`.

Para mais informações, consulte a Seção 20.5.1.4, “Definindo a Versão do Protocolo de Comunicação de um Grupo”.