### 4.7.3 resolve\_stack\_dump — Resolver o dump da pilha numérica para símbolos

**resolve\_stack\_dump** resolve um dump de pilha numérica para símbolos.

Nota

**resolve\_stack\_dump** está desatualizado e será removido no MySQL 8.0. As traças de pilha das compilações oficiais do MySQL são sempre simbolizadas, portanto, não há necessidade de usar **resolve\_stack\_dump**.

Invoque **resolve\_stack\_dump** da seguinte forma:

```sql
resolve_stack_dump [options] symbols_file [numeric_dump_file]
```

O arquivo de símbolos deve incluir a saída do comando **nm --numeric-sort mysqld**. O arquivo de depuração numérica deve conter uma trilha de pilha numérica do **mysqld**. Se nenhum arquivo de depuração numérica estiver nomeado na linha de comando, a depuração da pilha é lida a partir da entrada padrão.

**resolve\_stack\_dump** suporta as seguintes opções.

- `--help`, `-h`

  Exiba uma mensagem de ajuda e saia.

- `--numeric-dump-file=file_name`, `-n file_name`

  Leia a traça de pilha do arquivo fornecido.

- `--symbols-file=file_name`, `-s file_name`

  Use o arquivo de símbolos fornecido.

- `--version`, `-V`

  Exibir informações da versão e sair.

Para obter mais informações, consulte a Seção 5.8.1.5, “Usando uma Traça de Pilha”.
