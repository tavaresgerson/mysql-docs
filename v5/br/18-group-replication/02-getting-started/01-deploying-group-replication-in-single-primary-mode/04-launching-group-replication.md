#### 17.2.1.4 Iniciando o Group Replication

É primeiramente necessário garantir que o *plugin Group Replication* esteja instalado no *server* s1. Se você usou `plugin_load_add='group_replication.so'` no arquivo de opção, então o *plugin Group Replication* já está instalado, e você pode prosseguir para a próxima etapa. Caso contrário, você deve instalar o *plugin* manualmente; para fazer isso, conecte-se ao *server* usando o *client* [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") e execute a *SQL statement* mostrada aqui:

```sql
mysql> INSTALL PLUGIN group_replication SONAME 'group_replication.so';
```

Importante

O *user* `mysql.session` deve existir antes que você possa carregar o *Group Replication*. `mysql.session` foi adicionado na versão 5.7.19 do MySQL. Se o seu *Data Dictionary* foi inicializado usando uma versão anterior, você deve executar o procedimento de *MySQL upgrade* (consulte [Section 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL")). Se o *upgrade* não for executado, o *Group Replication* falhará ao iniciar com a mensagem de erro *There was an error when trying to access the server with user: mysql.session@localhost. Make sure the user is present in the server and that mysql_upgrade was ran after a server update*.

Para verificar se o *plugin* foi instalado com sucesso, execute `SHOW PLUGINS;` e verifique a saída. Ela deve mostrar algo como isto:

```sql
mysql> SHOW PLUGINS;
+----------------------------+----------+--------------------+----------------------+-------------+
| Name                       | Status   | Type               | Library              | License     |
+----------------------------+----------+--------------------+----------------------+-------------+
| binlog                     | ACTIVE   | STORAGE ENGINE     | NULL                 | PROPRIETARY |

(...)

| group_replication          | ACTIVE   | GROUP REPLICATION  | group_replication.so | PROPRIETARY |
+----------------------------+----------+--------------------+----------------------+-------------+
```