#### B.3.3.1 Problemas com permissões de arquivo

Se você tiver problemas com permissões de arquivo, a variável de ambiente `UMASK` ou `UMASK_DIR` pode estar configurada incorretamente quando o [**mysqld**](mysqld.html) é iniciado. Por exemplo, o [**mysqld**](mysqld.html) pode emitir a seguinte mensagem de erro ao criar uma tabela:

```sql
ERROR: Can't find file: 'path/with/filename.frm' (Errcode: 13)
```

Os valores padrão de `UMASK` e `UMASK_DIR` são `0640` e `0750`, respectivamente. [**mysqld**](mysqld.html) assume que o valor para `UMASK` ou `UMASK_DIR` está em octal se começar com um zero. Por exemplo, definir `UMASK=0600` é equivalente a `UMASK=384` porque 0600 octal é 384 decimal.

Supondo que você iniciar o [**mysqld**](mysqld.html) usando [**mysqld_safe**](mysqld-safe.html), altere o valor padrão do `UMASK` da seguinte forma:

```sql
UMASK=384  # = 600 in octal
export UMASK
mysqld_safe &
```

Nota

Uma exceção se aplica ao arquivo de log de erro se você iniciar [**mysqld**](mysqld.html) usando [**mysqld_safe**](mysqld-safe.html), que não respeita `UMASK`: [**mysqld_safe**](mysqld-safe.html) pode criar o arquivo de log de erro se ele não existir antes de iniciar [**mysqld**](mysqld.html), e [**mysqld_safe**](mysqld-safe.html) usa um valor de `umask` definido para um valor rigoroso de `0137`. Se isso não for adequado, crie o arquivo de erro manualmente com o modo de acesso desejado antes de executar [**mysqld_safe**](mysqld-safe.html).

Por padrão, o [**mysqld**](mysqld.html) cria diretórios de banco de dados com um valor de permissão de acesso de `0750`. Para modificar esse comportamento, defina a variável `UMASK_DIR`. Se você definir seu valor, novos diretórios serão criados com os valores combinados de `UMASK` e `UMASK_DIR`. Por exemplo, para dar acesso ao grupo a todos os novos diretórios, inicie o [**mysqld_safe**](mysqld-safe.html) da seguinte forma:

```sql
UMASK_DIR=504  # = 770 in octal
export UMASK_DIR
mysqld_safe &
```

Para obter detalhes adicionais, consulte [Seção 4.9, “Variáveis de Ambiente”](environment-variables.html).
