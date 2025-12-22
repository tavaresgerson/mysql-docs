### 6.8.1 Perror  Mostrar informações de mensagem de erro do MySQL

**perror** exibe a mensagem de erro para códigos de erro do MySQL ou do sistema operacional. Invoque **perror** assim:

```
perror [options] errorcode ...
```

**perror** tenta ser flexível na compreensão de seus argumentos. Por exemplo, para o erro `ER_WRONG_VALUE_FOR_VAR`, **perror** entende qualquer um desses argumentos: `1231`, `001231`, `MY-1231`, ou `MY-001231`, ou `ER_WRONG_VALUE_FOR_VAR`.

```
$> perror 1231
MySQL error code MY-001231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s'
can't be set to the value of '%-.200s'
```

Se um número de erro estiver no intervalo em que os erros do MySQL e do sistema operacional se sobrepõem, **perror** exibirá ambas as mensagens de erro:

```
$> perror 1 13
OS error code   1:  Operation not permitted
MySQL error code MY-000001: Can't create/write to file '%s' (OS errno %d - %s)
OS error code  13:  Permission denied
MySQL error code MY-000013: Can't get stat of '%s' (OS errno %d - %s)
```

Para obter a mensagem de erro para um código de erro do MySQL Cluster, use o utilitário **ndb\_perror**.

O significado das mensagens de erro do sistema pode depender do seu sistema operacional. Um determinado código de erro pode significar coisas diferentes em diferentes sistemas operacionais.

**perror** suporta as seguintes opções.

- `--help`, `--info`, `-I`, `-?`

Mostra uma mensagem de ajuda e sai.

- `--silent`, `-s`

Imprima apenas a mensagem de erro.

- `--verbose`, `-v`

Código de erro de impressão e mensagem.

- `--version`, `-V`

Informações de versão e saída.
