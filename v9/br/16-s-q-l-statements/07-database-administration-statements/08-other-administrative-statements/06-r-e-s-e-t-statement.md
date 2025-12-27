#### 15.7.8.6 Declaração `RESET`

```
RESET reset_option [, reset_option] ...

reset_option: {
    BINARY LOGS AND GTIDS
  | REPLICA
}
```

A declaração `RESET` é usada para limpar o estado de várias operações do servidor. Você deve ter o privilégio `RELOAD` para executar `RESET`.

Para obter informações sobre a declaração `RESET PERSIST` que remove variáveis globais do sistema persistidas, consulte a Seção 15.7.8.7, “Declaração `RESET PERSIST`”.

`RESET` atua como uma versão mais forte da declaração `FLUSH`. Consulte a Seção 15.7.8.3, “Declaração `FLUSH`”.

A declaração `RESET` causa um commit implícito. Consulte a Seção 15.3.3, “Declarações que causam um commit implícito”.

A lista a seguir descreve os valores permitidos da declaração `RESET *``reset_option`*:

* `RESET BINARY LOGS AND GTIDS`

  Exclui todos os logs binários listados no arquivo de índice, reescreve o arquivo de índice de log binário para estar vazio e cria um novo arquivo de log binário.

* `RESET REPLICA`

  Faz com que a replica esqueça sua posição de replicação nos logs binários de origem. Também reescreve o log de relevo, excluindo quaisquer arquivos de log de relevo existentes e iniciando um novo.