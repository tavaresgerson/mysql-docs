#### 13.7.4.2 Declaração de conjunto de caracteres de definição

```sql
SET {CHARACTER SET | CHARSET}
    {'charset_name' | DEFAULT}
```

Esta declaração mapeia todas as cadeias de caracteres enviadas entre o servidor e o cliente atual com o mapeamento fornecido. `SET CHARACTER SET` define três variáveis do sistema de sessão: `character_set_client` e `character_set_results` são definidas para o conjunto de caracteres fornecido, e `character_set_connection` para o valor de `character_set_database`. Veja Seção 10.4, “Conjunto de caracteres de conexão e colagens”.

*`charset_name`* pode ser citado ou não citado.

O mapeamento do conjunto de caracteres padrão pode ser restaurado usando o valor `DEFAULT`. O padrão depende da configuração do servidor.

Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente. Tentar usá-los com `SET CHARACTER SET` produz um erro. Veja Conjunto de caracteres do cliente impermissível.
