### 15.8.4 Declaração `USE`

```
USE db_name
```

A declaração `USE` informa ao MySQL que o banco de dados nomeado deve ser usado como o banco de dados padrão (atual) para declarações subsequentes. Esta declaração requer algum privilégio para o banco de dados ou algum objeto dentro dele.

O nome do banco de dados nomeado permanece como padrão até o final da sessão ou até que outra declaração `USE` seja emitida:

```
USE db1;
SELECT COUNT(*) FROM mytable;   # selects from db1.mytable
USE db2;
SELECT COUNT(*) FROM mytable;   # selects from db2.mytable
```

O nome do banco de dados deve ser especificado em uma única linha. As novas linhas nos nomes dos bancos de dados não são suportadas.

Tornar um banco de dados específico o padrão por meio da declaração `USE` não impede o acesso a tabelas em outros bancos de dados. O exemplo a seguir acessa a tabela `author` do banco de dados `db1` e a tabela `editor` do banco de dados `db2`:

```
USE db1;
SELECT author_name,editor_name FROM author,db2.editor
  WHERE author.editor_id = db2.editor.editor_id;
```