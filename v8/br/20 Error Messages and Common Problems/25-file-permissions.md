#### B.3.3.1 Problemas com permissões de arquivo

Se você tiver problemas com permissões de arquivo, a variável de ambiente `UMASK` ou `UMASK_DIR` pode estar configurada incorretamente quando o `mysqld` é iniciado. Por exemplo, o `mysqld` pode emitir a seguinte mensagem de erro ao criar uma tabela:

```
ERROR: Can't find file: 'path/with/file_name' (Errcode: 13)
```

Os valores padrão de `UMASK` e `UMASK_DIR` são `0640` e `0750`, respectivamente. O `mysqld` assume que o valor para `UMASK` ou `UMASK_DIR` é em octal se começar com um zero. Por exemplo, definir `UMASK=0600` é equivalente a `UMASK=384` porque 0600 octal é 384 decimal.

Supondo que você inicie o `mysqld` usando `mysqld_safe`, mude o valor padrão de `UMASK` da seguinte forma:

```
UMASK=384  # = 600 in octal
export UMASK
mysqld_safe &
```

::: info Nota

Uma exceção se aplica ao arquivo de log de erro se você iniciar o `mysqld` usando `mysqld_safe`, que não respeita `UMASK`: `mysqld_safe` pode criar o arquivo de log de erro se ele não existir antes do início do `mysqld`, e `mysqld_safe` usa um umask configurado para um valor rigoroso de `0137`. Se isso não for adequado, crie o arquivo de erro manualmente com o modo de acesso desejado antes de executar `mysqld_safe`.


Por padrão, o `mysqld` cria diretórios de banco de dados com um valor de permissão de acesso de `0750`. Para modificar esse comportamento, defina a variável `UMASK_DIR`. Se você definir seu valor, novos diretórios são criados com os valores combinados de `UMASK` e `UMASK_DIR`. Por exemplo, para dar acesso de grupo a todos os novos diretórios, inicie `mysqld_safe` da seguinte forma:

```
UMASK_DIR=504  # = 770 in octal
export UMASK_DIR
mysqld_safe &
```

Para obter detalhes adicionais, consulte a Seção 6.9, “Variáveis de ambiente”.