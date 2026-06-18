#### 4.6.7.1 Formato de Hex Dump do mysqlbinlog

A opção `--hexdump` faz com que o **mysqlbinlog** produza um dump hexadecimal do conteúdo do log binário:

```sql
mysqlbinlog --hexdump master-bin.000001
```

A saída hexadecimal consiste em linhas de comentário que começam com `#`, então a saída pode parecer assim para o comando anterior:

```sql
/*!40019 SET @@SESSION.max_insert_delayed_threads=0*/;
/*!50003 SET @OLD_COMPLETION_TYPE=@@COMPLETION_TYPE,COMPLETION_TYPE=0*/;
# at 4
#051024 17:24:13 server id 1  end_log_pos 98
# Position  Timestamp   Type   Master ID        Size      Master Pos    Flags
# 00000004 9d fc 5c 43   0f   01 00 00 00   5e 00 00 00   62 00 00 00   00 00
# 00000017 04 00 35 2e 30 2e 31 35  2d 64 65 62 75 67 2d 6c |..5.0.15.debug.l|
# 00000027 6f 67 00 00 00 00 00 00  00 00 00 00 00 00 00 00 |og..............|
# 00000037 00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00 |................|
# 00000047 00 00 00 00 9d fc 5c 43  13 38 0d 00 08 00 12 00 |.......C.8......|
# 00000057 04 04 04 04 12 00 00 4b  00 04 1a                |.......K...|
#       Start: binlog v 4, server v 5.0.15-debug-log created 051024 17:24:13
#       at startup
ROLLBACK;
```

A saída de exibição de exaustão hexadecimal atualmente contém os elementos da lista a seguir. Esse formato está sujeito a alterações. Para obter mais informações sobre o formato de log binário, consulte MySQL Internals: O Log Binário.

- `Posição`: A posição do byte dentro do arquivo de registro.

- `Timestamp`: O timestamp do evento. No exemplo mostrado, `'9d fc 5c 43'` é a representação de `'051024 17:24:13'` em hexadecimal.

- `Tipo`: O código do tipo de evento.

- `Master ID`: O ID do servidor da fonte de replicação que criou o evento.

- `Tamanho`: O tamanho em bytes do evento.

- `Master Pos`: A posição do próximo evento no arquivo de log da fonte original.

- `Flags`: Valores de bandeira de evento.
