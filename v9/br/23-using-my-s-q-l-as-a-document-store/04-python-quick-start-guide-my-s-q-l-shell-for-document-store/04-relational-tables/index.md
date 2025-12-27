### 22.4.4 Tabelas Relacionadas

22.4.4.1 Inserir Registros nas Tabelas

22.4.4.2 Selecionar Tabelas

22.4.4.3 Atualizar Tabelas

22.4.4.4 Deletar Tabelas

Você também pode usar o X DevAPI para trabalhar com tabelas relacionais. No MySQL, cada tabela relacional está associada a um motor de armazenamento específico. Os exemplos nesta seção usam tabelas `InnoDB` no esquema `world_x`.

#### Confirmar o Esquema

Para exibir o esquema atribuído à variável global `db`, execute `db`.

```
mysql-py> db
<Schema:world_x>
```

Se o valor retornado não for `Schema:world_x`, defina a variável `db` da seguinte forma:

```
mysql-py> \use world_x
Schema `world_x` accessible through db.
```

#### Mostrar Todas as Tabelas

Para exibir todas as tabelas relacionais no esquema `world_x`, use o método `get_tables()` no objeto `db`.

```
mysql-py> db.get_tables()
[
    <Table:city>,
    <Table:country>,
    <Table:countrylanguage>
]
```

#### Operações Básicas com Tabelas

As operações básicas por tabelas incluem:

<table summary="Operações CRUD para uso interativo em tabelas no MySQL Shell"><col style="width: 32%"/><col style="width: 68%"/><thead><tr> <th>Formulário da operação</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code class="literal">db.<em class="replaceable"><code>name</code></em>.insert()</code></td> <td>O método <a class="link" href="mysql-shell-tutorial-python-table-insert.html" title="22.4.4.1 Inserir registros em tabelas">insert()</a> insere um ou mais registros na tabela nomeada.</td> </tr><tr> <td><code class="literal">db.<em class="replaceable"><code>name</code></em>.select()</code></td> <td>O método <a class="link" href="mysql-shell-tutorial-python-table-select.html" title="22.4.4.2 Selecionar tabelas">select()</a> retorna alguns ou todos os registros na tabela nomeada.</td> </tr><tr> <td><code class="literal">db.<em class="replaceable"><code>name</code></em>.update()</code></td> <td>O método <a class="link" href="mysql-shell-tutorial-python-table-update.html" title="22.4.4.3 Atualizar tabelas">update()</a> atualiza registros na tabela nomeada.</td> </tr><tr> <td><code class="literal">db.<em class="replaceable"><code>name</code></em>.delete()</code></td> <td>O método <a class="link" href="mysql-shell-tutorial-python-table-delete.html" title="22.4.4.4 Deletar tabelas">delete()</a> exclui um ou mais registros da tabela nomeada.</td> </tr></tbody></table>

#### Informações Relacionadas

* Veja Trabalhando com Tabelas Relacionais para obter mais informações.

* Definições EBNF de CRUD fornecem uma lista completa das operações.

* Veja a Seção 22.4.2, “Baixar e importar o banco de dados world\_x” para instruções sobre a configuração da amostra de esquema `world_x`.