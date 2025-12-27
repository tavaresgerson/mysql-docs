### 22.5.1 Verificação da Instalação do Plugin X

O Plugin X está habilitado por padrão no MySQL 8, portanto, a instalação ou atualização para o MySQL 8 torna o plugin disponível. Você pode verificar se o Plugin X está instalado em uma instância do servidor MySQL usando a instrução `SHOW plugins` para visualizar a lista de plugins.

Para usar o MySQL Shell para verificar se o Plugin X está instalado, execute:

```
$> mysqlsh -u user --sqlc -P 3306 -e "SHOW plugins"
```

Para usar o MySQL Client para verificar se o Plugin X está instalado, execute:

```
$> mysql -u user -p -e "SHOW plugins"
```

Um exemplo de resultado se o Plugin X estiver instalado está destacado aqui:

```
+----------------------------+----------+--------------------+---------+---------+
| Name                       | Status   | Type               | Library | License |
+----------------------------+----------+--------------------+---------+---------+

...


| mysqlx                     | ACTIVE   | DAEMON             | NULL    | GPL     |

...

+----------------------------+----------+--------------------+---------+---------+
```