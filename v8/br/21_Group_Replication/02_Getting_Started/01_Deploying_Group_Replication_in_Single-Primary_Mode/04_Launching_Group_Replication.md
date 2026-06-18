#### 20.2.1.4 Lançamento da Replicação em Grupo

Primeiro, é necessário garantir que o plugin de replicação em grupo esteja instalado no servidor s1. Se você usou `plugin_load_add='group_replication.so'` no arquivo de opções, o plugin de replicação em grupo já está instalado e você pode prosseguir para o próximo passo. Caso contrário, você deve instalar o plugin manualmente. Para fazer isso, conecte-se ao servidor usando o cliente **mysql** e execute a instrução SQL mostrada aqui:

```
mysql> INSTALL PLUGIN group_replication SONAME 'group_replication.so';
```

Importante

O usuário `mysql.session` deve existir antes que você possa carregar a Replicação de Grupo. `mysql.session` foi adicionado na versão 8.0.2 do MySQL. Se seu dicionário de dados foi inicializado usando uma versão anterior, você deve realizar o procedimento de atualização do MySQL (veja o Capítulo 3, *Atualizando o MySQL*). Se a atualização não for executada, a Replicação de Grupo não conseguirá ser iniciada com a mensagem de erro Houve um erro ao tentar acessar o servidor com o usuário: mysql.session\@localhost. Certifique-se de que o usuário está presente no servidor e que o mysql\_upgrade foi executado após uma atualização do servidor.

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
