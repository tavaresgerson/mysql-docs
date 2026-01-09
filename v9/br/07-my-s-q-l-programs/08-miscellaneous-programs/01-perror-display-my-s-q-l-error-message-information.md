### 6.8.1 perror — Exibir informações de mensagem de erro do MySQL

O **perror** exibe a mensagem de erro para códigos de erro do MySQL ou do sistema operacional. Inicie o **perror** da seguinte forma:

```
perror [options] errorcode ...
```

O **perror** tenta ser flexível para entender seus argumentos. Por exemplo, para o erro `ER_WRONG_VALUE_FOR_VAR`, o **perror** entende qualquer um desses argumentos: `1231`, `001231`, `MY-1231` ou `MY-001231`, ou `ER_WRONG_VALUE_FOR_VAR`.

```
$> perror 1231
MySQL error code MY-001231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s'
can't be set to the value of '%-.200s'
```

Se um número de erro estiver dentro do intervalo onde os erros do MySQL e do sistema operacional se sobrepõem, o **perror** exibe ambos os erros:

```
$> perror 1 13
OS error code   1:  Operation not permitted
MySQL error code MY-000001: Can't create/write to file '%s' (OS errno %d - %s)
OS error code  13:  Permission denied
MySQL error code MY-000013: Can't get stat of '%s' (OS errno %d - %s)
```

Para obter a mensagem de erro para um código de erro do MySQL Cluster, use o utilitário **ndb_perror**.

O significado das mensagens de erro do sistema pode depender do seu sistema operacional. Um código de erro dado pode significar coisas diferentes em diferentes sistemas operacionais.

O **perror** suporta as seguintes opções.

* `--help`, `--info`, `-I`, `-?`

  Exibir uma mensagem de ajuda e sair.

* `--silent`, `-s`

  Modo silencioso. Imprima apenas a mensagem de erro.

* `--verbose`, `-v`

  Modo verbose. Imprima o código de erro e a mensagem. Este é o comportamento padrão.

* `--version`, `-V`

  Exibir informações de versão e sair.