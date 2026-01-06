#### 13.7.6.6 Declaração de RESET

```sql
RESET reset_option [, reset_option] ...

reset_option: {
    MASTER
  | QUERY CACHE
  | SLAVE
}
```

A declaração `RESET` é usada para limpar o estado de várias operações do servidor. Você deve ter o privilégio `RELOAD` para executar `RESET`.

`RESET` atua como uma versão mais forte da instrução `FLUSH`. Veja Seção 13.7.6.3, “Instrução FLUSH”.

A declaração `RESET` causa um commit implícito. Veja Seção 13.3.3, “Declarações que causam um commit implícito”.

A lista a seguir descreve os valores permitidos da declaração `RESET` *`reset_option`*:

- `RESET MASTER`

  Exclui todos os logs binários listados no arquivo de índice, redefini o arquivo de índice do log binário para estar vazio e cria um novo arquivo de log binário.

- `REESTABELECER CACHE DA PESQUISA`

  Remove todos os resultados da consulta do cache de consulta.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A descontinuidade inclui `RESET QUERY CACHE`.

- `RESET SLAVE`

  Faz com que a replica esqueça sua posição de replicação nos logs binários de origem. Também reinicia o log de retransmissão, excluindo todos os arquivos de log de retransmissão existentes e iniciando um novo.
