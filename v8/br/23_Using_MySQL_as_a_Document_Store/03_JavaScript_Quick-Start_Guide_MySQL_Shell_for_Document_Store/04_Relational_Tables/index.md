### 22.3.4 Tabelas relacionais

22.3.4.1 Inserir registros em tabelas

22.3.4.2 Selecionar tabelas

22.3.4.3 Atualizar tabelas

22.3.4.4 Excluir tabelas

Você também pode usar o X DevAPI para trabalhar com tabelas relacionais. No MySQL, cada tabela relacional está associada a um motor de armazenamento específico. Os exemplos nesta seção usam tabelas `InnoDB` no esquema `world_x`.

#### Confirme o esquema

Para exibir o esquema atribuído à variável global `db`, digite `db`.

```
mysql-js> db
<Schema:world_x>
```

Se o valor retornado não for `Schema:world_x`, defina a variável `db` da seguinte forma:

```
mysql-js> \use world_x
Schema `world_x` accessible through db.
```

#### Mostrar todas as tabelas

Para exibir todas as tabelas relacionais no esquema `world_x`, use o método `getTables()` no objeto `db`.

```
mysql-js> db.getTables()
{
    "city": <Table:city>,
    "country": <Table:country>,
    "countrylanguage": <Table:countrylanguage>
}
```

#### Operações básicas com tabelas

As operações básicas definidas por tabelas incluem:

<table summary="Operações CRUD para uso interativo em tabelas dentro do MySQL Shell"><thead><tr> <th>Formulário de operação</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[<code>db.<em class="replaceable"><code>name</code>]]</em>.insert()</code></td> <td>O método insert() insere um ou mais registros na tabela nomeada.</td> </tr><tr> <td>[[<code>db.<em class="replaceable"><code>name</code>]]</em>.select()</code></td> <td>O método select() retorna alguns ou todos os registros na tabela nomeada.</td> </tr><tr> <td>[[<code>db.<em class="replaceable"><code>name</code>]]</em>.update()</code></td> <td>O método update() atualiza os registros na tabela nomeada.</td> </tr><tr> <td>[[<code>db.<em class="replaceable"><code>name</code>]]</em>.delete()</code></td> <td>O método delete() exclui um ou mais registros da tabela nomeada.</td> </tr></tbody></table>

#### Informações Relacionadas

- Veja Trabalhando com Tabelas Relacionais para obter mais informações.

- As definições CRUD EBNF fornecem uma lista completa das operações.

- Consulte a Seção 22.3.2, “Baixar e importar o banco de dados world\_x”, para obter instruções sobre a configuração da amostra do esquema `world_x`.
