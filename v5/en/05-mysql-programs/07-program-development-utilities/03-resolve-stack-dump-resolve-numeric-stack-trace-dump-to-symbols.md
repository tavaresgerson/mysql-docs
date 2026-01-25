### 4.7.3 resolve_stack_dump — Resolve Numeric Stack Trace Dump to Symbols

**resolve_stack_dump** resolve um dump numérico de Stack Trace para símbolos.

Nota

**resolve_stack_dump** está obsoleto e foi removido no MySQL 8.0. Stack Traces de builds oficiais do MySQL são sempre simbolizados, então não há necessidade de usar **resolve_stack_dump**.

Invoque **resolve_stack_dump** da seguinte forma:

```sql
resolve_stack_dump [options] symbols_file [numeric_dump_file]
```

O arquivo de símbolos deve incluir a saída do comando **nm --numeric-sort mysqld**. O arquivo de dump numérico deve conter um Stack Trace numérico do **mysqld**. Se nenhum arquivo de dump numérico for especificado na linha de comando, o Stack Trace é lido da entrada padrão.

**resolve_stack_dump** suporta as seguintes opções.

* `--help`, `-h`

  Exibe uma mensagem de ajuda e sai.

* `--numeric-dump-file=file_name`, `-n file_name`

  Lê o Stack Trace do arquivo fornecido.

* `--symbols-file=file_name`, `-s file_name`

  Usa o arquivo de símbolos fornecido.

* `--version`, `-V`

  Exibe informações de versão e sai.

Para mais informações, consulte a Seção 5.8.1.5, “Using a Stack Trace”.