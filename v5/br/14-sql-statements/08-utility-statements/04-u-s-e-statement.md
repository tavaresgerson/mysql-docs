### 13.8.4 Declaração de uso

```sql
USE db_name
```

A instrução `USE` informa ao MySQL que deve usar o banco de dados nomeado como o banco de dados padrão (atual) para as instruções subsequentes. Esta instrução requer algum privilégio para o banco de dados ou algum objeto dentro dele.

O banco de dados nomeado permanece como padrão até o final da sessão ou até que outra instrução `USE` seja emitida:

```sql
USE db1;
SELECT COUNT(*) FROM mytable;   # selects from db1.mytable
USE db2;
SELECT COUNT(*) FROM mytable;   # selects from db2.mytable
```

O nome do banco de dados deve ser especificado em uma única linha. As novas linhas nos nomes dos bancos de dados não são suportadas.

Tornar um banco de dados específico o padrão por meio da instrução `USE` não impede o acesso a tabelas em outros bancos de dados. O exemplo a seguir acessa a tabela `author` do banco de dados `db1` e a tabela `editor` do banco de dados `db2`:

```sql
USE db1;
SELECT author_name,editor_name FROM author,db2.editor
  WHERE author.editor_id = db2.editor.editor_id;
```
