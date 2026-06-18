### 6.8.2 perror — Exibir informações de mensagem de erro do MySQL

O **perror** exibe a mensagem de erro para códigos de erro do MySQL ou do sistema operacional. Inicie o **perror** da seguinte forma:

```
perror [options] errorcode ...
```

O **perror** tenta ser flexível na compreensão de seus argumentos. Por exemplo, para o erro `ER_WRONG_VALUE_FOR_VAR`, o **perror** entende qualquer um desses argumentos: `1231`, `001231`, `MY-1231`, `MY-001231` ou `ER_WRONG_VALUE_FOR_VAR`.

```
$> perror 1231
MySQL error code MY-001231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s'
can't be set to the value of '%-.200s'
```

Se um número de erro estiver na faixa onde os erros do MySQL e do sistema operacional se sobrepõem, o **perror** exibe ambas as mensagens de erro:

```
$> perror 1 13
OS error code   1:  Operation not permitted
MySQL error code MY-000001: Can't create/write to file '%s' (OS errno %d - %s)
OS error code  13:  Permission denied
MySQL error code MY-000013: Can't get stat of '%s' (OS errno %d - %s)
```

Para obter a mensagem de erro para um código de erro do MySQL Cluster, use o utilitário **ndb\_perror**.

O significado das mensagens de erro do sistema pode depender do seu sistema operacional. Um código de erro específico pode significar coisas diferentes em diferentes sistemas operacionais.

O **perror** suporta as seguintes opções.

- `--help`, `--info`, `-I`, `-?`

  Exiba uma mensagem de ajuda e saia.

- `--ndb`

  Imprima a mensagem de erro para um código de erro do MySQL Cluster.

  Essa opção foi removida no MySQL 8.0.13. Use o utilitário **ndb\_perror** em vez disso.

- `--silent`, `-s`

  Modo silencioso. Imprima apenas a mensagem de erro.

- `--verbose`, `-v`

  Modo verbose. Imprima o código de erro e a mensagem. Este é o comportamento padrão.

- `--version`, `-V`

  Exibir informações da versão e sair.
