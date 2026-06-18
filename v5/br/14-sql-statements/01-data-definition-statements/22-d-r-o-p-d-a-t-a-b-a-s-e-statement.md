### 13.1.22 Declaração DROP DATABASE

```sql
DROP {DATABASE | SCHEMA} [IF EXISTS] db_name
```

A declaração `DROP DATABASE` remove todas as tables no Database e apaga o Database. Seja *muito* cuidadoso com esta declaração! Para usar `DROP DATABASE`, você precisa do privilégio `DROP` no Database. `DROP SCHEMA` é um sinônimo para `DROP DATABASE`.

Importante

Quando um Database é removido, os privilégios concedidos especificamente para aquele Database *não* são removidos automaticamente. Eles devem ser removidos manualmente. Consulte Seção 13.7.1.4, “Declaração GRANT”.

`IF EXISTS` é usado para prevenir que ocorra um erro caso o Database não exista.

Se o default Database for removido, o default Database é desconfigurado (a função `DATABASE()` retorna `NULL`).

Se você usar `DROP DATABASE` em um Database com link simbólico, tanto o link quanto o Database original são apagados.

O `DROP DATABASE` retorna o número de tables que foram removidas. Isso corresponde ao número de arquivos `.frm` removidos.

A declaração `DROP DATABASE` remove do diretório do Database fornecido aqueles arquivos e diretórios que o próprio MySQL pode criar durante a operação normal:

* Todos os arquivos com as seguintes extensões:

  + `.BAK`
  + `.DAT`
  + `.HSH`
  + `.MRG`
  + `.MYD`
  + `.MYI`
  + `.TRG`
  + `.TRN`
  + `.cfg`
  + `.db`
  + `.frm`
  + `.ibd`
  + `.ndb`
  + `.par`
* O arquivo `db.opt`, se existir.

Se outros arquivos ou diretórios permanecerem no diretório do Database após o MySQL remover aqueles listados, o diretório do Database não pode ser removido. Neste caso, você deve remover manualmente quaisquer arquivos ou diretórios restantes e emitir a declaração `DROP DATABASE` novamente.

Remover um Database não remove nenhuma table `TEMPORARY` que foi criada naquele Database. Tables `TEMPORARY` são removidas automaticamente quando a session que as criou termina. Consulte Seção 13.1.18.2, “Declaração CREATE TEMPORARY TABLE”.

Você também pode remover Databases com o **mysqladmin**. Consulte Seção 4.5.2, “mysqladmin — Um Programa de Administração de Servidor MySQL”.