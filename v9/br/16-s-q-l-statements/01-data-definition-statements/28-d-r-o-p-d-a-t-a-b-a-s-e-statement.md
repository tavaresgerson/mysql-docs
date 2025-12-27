### 15.1.28 Declaração `DROP DATABASE`

```
DROP {DATABASE | SCHEMA} [IF EXISTS] db_name
```

`DROP DATABASE` exclui todas as tabelas do banco de dados e apaga o banco de dados. Tenha muito cuidado com essa declaração! Para usar `DROP DATABASE`, você precisa do privilégio `DROP` no banco de dados. `DROP SCHEMA` é um sinônimo de `DROP DATABASE`.

Importante

Quando um banco de dados é excluído, os privilégios concedidos especificamente para o banco de dados não são excluídos automaticamente. Eles devem ser excluídos manualmente. Veja a Seção 15.7.1.6, “Declaração GRANT”.

`IF EXISTS` é usado para evitar que um erro ocorra se o banco de dados não existir.

Se o banco de dados padrão for excluído, o banco de dados padrão é desativado (a função `DATABASE()` retorna `NULL`).

Se você usar `DROP DATABASE` em um banco de dados vinculado simbolicamente, tanto o link quanto o banco de dados original são excluídos.

`DROP DATABASE` retorna o número de tabelas removidas.

A declaração `DROP DATABASE` remove do diretório do banco de dados os arquivos e diretórios que o próprio MySQL pode criar durante o funcionamento normal. Isso inclui todos os arquivos com as extensões mostradas na lista a seguir:

* `.BAK`
* `.DAT`
* `.HSH`
* `.MRG`
* `.MYD`
* `.MYI`
* `.cfg`
* `.db`
* `.ibd`
* `.ndb`

Se outros arquivos ou diretórios permanecerem no diretório do banco de dados após o MySQL remover os listados acima, o diretório do banco de dados não pode ser excluído. Nesse caso, você deve remover manualmente quaisquer arquivos ou diretórios restantes e emitir a declaração `DROP DATABASE` novamente. Para evitar que isso aconteça, certifique-se de que todas as tabelas no banco de dados utilizam um mecanismo de armazenamento que suporte DDL (Definição de Dados Atômica) atômico (veja a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômica”), como `InnoDB`.

A remoção de um banco de dados não remove as tabelas `TEMPORARY` que foram criadas nesse banco de dados. As tabelas `TEMPORARY` são removidas automaticamente quando a sessão que as criou termina. Consulte a Seção 15.1.24.2, “Instrução CREATE TEMPORARY TABLE”.

Você também pode remover bancos de dados com **mysqladmin**. Consulte a Seção 6.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.