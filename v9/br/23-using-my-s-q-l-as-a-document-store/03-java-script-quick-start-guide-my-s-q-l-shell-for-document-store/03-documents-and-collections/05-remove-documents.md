#### 22.3.3.5 Remover Documentos

Você pode usar o método `remove()` para excluir alguns ou todos os documentos de uma coleção em um esquema. A X DevAPI fornece métodos adicionais para uso com o método `remove()` para filtrar e ordenar os documentos a serem removidos.

##### Remover Documentos Usando Condições

O exemplo a seguir passa uma condição de busca para o método `remove()`. Todos os documentos que correspondem à condição são removidos da coleção `countryinfo`. Neste exemplo, um documento corresponde à condição.

```
mysql-js> db.countryinfo.remove("Code = 'SEA'")
```

##### Remover o Primeiro Documento

Para remover o primeiro documento na coleção `countryinfo`, use o método `limit()` com um valor de 1.

```
mysql-js> db.countryinfo.remove("true").limit(1)
```

##### Remover o Último Documento em uma Ordem

O exemplo a seguir remove o último documento na coleção `countryinfo` por nome de país.

```
mysql-js> db.countryinfo.remove("true").sort(["Name desc"]).limit(1)
```

##### Remover Todos os Documentos em uma Coleção

Você pode remover todos os documentos em uma coleção. Para fazer isso, use o método `remove("true")` sem especificar uma condição de busca.

Cuidado

Use cuidado ao remover documentos sem especificar uma condição de busca. Essa ação exclui todos os documentos da coleção.

Alternativamente, use a operação `db.drop_collection('countryinfo')` para excluir a coleção `countryinfo`.

##### Informações Relacionadas

* Veja CollectionRemoveFunction para a definição completa da sintaxe.

* Veja Seção 22.3.2, “Baixar e Importar o Banco de Dados world_x” para instruções para recriar o esquema `world_x`.