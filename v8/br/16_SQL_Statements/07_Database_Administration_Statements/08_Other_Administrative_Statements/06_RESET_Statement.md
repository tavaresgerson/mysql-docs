#### 15.7.8.6 Declaração de RESET

```
RESET reset_option [, reset_option] ...

reset_option: {
    MASTER
  | REPLICA
  | SLAVE
}
```

A declaração `RESET` é usada para limpar o estado de várias operações do servidor. Você deve ter o privilégio `RELOAD` para executar `RESET`.

Para obter informações sobre a declaração `RESET PERSIST` que remove variáveis globais de sistema persistentes, consulte a Seção 15.7.8.7, “Declaração RESET PERSIST”.

`RESET` atua como uma versão mais forte da declaração `FLUSH`. Veja a Seção 15.7.8.3, “Declaração FLUSH”.

A declaração `RESET` causa um commit implícito. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

A lista a seguir descreve os valores permitidos da declaração `RESET` `reset_option`:

- `RESET MASTER`

  Exclui todos os logs binários listados no arquivo de índice, redefini o arquivo de índice do log binário para estar vazio e cria um novo arquivo de log binário.

- `RESET REPLICA`

  Faz com que a replica esqueça sua posição de replicação nos logs binários de origem. Também reinicia o log de retransmissão, excluindo todos os arquivos de log de retransmissão existentes e iniciando um novo. Use `RESET REPLICA` no lugar de `RESET SLAVE` a partir do MySQL 8.0.22.
