### 10.3.2 Conjunto de caracteres e codificação do servidor

O MySQL Server tem um conjunto de caracteres do servidor e uma ordenação do servidor. Por padrão, esses são `latin1` e `latin1_swedish_ci`, mas podem ser definidos explicitamente na inicialização do servidor na linha de comando ou em um arquivo de opção e alterados durante a execução.

Inicialmente, o conjunto de caracteres do servidor e a concordância dependem das opções que você usa ao iniciar o **mysqld**. Você pode usar `--character-set-server` para o conjunto de caracteres. Junto com isso, você pode adicionar `--collation-server` para a concordância. Se você não especificar um conjunto de caracteres, isso é o mesmo que dizer `--character-set-server=latin1`. Se você especificar apenas um conjunto de caracteres (por exemplo, `latin1`) mas não uma concordância, isso é o mesmo que dizer `--character-set-server=latin1` `--collation-server=latin1_swedish_ci`, pois `latin1_swedish_ci` é a concordância padrão para `latin1`. Portanto, os seguintes três comandos têm o mesmo efeito:

```sql
mysqld
mysqld --character-set-server=latin1
mysqld --character-set-server=latin1 \
  --collation-server=latin1_swedish_ci
```

Uma maneira de alterar as configurações é recompilar. Para alterar o conjunto de caracteres e a ordenação padrão do servidor ao compilar a partir de fontes, use as opções `DEFAULT_CHARSET` e `DEFAULT_COLLATION` para o **CMake**. Por exemplo:

```sql
cmake . -DDEFAULT_CHARSET=latin1
```

Ou:

```sql
cmake . -DDEFAULT_CHARSET=latin1 \
  -DDEFAULT_COLLATION=latin1_german1_ci
```

Tanto o **mysqld** quanto o **CMake** verificam se a combinação de conjunto de caracteres/coligação é válida. Se não for, cada programa exibe uma mensagem de erro e termina.

O conjunto de caracteres do servidor e a ordenação são usados como valores padrão se o conjunto de caracteres e a ordenação do banco de dados não forem especificados nas instruções `CREATE DATABASE`. Eles não têm outro propósito.

O conjunto de caracteres do servidor atual e a ordenação podem ser determinados pelos valores das variáveis de sistema `character_set_server` e `collation_server`. Essas variáveis podem ser alteradas em tempo de execução.
