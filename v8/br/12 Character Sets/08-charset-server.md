### 12.3.2 Conjunto de caracteres do servidor e ordenação

O MySQL Server possui um conjunto de caracteres do servidor e uma ordenação do servidor. Por padrão, esses são `utf8mb4` e `utf8mb4_0900_ai_ci`, mas podem ser definidos explicitamente no início do servidor na linha de comando ou em um arquivo de opção e alterados em tempo de execução.

Inicialmente, o conjunto de caracteres do servidor e a ordenação do servidor dependem das opções que você usa ao iniciar o `mysqld`. Você pode usar `--character-set-server` para o conjunto de caracteres. Junto com isso, você pode adicionar `--collation-server` para a ordenação. Se você não especificar um conjunto de caracteres, isso é o mesmo que dizer `--character-set-server=utf8mb4`. Se você especificar apenas um conjunto de caracteres (por exemplo, `utf8mb4`) mas não uma ordenação, isso é o mesmo que dizer `--character-set-server=utf8mb4` `--collation-server=utf8mb4_0900_ai_ci`, pois `utf8mb4_0900_ai_ci` é a ordenação padrão para `utf8mb4`. Portanto, os seguintes três comandos têm o mesmo efeito:

```
mysqld
mysqld --character-set-server=utf8mb4
mysqld --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_0900_ai_ci
```

Uma maneira de alterar as configurações é recompilar. Para alterar o conjunto de caracteres do servidor padrão e a ordenação padrão ao compilar a partir de fontes, use as opções `DEFAULT_CHARSET` e `DEFAULT_COLLATION` para o `CMake`. Por exemplo:

```
cmake . -DDEFAULT_CHARSET=latin1
```

Ou:

```
cmake . -DDEFAULT_CHARSET=latin1 \
  -DDEFAULT_COLLATION=latin1_german1_ci
```

Tanto o `mysqld` quanto o `CMake` verificam se a combinação de conjunto de caracteres/ordenação é válida. Se não for, cada programa exibe uma mensagem de erro e termina.

O conjunto de caracteres do servidor e a ordenação do servidor são usados como valores padrão se o conjunto de caracteres e a ordenação do banco de dados não forem especificados nas instruções `CREATE DATABASE`. Eles não têm outro propósito.

O conjunto de caracteres do servidor e a ordenação do servidor atuais podem ser determinados pelos valores das variáveis de sistema `character_set_server` e `collation_server`. Essas variáveis podem ser alteradas em tempo de execução.