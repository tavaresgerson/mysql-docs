### 13.8.4 Instrução USE

```sql
USE db_name
```

A instrução [`USE`](use.html "13.8.4 USE Statement") informa ao MySQL para usar o Database nomeado como o Database padrão (atual) para as instruções subsequentes. Esta instrução exige algum privilégio para o Database ou algum objeto dentro dele.

O Database nomeado permanece como o padrão até o fim da sessão ou até que outra instrução [`USE`](use.html "13.8.4 USE Statement") seja emitida:

```sql
USE db1;
SELECT COUNT(*) FROM mytable;   # selects from db1.mytable
USE db2;
SELECT COUNT(*) FROM mytable;   # selects from db2.mytable
```

O nome do Database deve ser especificado em uma única linha. Quebras de linha (newlines) em nomes de Database não são suportadas.

Tornar um Database específico o padrão por meio da instrução [`USE`](use.html "13.8.4 USE Statement") não impede o acesso a tabelas em outros Databases. O exemplo a seguir acessa a tabela `author` do Database `db1` e a tabela `editor` do Database `db2`:

```sql
USE db1;
SELECT author_name,editor_name FROM author,db2.editor
  WHERE author.editor_id = db2.editor.editor_id;
```