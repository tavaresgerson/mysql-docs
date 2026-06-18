### 4.8.2 perror — Exibir informações de mensagem de erro do MySQL

Para a maioria dos erros do sistema, o MySQL exibe, além de uma mensagem de texto interna, o código do erro do sistema em um dos seguintes estilos:

```sh
message ... (errno: #)
message ... (Errcode: #)
```

Você pode descobrir o que o código de erro significa examinando a documentação do seu sistema ou usando o utilitário **perror**.

O **perror** imprime uma descrição para um código de erro do sistema ou para um código de erro do mecanismo de armazenamento (manipulador de tabela).

Invoque **perror** da seguinte forma:

```sh
perror [options] errorcode ...
```

Exemplos:

```sh
$> perror 1231
MySQL error code 1231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s' can't
be set to the value of '%-.200s'
```

```sh
$> perror 13 64
OS error code  13:  Permission denied
OS error code  64:  Machine is not on the network
```

Para obter a mensagem de erro para um código de erro do MySQL Cluster, use o utilitário **ndb_perror**.

O significado das mensagens de erro do sistema pode depender do seu sistema operacional. Um código de erro específico pode significar coisas diferentes em diferentes sistemas operacionais.

O **perror** suporta as seguintes opções.

- `--help`, `--info`, `-I`, `-?`

  Exiba uma mensagem de ajuda e saia.

- `--ndb`

  Imprima a mensagem de erro para um código de erro do NDB Cluster.

  Esta opção foi descontinuada no NDB 7.6.4 e versões posteriores, onde **perror** exibe um aviso se for usado e é removida no NDB Cluster 8.0. Use o utilitário **ndb_perror** em vez disso.

- `--silent`, `-s`

  Modo silencioso. Imprima apenas a mensagem de erro.

- `--verbose`, `-v`

  Modo verbose. Imprima o código de erro e a mensagem. Este é o comportamento padrão.

- `--version`, `-V`

  Exibir informações da versão e sair.
