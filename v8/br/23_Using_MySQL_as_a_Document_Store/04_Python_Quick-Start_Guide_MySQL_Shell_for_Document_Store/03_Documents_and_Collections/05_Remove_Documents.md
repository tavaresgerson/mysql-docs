#### 22.4.3.5 Remover documentos

Você pode usar o método `remove()` para excluir alguns ou todos os documentos de uma coleção em um esquema. O X DevAPI fornece métodos adicionais para uso com o método `remove()` para filtrar e ordenar os documentos a serem removidos.

##### Remover documentos com base em condições

O exemplo a seguir passa uma condição de busca para o método `remove()`. Todos os documentos que correspondem à condição são removidos da coleção `countryinfo`. Neste exemplo, um documento corresponde à condição.

```
mysql-py> db.countryinfo.remove("Code = 'SEA'")
```

##### Remover o Primeiro Documento

Para remover o primeiro documento da coleção `countryinfo`, use o método `limit()` com um valor de 1.

```
mysql-py> db.countryinfo.remove("true").limit(1)
```

##### Remover o Último Documento em uma Ordem

O exemplo a seguir remove o último documento da coleção `countryinfo` por nome do país.

```
mysql-py> db.countryinfo.remove("true").sort(["Name desc"]).limit(1)
```

##### Remover todos os documentos de uma coleção

Você pode remover todos os documentos de uma coleção. Para fazer isso, use o método `remove("true")` sem especificar uma condição de pesquisa.

Cuidado

Tenha cuidado ao remover documentos sem especificar uma condição de pesquisa. Essa ação exclui todos os documentos da coleção.

Alternativamente, use a operação `db.drop_collection('countryinfo')` para excluir a coleção `countryinfo`.

##### Informações Relacionadas

- Consulte ColeçãoRemoveFunction para obter a definição completa da sintaxe.

- Consulte a Seção 22.4.2, “Baixar e importar o banco de dados world\_x”, para obter instruções para recriar o esquema `world_x`.
