### 15.1.24 Declaração DROP DATABASE

```
DROP {DATABASE | SCHEMA} [IF EXISTS] db_name
```

`DROP DATABASE` elimina todas as tabelas do banco de dados e exclui o banco de dados. Use com *muito cuidado* essa declaração! Para usar `DROP DATABASE`, você precisa do privilégio `DROP` no banco de dados. `DROP SCHEMA` é sinônimo de `DROP DATABASE`.

Importante

Quando um banco de dados é excluído, os privilégios concedidos especificamente para o banco de dados não são *automaticamente* excluídos. Eles devem ser excluídos manualmente. Consulte a Seção 15.7.1.6, “Instrução GRANT”.

`IF EXISTS` é usado para evitar que um erro ocorra se o banco de dados não existir.

Se o banco de dados padrão for excluído, o banco de dados padrão será desativado (a função `DATABASE()` retorna `NULL`).

Se você usar `DROP DATABASE` em um banco de dados vinculado de forma simbólica, tanto o link quanto o banco de dados original serão excluídos.

`DROP DATABASE` retorna o número de tabelas removidas.

A declaração `DROP DATABASE` remove do diretório do banco de dados fornecido aqueles arquivos e diretórios que o próprio MySQL pode criar durante o funcionamento normal. Isso inclui todos os arquivos com as extensões mostradas na lista a seguir:

- `.BAK`
- `.DAT`
- `.HSH`
- `.MRG`
- `.MYD`
- `.MYI`
- `.cfg`
- `.db`
- `.ibd`
- `.ndb`

Se outros arquivos ou diretórios permanecerem no diretório do banco de dados após o MySQL remover os itens listados, o diretório do banco de dados não poderá ser removido. Nesse caso, você deve remover manualmente quaisquer arquivos ou diretórios restantes e emitir a instrução `DROP DATABASE` novamente.

A eliminação de um banco de dados não remove as tabelas `TEMPORARY` que foram criadas nesse banco de dados. As tabelas `TEMPORARY` são removidas automaticamente quando a sessão que as criou termina. Consulte a Seção 15.1.20.2, “Instrução CREATE TABLE”.

Você também pode criar ou excluir bancos de dados com o **mysqladmin**. Veja a Seção 6.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.
