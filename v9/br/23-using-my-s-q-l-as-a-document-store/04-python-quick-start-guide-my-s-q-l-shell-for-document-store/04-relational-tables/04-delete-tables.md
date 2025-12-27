#### 22.4.4.4 Excluir Tabelas

Você pode usar o método `delete()` para remover alguns ou todos os registros de uma tabela em um banco de dados. A X DevAPI fornece métodos adicionais para usar com o método `delete()` para filtrar e ordenar os registros a serem excluídos.

##### Excluir Registros Usando Condições

O exemplo a seguir passa condições de busca para o método `delete()`. Todos os registros que correspondem à condição são excluídos da tabela `city`. Neste exemplo, um registro corresponde à condição.

```
mysql-py> db.city.delete().where("Name = 'Olympia'")
```

##### Excluir o Primeiro Registro

Para excluir o primeiro registro na tabela `city`, use o método `limit()` com um valor de 1.

```
mysql-py> db.city.delete().limit(1)
```

##### Excluir Todos os Registros em uma Tabela

Você pode excluir todos os registros em uma tabela. Para fazer isso, use o método `delete()` sem especificar uma condição de busca.

Cuidado

Use cuidado ao excluir registros sem especificar uma condição de busca; isso exclui todos os registros da tabela.

##### Deixar uma Tabela

O método `drop_collection()` também é usado no MySQL Shell para excluir uma tabela relacional de um banco de dados. Por exemplo, para excluir a tabela `citytest` do banco de dados `world_x`, execute:

```
mysql-py> db.drop_collection("citytest")
```

##### Informações Relacionadas

* Veja TableDeleteFunction para a definição completa da sintaxe.

* Veja Seção 22.4.2, “Baixar e Importar banco de dados world\_x” para instruções para recriar o banco de dados `world_x`.