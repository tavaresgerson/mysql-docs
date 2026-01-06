### 13.1.22 Declaração DROP DATABASE

```sql
DROP {DATABASE | SCHEMA} [IF EXISTS] db_name
```

`DROP DATABASE` elimina todas as tabelas do banco de dados e exclui o banco de dados. Tenha *muito cuidado* com essa declaração! Para usar `DROP DATABASE`, você precisa do privilégio `DROP` no banco de dados. `DROP SCHEMA` é sinônimo de `DROP DATABASE`.

Importante

Quando um banco de dados é excluído, os privilégios concedidos especificamente para o banco de dados não são *automaticamente* excluídos. Eles devem ser excluídos manualmente. Consulte Seção 13.7.1.4, "Instrução GRANT".

`IF EXISTS` é usado para evitar que um erro ocorra se a base de dados não existir.

Se o banco de dados padrão for excluído, o banco de dados padrão será desativado (a função `DATABASE()` retorna `NULL`).

Se você usar `DROP DATABASE` em um banco de dados vinculado simbolicamente, tanto o link quanto o banco de dados original serão excluídos.

`DROP DATABASE` retorna o número de tabelas que foram removidas. Isso corresponde ao número de arquivos `.frm` removidos.

A instrução `DROP DATABASE` remove do diretório do banco de dados fornecido aqueles arquivos e diretórios que o próprio MySQL pode criar durante o funcionamento normal:

- Todos os arquivos com as seguintes extensões:

  - `.BAK`
  - `.DAT`
  - `.HSH`
  - `.MRG`
  - `.MYD`
  - `.MYI`
  - `.TRG`
  - `.TRN`
  - `.cfg`
  - `.db`
  - `.frm`
  - `.ibd`
  - `.ndb`
  - `.par`
- O arquivo `db.opt`, se existir.

Se outros arquivos ou diretórios permanecerem no diretório do banco de dados após o MySQL remover os itens listados, o diretório do banco de dados não poderá ser removido. Nesse caso, você deve remover manualmente quaisquer arquivos ou diretórios restantes e emitir a instrução `DROP DATABASE` novamente.

A eliminação de um banco de dados não remove as tabelas `TEMPORARY` que foram criadas nesse banco de dados. As tabelas `TEMPORARY` são removidas automaticamente quando a sessão que as criou termina. Consulte Seção 13.1.18.2, “Instrução CREATE TEMPORARY TABLE”.

Você também pode criar ou excluir bancos de dados com **mysqladmin**. Veja Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.
