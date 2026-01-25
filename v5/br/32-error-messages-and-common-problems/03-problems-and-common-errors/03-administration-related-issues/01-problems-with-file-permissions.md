#### B.3.3.1 Problemas com Permissões de Arquivo

Se você tiver problemas com permissões de arquivo, a variável de ambiente `UMASK` ou `UMASK_DIR` pode estar definida incorretamente quando o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") inicia. Por exemplo, o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") pode emitir a seguinte mensagem de erro ao criar uma table:

```sql
ERROR: Can't find file: 'path/with/filename.frm' (Errcode: 13)
```

Os valores padrão para `UMASK` e `UMASK_DIR` são `0640` e `0750`, respectivamente. O [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") assume que o valor para `UMASK` ou `UMASK_DIR` está em octal se começar com zero. Por exemplo, definir `UMASK=0600` é equivalente a `UMASK=384` porque 0600 em octal é 384 em decimal.

Assumindo que você inicie o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") usando o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"), altere o valor padrão de `UMASK` da seguinte forma:

```sql
UMASK=384  # = 600 in octal
export UMASK
mysqld_safe &
```

Note

Aplica-se uma exceção para o arquivo de error log se você iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") usando o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"), que não respeita o `UMASK`: o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") pode criar o arquivo de error log se ele não existir antes de iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), e o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") usa um umask definido para o valor estrito de `0137`. Se isso for inadequado, crie o arquivo de erro manualmente com o modo de acesso desejado antes de executar o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script").

Por padrão, o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") cria diretórios de Database com um valor de permissão de acesso de `0750`. Para modificar esse comportamento, defina a variável `UMASK_DIR`. Se você definir seu valor, novos diretórios são criados com os valores combinados de `UMASK` e `UMASK_DIR`. Por exemplo, para conceder acesso de grupo a todos os novos diretórios, inicie o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") da seguinte forma:

```sql
UMASK_DIR=504  # = 770 in octal
export UMASK_DIR
mysqld_safe &
```

Para detalhes adicionais, consulte a [Section 4.9, “Environment Variables”](environment-variables.html "4.9 Environment Variables").