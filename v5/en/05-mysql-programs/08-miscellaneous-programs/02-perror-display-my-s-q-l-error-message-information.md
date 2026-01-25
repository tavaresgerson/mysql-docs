### 4.8.2 perror — Exibir Informações de Mensagens de Erro do MySQL

Para a maioria dos system errors, o MySQL exibe, além de uma mensagem de texto interna, o system error code em um dos seguintes estilos:

```sql
message ... (errno: #)
message ... (Errcode: #)
```

Você pode descobrir o que o error code significa examinando a documentação do seu sistema ou usando o utilitário **perror**.

O **perror** exibe uma descrição para um system error code ou para um error code do storage engine (manipulador de tabela).

Invoque o **perror** desta forma:

```sql
perror [options] errorcode ...
```

Exemplos:

```sql
$> perror 1231
MySQL error code 1231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s' can't
be set to the value of '%-.200s'
```

```sql
$> perror 13 64
OS error code  13:  Permission denied
OS error code  64:  Machine is not on the network
```

Para obter a mensagem de erro para um MySQL Cluster error code, utilize o utilitário **ndb_perror**.

O significado das mensagens de system error pode depender do seu sistema operacional. Um determinado error code pode significar coisas diferentes em sistemas operacionais distintos.

O **perror** suporta as seguintes opções.

* `--help`, `--info`, `-I`, `-?`

  Exibe uma mensagem de ajuda e sai.

* `--ndb`

  Exibe a mensagem de erro para um NDB Cluster error code.

  Esta opção está depreciada no NDB 7.6.4 e versões posteriores, onde o **perror** exibe um aviso se for utilizada, e foi removida no NDB Cluster 8.0. Use o utilitário **ndb_perror** em seu lugar.

* `--silent`, `-s`

  Modo silencioso. Exibe apenas a mensagem de erro.

* `--verbose`, `-v`

  Modo verbose. Exibe o error code e a mensagem. Este é o comportamento padrão.

* `--version`, `-V`

  Exibe informações de versão e sai.