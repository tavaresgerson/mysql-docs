### 10.3.2 Character Set e Collation do Server

O MySQL Server possui um character set e um collation do server. Por padrão, estes são `latin1` e `latin1_swedish_ci`, mas eles podem ser definidos explicitamente no *startup* do server na *command line* ou em um arquivo de opção e alterados em *runtime*.

Inicialmente, o character set e o collation do server dependem das opções que você usa ao iniciar o **mysqld**. Você pode usar `--character-set-server` para o character set. Juntamente com isso, você pode adicionar `--collation-server` para o collation. Se você não especificar um character set, isso é o mesmo que dizer `--character-set-server=latin1`. Se você especificar apenas um character set (por exemplo, `latin1`), mas não um collation, isso é o mesmo que dizer `--character-set-server=latin1` `--collation-server=latin1_swedish_ci`, pois `latin1_swedish_ci` é o collation padrão para `latin1`. Portanto, os três comandos a seguir têm o mesmo efeito:

```sql
mysqld
mysqld --character-set-server=latin1
mysqld --character-set-server=latin1 \
  --collation-server=latin1_swedish_ci
```

Uma maneira de alterar as configurações é recompilando. Para alterar o character set e o collation padrão do server ao compilar a partir dos códigos-fonte (*sources*), use as opções `DEFAULT_CHARSET` e `DEFAULT_COLLATION` para o **CMake**. Por exemplo:

```sql
cmake . -DDEFAULT_CHARSET=latin1
```

Ou:

```sql
cmake . -DDEFAULT_CHARSET=latin1 \
  -DDEFAULT_COLLATION=latin1_german1_ci
```

Tanto o **mysqld** quanto o **CMake** verificam se a combinação character set/collation é válida. Caso contrário, cada programa exibe uma mensagem de erro e é encerrado.

O character set e o collation do server são usados como valores padrão se o character set e o collation do Database não forem especificados nas instruções `CREATE DATABASE`. Eles não têm outro propósito.

O character set e o collation atuais do server podem ser determinados a partir dos valores das variáveis de sistema `character_set_server` e `collation_server`. Essas variáveis podem ser alteradas em *runtime*.