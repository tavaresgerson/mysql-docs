#### 20.2.1.4 Lançamento do Grupo de Replicação

Primeiro, é necessário garantir que o plugin de Grupo de Replicação esteja instalado no servidor s1. Se você usou `plugin_load_add='group_replication.so'` no arquivo de opções, o plugin de Grupo de Replicação já está instalado e você pode prosseguir para o próximo passo. Caso contrário, você deve instalar o plugin manualmente. Para fazer isso, conecte-se ao servidor usando o cliente **mysql** e execute a instrução SQL mostrada aqui:

```
mysql> INSTALL PLUGIN group_replication SONAME 'group_replication.so';
```

Para verificar se o plugin foi instalado com sucesso, execute `SHOW PLUGINS;` e verifique a saída. Ele deve mostrar algo como isso:

```
mysql> SHOW PLUGINS;
+----------------------------+----------+--------------------+----------------------+-------------+
| Name                       | Status   | Type               | Library              | License     |
+----------------------------+----------+--------------------+----------------------+-------------+
| binlog                     | ACTIVE   | STORAGE ENGINE     | NULL                 | PROPRIETARY |

(...)

| group_replication          | ACTIVE   | GROUP REPLICATION  | group_replication.so | PROPRIETARY |
+----------------------------+----------+--------------------+----------------------+-------------+
```