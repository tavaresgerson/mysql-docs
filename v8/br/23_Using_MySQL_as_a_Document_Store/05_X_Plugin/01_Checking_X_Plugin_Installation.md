### 22.5.1 Verificar a instalação do plugin X

O X Plugin está habilitado por padrão no MySQL 8, portanto, instalar ou atualizar para o MySQL 8 torna o plugin disponível. Você pode verificar se o X Plugin está instalado em uma instância do servidor MySQL usando a instrução `SHOW plugins` para visualizar a lista de plugins.

Para usar o MySQL Shell para verificar se o X Plugin está instalado, execute:

```
$> mysqlsh -u user --sqlc -P 3306 -e "SHOW plugins"
```

Para usar o MySQL Client para verificar se o X Plugin está instalado, execute:

```
$> mysql -u user -p -e "SHOW plugins"
```

Aqui está um exemplo de resultado se o X Plugin estiver instalado:

```
+----------------------------+----------+--------------------+---------+---------+
| Name                       | Status   | Type               | Library | License |
+----------------------------+----------+--------------------+---------+---------+

...


| mysqlx                     | ACTIVE   | DAEMON             | NULL    | GPL     |

...

+----------------------------+----------+--------------------+---------+---------+
```
