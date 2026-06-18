#### 22.4.3.6 Criar e descartar índices

Os índices são usados para encontrar documentos com valores específicos de campo rapidamente. Sem um índice, o MySQL deve começar com o primeiro documento e, em seguida, ler todo o conjunto para encontrar os campos relevantes. Quanto maior o conjunto, mais isso custa. Se o conjunto for grande e as consultas em um campo específico forem comuns, considere criar um índice em um campo específico dentro de um documento.

Por exemplo, a seguinte consulta tem melhor desempenho com um índice no campo População:

```
mysql-py> db.countryinfo.find("demographics.Population < 100")
...[output removed]
8 documents in set (0.00 sec)
```

O método `create_index()` cria um índice que você pode definir com um documento JSON que especifica quais campos usar. Esta seção é uma visão geral de alto nível do indexação. Para mais informações, consulte Coleções de indexação.

##### Adicionar um índice não único

Para criar um índice não único, passe o nome do índice e as informações do índice ao método `create_index()`. Nomes de índices duplicados são proibidos.

O exemplo a seguir especifica um índice chamado `popul`, definido contra o campo `Population` do objeto `demographics`, indexado como um valor numérico `Integer`. O parâmetro final indica se o campo deve exigir a restrição `NOT NULL`. Se o valor for `false`, o campo pode conter valores `NULL`. As informações do índice são um documento JSON com detalhes de um ou mais campos a serem incluídos no índice. Cada definição de campo deve incluir o caminho completo do documento para o campo e especificar o tipo do campo.

```
mysql-py> db.countryinfo.createIndex("popul", {fields:
[{field: '$.demographics.Population', type: 'INTEGER'}]})
```

Aqui, o índice é criado usando um valor numérico inteiro. Existem outras opções disponíveis, incluindo opções para uso com dados GeoJSON. Você também pode especificar o tipo de índice, que foi omitido aqui porque o tipo padrão “índice” é apropriado.

##### Adicione um índice exclusivo

Para criar um índice único, passe o nome do índice, a definição do índice e o tipo de índice “único” ao método `create_index()`. Este exemplo mostra um índice único criado no nome do país (`"Name"`), que é outro campo comum na coleção `countryinfo` para indexar. Na descrição do campo do índice, `"TEXT(40)"` representa o número de caracteres a serem indexados e `"required": True` especifica que o campo é obrigatório para existir no documento.

```
mysql-py> db.countryinfo.create_index("name",
{"fields": [{"field": "$.Name", "type": "TEXT(40)", "required": True}], "unique": True})
```

##### Deixe um índice

Para excluir um índice, passe o nome do índice que deseja excluir para o método `drop_index()`. Por exemplo, você pode excluir o índice “popul” da seguinte forma:

```
mysql-py> db.countryinfo.drop_index("popul")
```

##### Informações Relacionadas

- Consulte Coleções de indexação para obter mais informações.

- Consulte Definindo um índice para obter mais informações sobre o documento JSON que define um índice.

- Consulte as funções de gerenciamento do índice de coleções para obter a definição completa da sintaxe.
